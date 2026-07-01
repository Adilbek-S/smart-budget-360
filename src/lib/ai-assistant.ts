import type { DepartmentId, PeriodId, Year } from "./types";
import {
  BUDGET_LINES,
  DEPARTMENTS,
  INCOME_PRODUCT_ROWS,
  departmentName,
  departmentShort,
  getDeviations,
  getDepartmentIncomeBars,
  getIncomeForecast,
  getKpi,
  getProblemArticles,
  productName,
} from "./mock-data";
import { formatCompactTenge, formatPercent, formatSignedPercent } from "./format";

export interface AiContext {
  year: Year;
  period: PeriodId;
  scope: "org" | DepartmentId;
}

export type AiStatTone = "positive" | "negative" | "warning" | "neutral";

export interface AiStat {
  label: string;
  value: string;
  tone?: AiStatTone;
}

export interface AiAnswer {
  paragraphs: string[];
  stats: AiStat[];
  recommendations?: string[];
}

export type AiQueryId =
  | "risk_overrun"
  | "department_lag"
  | "savings"
  | "products_income"
  | "plan_vs_forecast"
  | "deviations";

export const AI_QUICK_QUERIES: { id: AiQueryId; label: string }[] = [
  { id: "risk_overrun", label: "Где есть риск превышения бюджета?" },
  { id: "department_lag", label: "Какие подразделения отстают от плана?" },
  { id: "savings", label: "Найди возможности для экономии." },
  { id: "products_income", label: "Какие продукты не выполняют план доходов?" },
  { id: "plan_vs_forecast", label: "Сравни план и прогноз." },
  { id: "deviations", label: "Объясни крупнейшие отклонения." },
];

const NEUTRAL_ANSWER: AiAnswer = {
  paragraphs: [
    "Я могу помочь проанализировать расходы, доходы, исполнение бюджета, отклонения и сценарии. Выберите один из предложенных запросов или уточните интересующий показатель.",
  ],
  stats: [],
};

function pluralRu(n: number, one: string, few: string, many: string): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few;
  return many;
}

function departmentGenitive(id: DepartmentId): string {
  if (id === "adm") return "Административного департамента";
  return departmentName(id).replace(/^Департамент/, "Департамента");
}

function departmentDative(id: DepartmentId): string {
  if (id === "adm") return "Административному департаменту";
  return departmentName(id).replace(/^Департамент/, "Департаменту");
}

function departmentLocative(id: DepartmentId): string {
  if (id === "adm") return "Административном департаменте";
  return departmentName(id).replace(/^Департамент/, "Департаменте");
}

function scopeDescription(scope: "org" | DepartmentId): string {
  return scope === "org" ? "организации в целом" : departmentDative(scope);
}

function aggregateProductIncome(year: Year, scope: "org" | DepartmentId) {
  const rows = INCOME_PRODUCT_ROWS.filter(
    (r) => r.year === year && (scope === "org" || r.department === scope)
  );
  const map = new Map<string, { plan: number; fact: number }>();
  rows.forEach((r) => {
    const cur = map.get(r.productId) ?? { plan: 0, fact: 0 };
    cur.plan += r.incomePlan;
    cur.fact += r.incomeFact;
    map.set(r.productId, cur);
  });
  return Array.from(map.entries())
    .map(([productId, v]) => ({
      productId,
      name: productName(productId),
      plan: v.plan,
      fact: v.fact,
      completionPercent: v.plan > 0 ? (v.fact / v.plan) * 100 : 100,
    }))
    .filter((p) => p.plan > 0);
}

function answerRiskOverrun(ctx: AiContext): AiAnswer {
  const rows = getProblemArticles(ctx.year, ctx.scope, "expense").filter(
    (r) => r.state === "overrun"
  );

  if (rows.length === 0) {
    return {
      paragraphs: [
        `По ${scopeDescription(ctx.scope)} статей с риском превышения бюджета не выявлено.`,
        "Прогноз исполнения по всем статьям укладывается в утверждённые лимиты — риск превышения на текущий момент низкий.",
      ],
      stats: [{ label: "Статей с риском превышения", value: "0", tone: "positive" }],
    };
  }

  const sorted = [...rows].sort((a, b) => b.forecast - b.plan - (a.forecast - a.plan));
  const top = sorted[0];
  const deviationAmount = top.forecast - top.plan;
  const deviationPercent = top.plan > 0 ? (top.forecast / top.plan - 1) * 100 : 0;
  const totalOverrun = sorted.reduce((sum, r) => sum + Math.max(0, r.forecast - r.plan), 0);
  const articleWord = pluralRu(rows.length, "статья", "статьи", "статей");

  return {
    paragraphs: [
      `Наибольший риск выявлен по статье «${top.article}» ${departmentGenitive(top.department)}. Прогноз превышает утверждённый план на ${formatPercent(deviationPercent)}, или на ${formatCompactTenge(deviationAmount)}.`,
      `Всего выявлено ${rows.length} ${articleWord} с риском превышения бюджета на общую сумму ${formatCompactTenge(totalOverrun)}. Рекомендуется усилить контроль исполнения по указанным направлениям до конца периода.`,
    ],
    stats: [
      { label: `Риск — «${top.article}»`, value: formatCompactTenge(deviationAmount), tone: "negative" },
      { label: "Статей с риском превышения", value: String(rows.length), tone: "warning" },
      { label: "Суммарное превышение", value: formatCompactTenge(totalOverrun), tone: "negative" },
    ],
    recommendations: [
      `Пересмотреть график закупок по статье «${top.article}» и зафиксировать лимит до конца года.`,
      "Запросить обоснование у ответственных подразделений по остальным статьям с риском превышения.",
    ],
  };
}

function answerDepartmentLag(ctx: AiContext): AiAnswer {
  const bars = getDepartmentIncomeBars(ctx.year, ctx.period);
  const relevant = ctx.scope === "org" ? bars : bars.filter((b) => b.departmentId === ctx.scope);
  const lagging = [...relevant]
    .filter((b) => b.executionPercent < 90)
    .sort((a, b) => a.executionPercent - b.executionPercent);

  if (lagging.length === 0) {
    return {
      paragraphs: [
        `По ${scopeDescription(ctx.scope)} все подразделения демонстрируют исполнение плана по доходам не ниже 90%.`,
        "Существенного отставания от плана на текущий период не зафиксировано.",
      ],
      stats: [{ label: "Отстающих подразделений", value: "0", tone: "positive" }],
    };
  }

  const top = lagging[0];
  const gap = top.plan - top.fact;
  const deptWord = pluralRu(lagging.length, "подразделение", "подразделения", "подразделений");
  const lagVerb = lagging.length === 1 ? "отстаёт" : "отстают";

  return {
    paragraphs: [
      `${lagging.length} ${deptWord} ${lagVerb} от плана по доходам. Наибольшее отставание — у ${departmentGenitive(top.departmentId)}: исполнение плана составляет ${formatPercent(top.executionPercent)} (факт ${formatCompactTenge(top.fact)} при плане ${formatCompactTenge(top.plan)}).`,
      `Отставание создаёт риск невыполнения годового плана по доходам на ${formatCompactTenge(gap)}. Рекомендуется активизировать работу с клиентами и пересмотреть каналы привлечения по данному направлению.`,
    ],
    stats: [
      { label: "Отстающих подразделений", value: String(lagging.length), tone: "warning" },
      { label: `Исполнение — ${departmentShort(top.departmentId)}`, value: formatPercent(top.executionPercent), tone: "negative" },
      { label: "Отставание по сумме", value: formatCompactTenge(gap), tone: "negative" },
    ],
    recommendations: [
      `Провести разбор причин отставания в ${departmentLocative(top.departmentId)}.`,
      "Пересмотреть план продаж или тарифную политику по продуктам с наибольшим отклонением.",
    ],
  };
}

function answerSavings(ctx: AiContext): AiAnswer {
  const lines = BUDGET_LINES.filter(
    (l) => l.year === ctx.year && (ctx.scope === "org" || l.department === ctx.scope)
  );
  const candidates = lines
    .map((l) => ({ article: l.article, department: l.department, gap: l.amountPlan - l.amountFact, plan: l.amountPlan }))
    .filter((l) => l.plan > 0 && l.gap >= l.plan * 0.08)
    .sort((a, b) => b.gap - a.gap);

  return candidates.length
    ? buildSavingsAnswer(candidates, ctx)
    : {
        paragraphs: [
          `По ${scopeDescription(ctx.scope)} явных резервов для экономии не выявлено.`,
          "Фактические расходы близки к плановым значениям по большинству статей бюджета.",
        ],
        stats: [{ label: "Потенциальная экономия", value: "0 ₸", tone: "neutral" }],
      };
}

function buildSavingsAnswer(
  candidates: { article: string; department: DepartmentId; gap: number; plan: number }[],
  ctx: AiContext
): AiAnswer {
  const top = candidates.slice(0, 3);
  const total = top.reduce((sum, c) => sum + c.gap, 0);
  const articleWord = pluralRu(candidates.length, "статья", "статьи", "статей");

  return {
    paragraphs: [
      `Потенциальная экономия по ${scopeDescription(ctx.scope)} составляет около ${formatCompactTenge(total)}. Основные резервы связаны со статьями «${top[0].article}»${top[1] ? ` и «${top[1].article}»` : ""}.`,
      `Всего выявлено ${candidates.length} ${articleWord}, где факт заметно ниже плана. Рекомендуется перенести часть закупок на следующий период и объединить схожие заявки для снижения затрат.`,
    ],
    stats: [
      { label: "Потенциальная экономия", value: formatCompactTenge(total), tone: "positive" },
      { label: "Статей с резервом", value: String(candidates.length), tone: "neutral" },
      { label: `Наибольший резерв — «${top[0].article}»`, value: formatCompactTenge(top[0].gap), tone: "positive" },
    ],
    recommendations: [
      `Перенести часть закупок по статье «${top[0].article}» на следующий период.`,
      top[1] ? `Объединить заявки по статье «${top[1].article}» для снижения затрат.` : "Пересмотреть условия договоров с поставщиками по статьям с наибольшим резервом.",
    ],
  };
}

function answerProductsIncome(ctx: AiContext): AiAnswer {
  const products = aggregateProductIncome(ctx.year, ctx.scope);
  const lagging = products
    .filter((p) => p.completionPercent < 100)
    .sort((a, b) => a.completionPercent - b.completionPercent);

  if (lagging.length === 0) {
    return {
      paragraphs: [
        `По ${scopeDescription(ctx.scope)} все продукты выполняют или перевыполняют план доходов.`,
        "Отстающих продуктов на текущий период не выявлено.",
      ],
      stats: [{ label: "Продуктов не выполняют план", value: "0", tone: "positive" }],
    };
  }

  const top = lagging[0];
  const deviationPercent = 100 - top.completionPercent;
  const totalGap = lagging.reduce((sum, p) => sum + Math.max(0, p.plan - p.fact), 0);
  const productWord = pluralRu(lagging.length, "продукт", "продукта", "продуктов");
  const lagVerb = lagging.length === 1 ? "отстаёт" : "отстают";

  return {
    paragraphs: [
      `${lagging.length} ${productWord} ${lagVerb} от плана доходов. Наибольшее отклонение наблюдается по продукту «${top.name}»: фактический доход ниже плана на ${formatPercent(deviationPercent)}.`,
      `Суммарный дефицит доходов по отстающим продуктам составляет ${formatCompactTenge(totalGap)}. Рекомендуется проанализировать тарифную политику и клиентский спрос по указанным продуктам.`,
    ],
    stats: [
      { label: `Отставание — «${top.name}»`, value: formatCompactTenge(top.plan - top.fact), tone: "negative" },
      { label: "Продуктов не выполняют план", value: String(lagging.length), tone: "warning" },
      { label: "Суммарный дефицит доходов", value: formatCompactTenge(totalGap), tone: "negative" },
    ],
  };
}

function answerPlanVsForecast(ctx: AiContext): AiAnswer {
  const kpi = getKpi(ctx.year, ctx.period, ctx.scope);
  const expenseDeltaPercent = kpi.budgetExpense > 0 ? (kpi.forecastExpense / kpi.budgetExpense - 1) * 100 : 0;
  const incomeForecastFull = getIncomeForecast(ctx.year, ctx.scope);

  return {
    paragraphs: [
      `План расходов на ${ctx.year} год составляет ${formatCompactTenge(kpi.budgetExpense)}, прогноз исполнения на конец года — ${formatCompactTenge(kpi.forecastExpense)} (${formatSignedPercent(expenseDeltaPercent)} к плану).`,
      `Ожидаемая экономия по итогам года — ${formatCompactTenge(kpi.savings)}. Прогноз доходов на конец года составляет ${formatCompactTenge(incomeForecastFull)}, текущее исполнение бюджета расходов — ${formatPercent(kpi.executionPercent)}.`,
    ],
    stats: [
      { label: "План расходов", value: formatCompactTenge(kpi.budgetExpense), tone: "neutral" },
      {
        label: "Прогноз расходов",
        value: formatCompactTenge(kpi.forecastExpense),
        tone: expenseDeltaPercent > 2 ? "negative" : expenseDeltaPercent < -2 ? "positive" : "neutral",
      },
      { label: "Прогноз доходов", value: formatCompactTenge(incomeForecastFull), tone: "neutral" },
    ],
  };
}

function answerDeviations(ctx: AiContext): AiAnswer {
  const rows = getDeviations(ctx.year, ctx.scope);

  if (rows.length === 0) {
    return {
      paragraphs: [`По ${scopeDescription(ctx.scope)} значимых отклонений плана от факта не зафиксировано.`],
      stats: [{ label: "Отклонений", value: "0", tone: "positive" }],
    };
  }

  const withDelta = rows.map((r) => ({
    ...r,
    gap: r.fact - r.plan,
    percent: r.plan > 0 ? (r.fact / r.plan - 1) * 100 : 0,
  }));
  const sorted = [...withDelta].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
  const top = sorted.slice(0, 3);

  return {
    paragraphs: [
      `Наибольшее отклонение зафиксировано по статье «${top[0].article}» (${departmentShort(top[0].department)}): факт отличается от плана на ${formatSignedPercent(top[0].percent)}, или на ${formatCompactTenge(top[0].gap)}.`,
      top.length > 1
        ? `Также заметны отклонения по статьям ${top
            .slice(1)
            .map((r) => `«${r.article}» (${formatSignedPercent(r.percent)})`)
            .join(" и ")}. Рекомендуется уточнить причины у ответственных подразделений.`
        : "Остальные статьи находятся в пределах допустимых колебаний плана.",
    ],
    stats: top.map((r) => ({
      label: `${r.article} (${departmentShort(r.department)})`,
      value: formatSignedPercent(r.percent),
      tone: r.gap >= 0 ? (r.status === "critical" ? "negative" : "warning") : "warning",
    })),
  };
}

export function answerQuery(id: AiQueryId, ctx: AiContext): AiAnswer {
  switch (id) {
    case "risk_overrun":
      return answerRiskOverrun(ctx);
    case "department_lag":
      return answerDepartmentLag(ctx);
    case "savings":
      return answerSavings(ctx);
    case "products_income":
      return answerProductsIncome(ctx);
    case "plan_vs_forecast":
      return answerPlanVsForecast(ctx);
    case "deviations":
      return answerDeviations(ctx);
    default:
      return NEUTRAL_ANSWER;
  }
}

export function answerFreeText(text: string, ctx: AiContext): AiAnswer {
  const q = text.toLowerCase();
  if (q.includes("продукт")) return answerQuery("products_income", ctx);
  if (q.includes("подразделен")) return answerQuery("department_lag", ctx);
  if (q.includes("эконом")) return answerQuery("savings", ctx);
  if (q.includes("риск") || q.includes("превышен")) return answerQuery("risk_overrun", ctx);
  if (q.includes("отклонен")) return answerQuery("deviations", ctx);
  if (q.includes("прогноз")) return answerQuery("plan_vs_forecast", ctx);
  if (q.includes("доход")) return answerQuery("products_income", ctx);
  if (q.includes("расход")) return answerQuery("risk_overrun", ctx);
  return NEUTRAL_ANSWER;
}

export function departmentContextLabel(scope: "org" | DepartmentId): string {
  return scope === "org" ? "Организация в целом" : DEPARTMENTS.find((d) => d.id === scope)?.name ?? "";
}
