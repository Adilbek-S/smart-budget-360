import type {
  ActionLogEntry,
  ApprovalRequest,
  BudgetLine,
  BudgetRisk,
  BudgetState,
  BudgetVersion,
  Department,
  DepartmentId,
  DeviationRow,
  ExpenseCategory,
  ExpenseCategoryId,
  HistoryEntry,
  IncomeProductRow,
  KpiData,
  MonthPoint,
  PeriodId,
  Product,
  ProblemArticleRow,
  ReviewItem,
  ScenarioParams,
  ScenarioPreset,
  ScenarioResult,
  Year,
} from "./types";

export const YEARS: Year[] = [2025, 2026, 2027];

export const PERIODS: { id: PeriodId; label: string; months: number[] }[] = [
  { id: "year", label: "Год", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: "q1", label: "I квартал", months: [1, 2, 3] },
  { id: "q2", label: "II квартал", months: [4, 5, 6] },
  { id: "q3", label: "III квартал", months: [7, 8, 9] },
  { id: "q4", label: "IV квартал", months: [10, 11, 12] },
];

export const MONTH_NAMES = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];

export const DEPARTMENTS: Department[] = [
  { id: "techdev", name: "Департамент разработки и развития технологий", short: "ДРиРТ" },
  { id: "it", name: "Департамент информационных технологий", short: "ДИТ" },
  { id: "opscontrol", name: "Департамент операционного контроля", short: "ДОК" },
  { id: "cards", name: "Департамент карточного процессинга", short: "ДКП" },
  {
    id: "antifraud",
    name: "Департамент по противодействию мошенническим действиям — Антифрод-центр",
    short: "ДпПМД АЦ",
  },
  { id: "payments", name: "Департамент развития платёжных систем", short: "ДРПС" },
  { id: "digitaltenge", name: "Департамент системы Цифрового тенге", short: "ДСЦТ" },
  {
    id: "orgdev",
    name: "Департамент по организационному развитию и трансформации",
    short: "ДпОРРиТ",
  },
  { id: "fin", name: "Финансовый департамент", short: "ФД" },
  { id: "sec", name: "Управление информационной безопасности", short: "УИБ" },
  {
    id: "architecture",
    name: "Управление архитектуры решений и контроля качества",
    short: "УАРиКК",
  },
  { id: "astana", name: "Представительство в г. Астана", short: "Представительство" },
  { id: "adm", name: "Административно-хозяйственный отдел", short: "АХО" },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: "staff", name: "Персонал" },
  { id: "it_infra", name: "ИТ-инфраструктура" },
  { id: "software", name: "Программное обеспечение" },
  { id: "services", name: "Услуги" },
  { id: "travel", name: "Командировки" },
  { id: "other", name: "Прочее" },
];

export const CATEGORY_COLORS: Record<ExpenseCategoryId, string> = {
  staff: "#295A5B",
  it_infra: "#4A7D71",
  software: "#659945",
  services: "#8AAE73",
  travel: "#C68A1E",
  other: "#9AA5A3",
};

const DEPARTMENT_WEIGHT: Record<DepartmentId, number> = {
  techdev: 0.14,
  it: 0.13,
  opscontrol: 0.09,
  cards: 0.12,
  antifraud: 0.05,
  payments: 0.11,
  digitaltenge: 0.06,
  orgdev: 0.05,
  fin: 0.1,
  sec: 0.07,
  architecture: 0.05,
  astana: 0.02,
  adm: 0.01,
};

const INCOME_DEPARTMENT_WEIGHT: Record<DepartmentId, number> = {
  techdev: 0.05,
  it: 0.14,
  opscontrol: 0.06,
  cards: 0.28,
  antifraud: 0.01,
  payments: 0.22,
  digitaltenge: 0.1,
  orgdev: 0.01,
  fin: 0.06,
  sec: 0.01,
  architecture: 0.02,
  astana: 0.03,
  adm: 0.01,
};

const DEPT_EXEC_RATE: Record<DepartmentId, number> = {
  techdev: 0.65,
  it: 0.63,
  opscontrol: 0.55,
  cards: 0.7,
  antifraud: 0.48,
  payments: 0.68,
  digitaltenge: 0.52,
  orgdev: 0.4,
  fin: 0.5,
  sec: 0.42,
  architecture: 0.45,
  astana: 0.6,
  adm: 0.58,
};

const ORG_EXEC_RATE: Record<Year, number> = {
  2025: 0.955,
  2026: 0.578125,
  2027: 0,
};

const YEAR_INCOME: Record<Year, number> = {
  2025: 8_100_000_000,
  2026: 8_900_000_000,
  2027: 9_800_000_000,
};

const SEASONAL_WEIGHTS = [
  0.062, 0.066, 0.078, 0.08, 0.082, 0.086, 0.086, 0.086, 0.09, 0.094, 0.096,
  0.094,
];

// Org-level monthly series, hand-authored to match headline KPI figures.
const ORG_SERIES: Record<Year, MonthPoint[]> = {
  2026: [
    { month: 1, plan: 793_600_000, fact: 1_010_000_000, forecast: null },
    { month: 2, plan: 844_800_000, fact: 1_076_000_000, forecast: null },
    { month: 3, plan: 998_400_000, fact: 1_271_000_000, forecast: null },
    { month: 4, plan: 1_024_000_000, fact: 1_304_000_000, forecast: null },
    { month: 5, plan: 1_049_600_000, fact: 1_336_000_000, forecast: null },
    { month: 6, plan: 1_100_800_000, fact: 1_403_000_000, forecast: null },
    { month: 7, plan: 1_100_800_000, fact: null, forecast: 803_000_000 },
    { month: 8, plan: 1_100_800_000, fact: null, forecast: 803_000_000 },
    { month: 9, plan: 1_152_000_000, fact: null, forecast: 841_000_000 },
    { month: 10, plan: 1_203_200_000, fact: null, forecast: 878_000_000 },
    { month: 11, plan: 1_228_800_000, fact: null, forecast: 897_000_000 },
    { month: 12, plan: 1_203_200_000, fact: null, forecast: 878_000_000 },
  ],
  2025: [
    { month: 1, plan: 694_400_000, fact: 663_000_000, forecast: null },
    { month: 2, plan: 739_200_000, fact: 706_000_000, forecast: null },
    { month: 3, plan: 873_600_000, fact: 834_000_000, forecast: null },
    { month: 4, plan: 896_000_000, fact: 856_000_000, forecast: null },
    { month: 5, plan: 918_400_000, fact: 877_000_000, forecast: null },
    { month: 6, plan: 963_200_000, fact: 920_000_000, forecast: null },
    { month: 7, plan: 963_200_000, fact: 920_000_000, forecast: null },
    { month: 8, plan: 963_200_000, fact: 920_000_000, forecast: null },
    { month: 9, plan: 1_008_000_000, fact: 963_000_000, forecast: null },
    { month: 10, plan: 1_052_800_000, fact: 1_005_000_000, forecast: null },
    { month: 11, plan: 1_075_200_000, fact: 1_027_000_000, forecast: null },
    { month: 12, plan: 1_052_800_000, fact: 1_005_000_000, forecast: null },
  ],
  2027: SEASONAL_WEIGHTS.map((w, i) => ({
    month: i + 1,
    plan: Math.round(w * 14_300_000_000),
    fact: null,
    forecast: null,
  })),
};

function scaleSeries(series: MonthPoint[], scope: "org" | DepartmentId, year: Year): MonthPoint[] {
  if (scope === "org") return series;
  const weight = DEPARTMENT_WEIGHT[scope];
  const orgRate = ORG_EXEC_RATE[year] || 1;
  const execAdjust = DEPT_EXEC_RATE[scope] / orgRate;
  return series.map((p) => ({
    month: p.month,
    plan: Math.round(p.plan * weight),
    fact: p.fact === null ? null : Math.round(p.fact * weight * execAdjust),
    forecast:
      p.forecast === null ? null : Math.round(p.forecast * weight * execAdjust),
  }));
}

export function getMonthlySeries(year: Year, scope: "org" | DepartmentId): MonthPoint[] {
  return scaleSeries(ORG_SERIES[year], scope, year);
}

function sumRange(series: MonthPoint[], months: number[]) {
  let plan = 0;
  let fact = 0;
  let forecast = 0;
  for (const p of series) {
    if (!months.includes(p.month)) continue;
    plan += p.plan;
    fact += p.fact ?? 0;
    forecast += p.forecast ?? p.fact ?? 0;
  }
  return { plan, fact, forecast };
}

const KPI_DELTAS: Record<Year, KpiData["deltas"]> = {
  2025: {
    budgetExpense: 9.7,
    actualExpense: 7.2,
    executionPercent: 1.4,
    income: 6.5,
    forecastExpense: 7.2,
    savings: -12,
  },
  2026: {
    budgetExpense: 14.3,
    actualExpense: 9.6,
    executionPercent: 2.1,
    income: 9.9,
    forecastExpense: 16.9,
    savings: -40.5,
  },
  2027: {
    budgetExpense: 11.7,
    actualExpense: 0,
    executionPercent: 0,
    income: 10.1,
    forecastExpense: 14.4,
    savings: 0,
  },
};

export function getKpi(year: Year, period: PeriodId, scope: "org" | DepartmentId): KpiData {
  const periodDef = PERIODS.find((p) => p.id === period)!;
  const series = getMonthlySeries(year, scope);

  const periodTotals = sumRange(series, periodDef.months);
  const yearTotals = sumRange(series, PERIODS[0].months);

  const periodWeight = periodDef.months.reduce(
    (sum, m) => sum + SEASONAL_WEIGHTS[m - 1],
    0
  );
  const scopeIncomeWeight = scope === "org" ? 1 : INCOME_DEPARTMENT_WEIGHT[scope];
  const income = Math.round(YEAR_INCOME[year] * periodWeight * scopeIncomeWeight);

  const budgetExpense = periodTotals.plan;
  const actualExpense = periodTotals.fact;
  const executionPercent =
    budgetExpense > 0 ? (actualExpense / budgetExpense) * 100 : 0;

  const fullYearBudget = yearTotals.plan;
  const forecastFull =
    year === 2027 ? fullYearBudget : yearTotals.fact + sumRange(series, [7, 8, 9, 10, 11, 12]).forecast;
  const savings = fullYearBudget - forecastFull;

  return {
    budgetExpense,
    actualExpense,
    executionPercent,
    income,
    forecastExpense: forecastFull,
    savings,
    deltas: KPI_DELTAS[year],
  };
}

export function getDepartmentExecutionBars(year: Year, period: PeriodId) {
  const periodDef = PERIODS.find((p) => p.id === period)!;
  return DEPARTMENTS.map((dept) => {
    const series = getMonthlySeries(year, dept.id);
    const totals = sumRange(series, periodDef.months);
    return {
      department: dept.short,
      departmentId: dept.id,
      plan: totals.plan,
      fact: totals.fact,
      executionPercent: totals.plan > 0 ? Math.round((totals.fact / totals.plan) * 1000) / 10 : 0,
    };
  });
}

const CATEGORY_DISTRIBUTION: Record<"org" | DepartmentId, Record<ExpenseCategoryId, number>> = {
  org: { staff: 46, it_infra: 18, software: 14, services: 12, travel: 5, other: 5 },
  techdev: { staff: 44, it_infra: 16, software: 26, services: 8, travel: 3, other: 3 },
  it: { staff: 32, it_infra: 34, software: 20, services: 8, travel: 3, other: 3 },
  opscontrol: { staff: 40, it_infra: 28, software: 8, services: 16, travel: 4, other: 4 },
  cards: { staff: 36, it_infra: 30, software: 14, services: 14, travel: 2, other: 4 },
  antifraud: { staff: 50, it_infra: 10, software: 28, services: 6, travel: 2, other: 4 },
  payments: { staff: 48, it_infra: 12, software: 22, services: 10, travel: 5, other: 3 },
  digitaltenge: { staff: 40, it_infra: 22, software: 24, services: 8, travel: 3, other: 3 },
  orgdev: { staff: 50, it_infra: 5, software: 8, services: 24, travel: 8, other: 5 },
  fin: { staff: 55, it_infra: 5, software: 10, services: 18, travel: 4, other: 8 },
  sec: { staff: 38, it_infra: 20, software: 26, services: 10, travel: 3, other: 3 },
  architecture: { staff: 48, it_infra: 14, software: 24, services: 8, travel: 3, other: 3 },
  astana: { staff: 56, it_infra: 6, software: 4, services: 16, travel: 12, other: 6 },
  adm: { staff: 58, it_infra: 4, software: 6, services: 14, travel: 8, other: 10 },
};

export function getCategoryDistribution(scope: "org" | DepartmentId, totalActual: number) {
  const dist = CATEGORY_DISTRIBUTION[scope];
  return EXPENSE_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    percent: dist[cat.id],
    value: Math.round((totalActual * dist[cat.id]) / 100),
    color: CATEGORY_COLORS[cat.id],
  }));
}

export const BUDGET_RISKS: BudgetRisk[] = [
  {
    id: "r1",
    title: "Превышение бюджета по ИТ-инфраструктуре",
    description:
      "Департамент ИТ израсходовал 63% годового бюджета уже к июлю — риск перерасхода до конца года.",
    department: "it",
    severity: "critical",
  },
  {
    id: "r2",
    title: "Отставание по освоению бюджета ИБ",
    description:
      "Департамент информационной безопасности использует лишь 42% бюджета — риск невыполнения плановых мероприятий.",
    department: "sec",
    severity: "warning",
  },
  {
    id: "r3",
    title: "Рост командировочных расходов",
    description:
      "Расходы на командировки в Департаменте развития продуктов превысили план на 18% во II квартале.",
    department: "payments",
    severity: "warning",
  },
  {
    id: "r4",
    title: "Задержка согласования крупной заявки",
    description:
      "Заявка на закупку серверного оборудования на 210 млн ₸ находится на согласовании более 14 дней.",
    department: "opscontrol",
    severity: "critical",
  },
  {
    id: "r5",
    title: "Риск кассового разрыва в IV квартале",
    description:
      "При текущем темпе расходования прогнозируется нехватка средств по статье «Услуги» в ноябре-декабре.",
    department: "fin",
    severity: "warning",
  },
  {
    id: "r6",
    title: "Неполное освоение бюджета на обучение",
    description:
      "Административный департамент использовал только 31% бюджета на обучение и развитие персонала.",
    department: "adm",
    severity: "info",
  },
  {
    id: "r7",
    title: "Превышение лимита по лицензиям ПО",
    description:
      "Расходы на лицензии программного обеспечения в Департаменте ИБ выросли на 22% относительно плана.",
    department: "sec",
    severity: "warning",
  },
  {
    id: "r8",
    title: "Высокий темп расходования резерва",
    description:
      "Резервный фонд Департамента эксплуатации использован на 70% раньше запланированного срока.",
    department: "opscontrol",
    severity: "critical",
  },
];

export function getRisksForScope(scope: "org" | DepartmentId, limit = 4): BudgetRisk[] {
  const severityRank: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  if (scope === "org") {
    return [...BUDGET_RISKS]
      .sort((a, b) => severityRank[a.severity] - severityRank[b.severity])
      .slice(0, limit);
  }
  const filtered = BUDGET_RISKS.filter((r) => r.department === scope);
  return filtered.length > 0 ? filtered.slice(0, limit) : BUDGET_RISKS.slice(0, limit);
}

export const APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: "a1",
    title: "Закупка серверного оборудования",
    department: "opscontrol",
    amount: 210_000_000,
    author: "Ержан Тулегенов",
    submittedAt: "2026-06-18",
    status: "pending",
  },
  {
    id: "a2",
    title: "Продление лицензий Microsoft 365",
    department: "it",
    amount: 48_500_000,
    author: "Динара Ахметова",
    submittedAt: "2026-06-22",
    status: "pending",
  },
  {
    id: "a3",
    title: "Маркетинговое исследование рынка",
    department: "payments",
    amount: 15_800_000,
    author: "Алия Сериккызы",
    submittedAt: "2026-06-25",
    status: "pending",
  },
  {
    id: "a4",
    title: "Обучение персонала по кибербезопасности",
    department: "sec",
    amount: 9_200_000,
    author: "Марат Жумабеков",
    submittedAt: "2026-06-27",
    status: "pending",
  },
  {
    id: "a5",
    title: "Аренда дополнительных офисных площадей",
    department: "adm",
    amount: 32_000_000,
    author: "Гульнара Бекова",
    submittedAt: "2026-06-10",
    status: "approved",
  },
  {
    id: "a6",
    title: "Консалтинговые услуги по МСФО",
    department: "fin",
    amount: 18_400_000,
    author: "Асем Нурланова",
    submittedAt: "2026-06-05",
    status: "approved",
  },
  {
    id: "a7",
    title: "Командировка на международную конференцию",
    department: "payments",
    amount: 6_500_000,
    author: "Тимур Оспанов",
    submittedAt: "2026-06-14",
    status: "rejected",
    comment: "Превышение лимита командировочных расходов",
  },
  {
    id: "a8",
    title: "Закупка резервных серверов ЦОД",
    department: "opscontrol",
    amount: 95_000_000,
    author: "Ержан Тулегенов",
    submittedAt: "2026-05-30",
    status: "rejected",
    comment: "Требуется пересмотр технического задания",
  },
];

export function getApprovalsForScope(
  scope: "org" | DepartmentId,
  status: "pending" | "approved" | "rejected" = "pending",
  limit = 4
): ApprovalRequest[] {
  const base = APPROVAL_REQUESTS.filter((a) => a.status === status);
  const filtered = scope === "org" ? base : base.filter((a) => a.department === scope);
  return (filtered.length > 0 ? filtered : base).slice(0, limit);
}

const DEVIATIONS_2026: DeviationRow[] = [
  { id: "d1", year: 2026, department: "it", article: "Лицензии программного обеспечения", plan: 180_000_000, fact: 236_000_000, status: "critical" },
  { id: "d2", year: 2026, department: "payments", article: "Командировочные расходы", plan: 42_000_000, fact: 55_000_000, status: "warning" },
  { id: "d3", year: 2026, department: "opscontrol", article: "Аренда серверных мощностей", plan: 260_000_000, fact: 312_000_000, status: "warning" },
  { id: "d4", year: 2026, department: "sec", article: "Обучение и сертификация", plan: 38_000_000, fact: 16_000_000, status: "warning" },
  { id: "d5", year: 2026, department: "fin", article: "Консалтинговые услуги", plan: 60_000_000, fact: 41_000_000, status: "warning" },
  { id: "d6", year: 2026, department: "adm", article: "Административно-хозяйственные расходы", plan: 54_000_000, fact: 71_000_000, status: "critical" },
  { id: "d7", year: 2026, department: "it", article: "Облачная инфраструктура", plan: 210_000_000, fact: 248_000_000, status: "warning" },
  { id: "d8", year: 2026, department: "payments", article: "Маркетинговые исследования", plan: 30_000_000, fact: 33_500_000, status: "normal" },
  { id: "d9", year: 2026, department: "opscontrol", article: "Техническое обслуживание оборудования", plan: 96_000_000, fact: 94_000_000, status: "normal" },
  { id: "d10", year: 2026, department: "sec", article: "Лицензии средств защиты информации", plan: 88_000_000, fact: 118_000_000, status: "critical" },
];

const DEVIATIONS_2025: DeviationRow[] = [
  { id: "d11", year: 2025, department: "it", article: "Программное обеспечение", plan: 150_000_000, fact: 168_000_000, status: "warning" },
  { id: "d12", year: 2025, department: "fin", article: "Аудиторские услуги", plan: 45_000_000, fact: 42_000_000, status: "normal" },
  { id: "d13", year: 2025, department: "opscontrol", article: "Аренда оборудования", plan: 220_000_000, fact: 265_000_000, status: "critical" },
  { id: "d14", year: 2025, department: "adm", article: "Хозяйственные расходы", plan: 48_000_000, fact: 50_000_000, status: "normal" },
  { id: "d15", year: 2025, department: "payments", article: "Исследования рынка", plan: 26_000_000, fact: 19_000_000, status: "warning" },
];

export const DEVIATIONS: DeviationRow[] = [...DEVIATIONS_2026, ...DEVIATIONS_2025];

export function getDeviations(year: Year, scope: "org" | DepartmentId): DeviationRow[] {
  const byYear = DEVIATIONS.filter((d) => d.year === year);
  return scope === "org" ? byYear : byYear.filter((d) => d.department === scope);
}

export const HISTORY_ENTRIES: HistoryEntry[] = [
  { id: "h1", date: "2026-06-28", author: "Адилбек Сагадиев", department: "it", action: "Утверждение заявки", details: "Утверждена заявка на продление лицензий Microsoft 365 на сумму 48,5 млн ₸" },
  { id: "h2", date: "2026-06-25", author: "Айгерим Смагулова", department: "fin", action: "Корректировка бюджета", details: "Перераспределено 25 млн ₸ со статьи «Командировки» на статью «Услуги»" },
  { id: "h3", date: "2026-06-20", author: "Марат Жумабеков", department: "sec", action: "Создание заявки", details: "Подана заявка на обучение персонала по кибербезопасности на 9,2 млн ₸" },
  { id: "h4", date: "2026-06-14", author: "Бюджетный комитет", department: "payments", action: "Отклонение заявки", details: "Отклонена заявка на командировку в связи с превышением лимита" },
  { id: "h5", date: "2026-06-10", author: "Гульнара Бекова", department: "adm", action: "Утверждение заявки", details: "Утверждена заявка на аренду офисных площадей на 32 млн ₸" },
  { id: "h6", date: "2026-05-30", author: "Ержан Тулегенов", department: "opscontrol", action: "Отклонение заявки", details: "Отклонена заявка на закупку резервных серверов — требуется пересмотр ТЗ" },
  { id: "h7", date: "2026-05-15", author: "Адилбек Сагадиев", department: "org", action: "Утверждение сценария", details: "Утверждён базовый сценарий бюджета на III квартал 2026 года" },
  { id: "h8", date: "2026-04-30", author: "Асем Нурланова", department: "fin", action: "Закрытие периода", details: "Закрыт отчётный период за I квартал 2026 года, сформирован отчёт об исполнении" },
  { id: "h9", date: "2026-03-12", author: "Динара Ахметова", department: "it", action: "Корректировка бюджета", details: "Увеличен бюджет на облачную инфраструктуру на 15 млн ₸ за счёт статьи «Прочее»" },
  { id: "h10", date: "2026-01-20", author: "Адилбек Сагадиев", department: "org", action: "Утверждение бюджета", details: "Утверждён консолидированный бюджет расходов организации на 2026 год в размере 12,8 млрд ₸" },
];

export function departmentName(id: DepartmentId): string {
  return DEPARTMENTS.find((d) => d.id === id)?.name ?? id;
}

export function departmentShort(id: DepartmentId): string {
  return DEPARTMENTS.find((d) => d.id === id)?.short ?? id;
}

// ---- Доходы ----

const INCOME_PLAN: Record<Year, number> = {
  2025: 8_300_000_000,
  2026: 9_200_000_000,
  2027: 10_000_000_000,
};

export function getIncomeMonthlySeries(
  year: Year,
  scope: "org" | DepartmentId
): { month: number; plan: number; fact: number | null }[] {
  const scopeWeight = scope === "org" ? 1 : INCOME_DEPARTMENT_WEIGHT[scope];
  const lastActualMonth = year === 2025 ? 12 : year === 2026 ? 6 : 0;
  return SEASONAL_WEIGHTS.map((w, i) => {
    const month = i + 1;
    const plan = Math.round(INCOME_PLAN[year] * w * scopeWeight);
    const fact =
      month <= lastActualMonth
        ? Math.round(YEAR_INCOME[year] * w * scopeWeight)
        : null;
    return { month, plan, fact };
  });
}

export function getIncomeMonthlySeriesWithForecast(
  year: Year,
  scope: "org" | DepartmentId
): MonthPoint[] {
  const base = getIncomeMonthlySeries(year, scope);
  const realized = base.filter((p) => p.fact !== null);
  const factSum = realized.reduce((s, p) => s + (p.fact ?? 0), 0);
  const planSumRealized = realized.reduce((s, p) => s + p.plan, 0);
  const paceRatio = planSumRealized > 0 ? factSum / planSumRealized : 1;
  return base.map((p) => ({
    month: p.month,
    plan: p.plan,
    fact: p.fact,
    forecast: p.fact === null ? Math.round(p.plan * paceRatio) : null,
  }));
}

export const INCOME_SOURCES: { id: string; name: string; percent: number; color: string }[] = [
  { id: "products", name: "Реализация продуктов и услуг", percent: 52, color: "#295A5B" },
  { id: "subscriptions", name: "Абонентское обслуживание", percent: 21, color: "#4A7D71" },
  { id: "finance", name: "Финансовые и процентные доходы", percent: 12, color: "#659945" },
  { id: "other", name: "Прочие доходы", percent: 15, color: "#C68A1E" },
];

export function getIncomeSources(totalIncome: number) {
  return INCOME_SOURCES.map((s) => ({
    ...s,
    value: Math.round((totalIncome * s.percent) / 100),
  }));
}

// ---- Сценарное моделирование ----
// Простая линейная модель: базовые годовые расходы/доходы 2026 года (12,8 млрд ₸ / 9,2 млрд ₸)
// корректируются пользовательскими параметрами через несколько долевых коэффициентов.

export const SCENARIO_BASE_EXPENSE = 12_800_000_000;
export const SCENARIO_BASE_INCOME = 9_200_000_000;
export const SCENARIO_BASE_USD = 480;

const IT_COST_SHARE = 0.25; // доля расходов, чувствительная к стоимости ИТ-ресурсов и курсу доллара
const OPEX_SHARE = 0.75; // доля расходов, растущая вместе с операционными расходами
const USER_INCOME_WEIGHT = 0.3; // вклад роста пользователей в рост доходов

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "conservative",
    name: "Консервативный",
    description: "Рост стоимости ИТ-ресурсов и ослабление тенге при сдержанном росте доходов.",
    params: { incomeGrowth: 2, opexGrowth: 9, itCostGrowth: 14, usdRate: 520, userGrowth: -3 },
  },
  {
    id: "base",
    name: "Базовый",
    description: "Текущие плановые темпы роста доходов и расходов без существенных отклонений.",
    params: { incomeGrowth: 8, opexGrowth: 4, itCostGrowth: 6, usdRate: 480, userGrowth: 5 },
  },
  {
    id: "optimistic",
    name: "Оптимистичный",
    description: "Ускоренный рост пользовательской базы и доходов при сдержанных расходах.",
    params: { incomeGrowth: 15, opexGrowth: 1, itCostGrowth: 2, usdRate: 460, userGrowth: 12 },
  },
];

export function calculateScenario(params: ScenarioParams): ScenarioResult {
  const usdDeltaPercent = ((params.usdRate - SCENARIO_BASE_USD) / SCENARIO_BASE_USD) * 100;
  const expenseDeltaPercent =
    params.opexGrowth * OPEX_SHARE + (params.itCostGrowth + usdDeltaPercent) * IT_COST_SHARE;
  const incomeDeltaPercent = params.incomeGrowth + params.userGrowth * USER_INCOME_WEIGHT;

  const expense = Math.round(SCENARIO_BASE_EXPENSE * (1 + expenseDeltaPercent / 100));
  const income = Math.round(SCENARIO_BASE_INCOME * (1 + incomeDeltaPercent / 100));

  return {
    expense,
    income,
    result: income - expense,
    expenseDeltaPercent,
    incomeDeltaPercent,
  };
}

export const BASE_SCENARIO_RESULT = calculateScenario(
  SCENARIO_PRESETS.find((s) => s.id === "base")!.params
);

// ---- Продукты (общие для расходов и доходов) ----

export const PRODUCTS: Product[] = [
  { id: "mspd", name: "МСПД", stage: "existing", department: "payments" },
  { id: "smk_clearing", name: "СМК (Клиринг)", stage: "existing", department: "payments" },
  { id: "smep", name: "СМЭП", stage: "existing", department: "payments" },
  { id: "sobs", name: "СОБС", stage: "existing", department: "it" },
  { id: "mobile_interbank", name: "Межбанковская система мобильных платежей", stage: "new", department: "payments" },
  { id: "digital_tenge", name: "Цифровой теңге", stage: "new", department: "digitaltenge" },
  { id: "antifraud_center", name: "Антифрод-центр", stage: "existing", department: "antifraud" },
  { id: "remote_id", name: "Удаленная идентификация (ЦОИД)", stage: "new", department: "it" },
  { id: "open_banking", name: "Система Открытого банкинга", stage: "new", department: "techdev" },
  { id: "cert_authority", name: "Удостоверяющий центр", stage: "existing", department: "sec" },
  { id: "card_interbank", name: "Межбанковская система платежных карточек", stage: "existing", department: "cards" },
  { id: "fasti", name: "ФАСТИ", stage: "existing", department: "opscontrol" },
  { id: "swift_bureau", name: "SWIFT сервисное бюро", stage: "existing", department: "payments" },
  { id: "none", name: "Без привязки к продукту", stage: "existing", department: "adm" },
];

export function productName(id: string | null): string {
  if (!id) return "Без привязки к продукту";
  return PRODUCTS.find((p) => p.id === id)?.name ?? id;
}

export const PRODUCT_STAGE_LABEL: Record<Product["stage"], string> = {
  new: "Новый",
  existing: "Действующий",
};

// ---- Расходы: бюджетные строки ----

export const BUDGET_LINE_TYPE_LABEL: Record<BudgetLine["type"], string> = {
  opex: "OPEX",
  capex: "CAPEX",
};

export const BUDGET_LINE_STATUS_META: Record<
  BudgetLine["status"],
  { label: string; tone: "neutral" | "warning" | "normal" | "critical" }
> = {
  draft: { label: "Черновик", tone: "neutral" },
  review: { label: "На согласовании", tone: "warning" },
  approved: { label: "Согласовано", tone: "normal" },
  clarification: { label: "Требует уточнения", tone: "critical" },
};

export const BUDGET_LINES: BudgetLine[] = [
  {
    id: "bl1",
    year: 2026,
    quarter: 1,
    department: "it",
    article: "Лицензии корпоративного программного обеспечения",
    type: "opex",
    unit: "лиц.",
    quantityPlan: 220,
    quantityFact: 236,
    amountPlan: 44_000_000,
    amountFact: 47_200_000,
    calculation: "236 лицензий × 200 000 ₸ ≈ 47 200 000 ₸",
    justification:
      "Расширение парка лицензий Microsoft 365 и Oracle в связи с ростом штата ИТ и продуктовых команд в первом квартале.",
    relatedDepartments: ["payments", "opscontrol"],
    productId: "sobs",
    status: "approved",
    risk: "none",
    author: "Динара Ахметова",
    updatedAt: "2026-06-15T14:32:00",
    factSource: "auto",
    history: [
      {
        id: "bl1-h1",
        dateTime: "2026-01-12T10:05:00",
        author: "Динара Ахметова",
        field: "Статья",
        oldValue: "—",
        newValue: "Лицензии корпоративного программного обеспечения",
        comment: "Строка создана при формировании бюджета на 2026 год.",
      },
      {
        id: "bl1-h2",
        dateTime: "2026-06-15T14:32:00",
        author: "Айжан Нуртаева",
        field: "Плановая сумма",
        oldValue: "42 000 000 ₸",
        newValue: "44 000 000 ₸",
        comment: "Увеличение количества лицензий.",
      },
    ],
  },
  {
    id: "bl2",
    year: 2026,
    quarter: 2,
    department: "it",
    article: "Серверное оборудование для ЦОД",
    type: "capex",
    unit: "шт.",
    quantityPlan: 12,
    quantityFact: 14,
    amountPlan: 180_000_000,
    amountFact: 214_000_000,
    calculation: "14 серверов × 15 285 714 ₸ ≈ 214 000 000 ₸",
    justification:
      "Дополнительная закупка серверов для расширения мощностей процессингового центра на фоне роста транзакционной нагрузки SmartPay.",
    relatedDepartments: ["payments", "opscontrol"],
    productId: "none",
    status: "review",
    risk: "high",
    author: "Ержан Тулегенов",
    updatedAt: "2026-06-02T11:15:00",
    factSource: "manual",
    history: [
      {
        id: "bl2-h1",
        dateTime: "2026-02-01T09:00:00",
        author: "Ержан Тулегенов",
        field: "Статья",
        oldValue: "—",
        newValue: "Серверное оборудование для ЦОД",
        comment: "Строка создана при формировании бюджета на 2026 год.",
      },
      {
        id: "bl2-h2",
        dateTime: "2026-05-20T16:40:00",
        author: "Ержан Тулегенов",
        field: "Плановое количество",
        oldValue: "10 шт.",
        newValue: "12 шт.",
        comment: "Скорректирован план закупки под новый прогноз нагрузки.",
      },
      {
        id: "bl2-h3",
        dateTime: "2026-06-02T11:15:00",
        author: "Ержан Тулегенов",
        field: "Статус",
        oldValue: "Черновик",
        newValue: "На согласовании",
        comment: "Заявка направлена на согласование бюджетному комитету.",
      },
    ],
  },
  {
    id: "bl3",
    year: 2026,
    quarter: 1,
    department: "it",
    article: "Сопровождение информационных систем",
    type: "opex",
    unit: "дог.",
    quantityPlan: 1,
    quantityFact: 1,
    amountPlan: 36_000_000,
    amountFact: 34_500_000,
    calculation: "1 договор техподдержки на год ≈ 34 500 000 ₸ факт по I кварталу",
    justification: "Ежегодный договор технической поддержки контакт-центра и смежных систем.",
    relatedDepartments: ["opscontrol"],
    productId: "smk_clearing",
    status: "approved",
    risk: "none",
    author: "Динара Ахметова",
    updatedAt: "2026-03-10T13:20:00",
    factSource: "auto",
    history: [
      {
        id: "bl3-h1",
        dateTime: "2026-01-10T09:30:00",
        author: "Динара Ахметова",
        field: "Статья",
        oldValue: "—",
        newValue: "Сопровождение информационных систем",
        comment: "Строка создана при формировании бюджета на 2026 год.",
      },
      {
        id: "bl3-h2",
        dateTime: "2026-03-10T13:20:00",
        author: "Динара Ахметова",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Согласовано",
        comment: "Договор подписан, бюджет утверждён.",
      },
    ],
  },
  {
    id: "bl4",
    year: 2026,
    quarter: 2,
    department: "sec",
    article: "Обучение сотрудников по кибербезопасности",
    type: "opex",
    unit: "чел.",
    quantityPlan: 40,
    quantityFact: 18,
    amountPlan: 12_000_000,
    amountFact: 5_400_000,
    calculation: "18 сотрудников × 300 000 ₸ = 5 400 000 ₸",
    justification: "Обучение специалистов по стандарту ISO 27001 и практикам реагирования на инциденты.",
    relatedDepartments: ["it"],
    productId: "antifraud_center",
    status: "draft",
    risk: "moderate",
    author: "Марат Жумабеков",
    updatedAt: "2026-06-25T10:00:00",
    factSource: "manual",
    history: [
      {
        id: "bl4-h1",
        dateTime: "2026-04-05T09:00:00",
        author: "Марат Жумабеков",
        field: "Статья",
        oldValue: "—",
        newValue: "Обучение сотрудников по кибербезопасности",
        comment: "Строка создана при формировании бюджета на II квартал.",
      },
      {
        id: "bl4-h2",
        dateTime: "2026-06-25T10:00:00",
        author: "Марат Жумабеков",
        field: "Плановое количество",
        oldValue: "25 чел.",
        newValue: "40 чел.",
        comment: "Расширена программа обучения на весь департамент.",
      },
    ],
  },
  {
    id: "bl5",
    year: 2026,
    quarter: 3,
    department: "payments",
    article: "Командировки на международные конференции",
    type: "opex",
    unit: "поездок",
    quantityPlan: 6,
    quantityFact: 9,
    amountPlan: 9_000_000,
    amountFact: 14_200_000,
    calculation: "9 поездок × 1 577 778 ₸ ≈ 14 200 000 ₸",
    justification:
      "Участие команды в международных конференциях по продуктам лояльности для изучения лучших практик.",
    relatedDepartments: ["fin"],
    productId: "remote_id",
    status: "clarification",
    risk: "high",
    author: "Алия Сериккызы",
    updatedAt: "2026-06-20T15:45:00",
    factSource: "manual",
    history: [
      {
        id: "bl5-h1",
        dateTime: "2026-04-18T09:00:00",
        author: "Алия Сериккызы",
        field: "Статья",
        oldValue: "—",
        newValue: "Командировки на международные конференции",
        comment: "Строка создана при формировании бюджета на III квартал.",
      },
      {
        id: "bl5-h2",
        dateTime: "2026-06-20T15:45:00",
        author: "Бюджетный комитет",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Требует уточнения",
        comment: "Запрошено обоснование превышения количества поездок сверх плана.",
      },
    ],
  },
  {
    id: "bl6",
    year: 2026,
    quarter: 1,
    department: "adm",
    article: "Услуги связи и интернет-провайдеров",
    type: "opex",
    unit: "мес.",
    quantityPlan: 3,
    quantityFact: 3,
    amountPlan: 8_100_000,
    amountFact: 7_950_000,
    calculation: "3 месяца × 2 650 000 ₸ ≈ 7 950 000 ₸",
    justification: "Оплата услуг связи, интернет-каналов и корпоративной телефонии за I квартал.",
    relatedDepartments: [],
    productId: "none",
    status: "approved",
    risk: "none",
    author: "Гульнара Бекова",
    updatedAt: "2026-02-05T12:00:00",
    factSource: "auto",
    history: [
      {
        id: "bl6-h1",
        dateTime: "2026-01-08T09:00:00",
        author: "Гульнара Бекова",
        field: "Статья",
        oldValue: "—",
        newValue: "Услуги связи и интернет-провайдеров",
        comment: "Строка создана при формировании бюджета на 2026 год.",
      },
      {
        id: "bl6-h2",
        dateTime: "2026-02-05T12:00:00",
        author: "Гульнара Бекова",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Согласовано",
        comment: "Контракт с провайдером продлён на прежних условиях.",
      },
    ],
  },
  {
    id: "bl7",
    year: 2026,
    quarter: 2,
    department: "opscontrol",
    article: "Аренда оборудования для контакт-центра",
    type: "opex",
    unit: "ед.",
    quantityPlan: 85,
    quantityFact: 85,
    amountPlan: 21_000_000,
    amountFact: 24_800_000,
    calculation: "85 рабочих мест × 291 765 ₸ ≈ 24 800 000 ₸",
    justification: "Аренда рабочих станций и гарнитур для операторов контакт-центра, включая сервисное обслуживание.",
    relatedDepartments: ["it"],
    productId: "smk_clearing",
    status: "approved",
    risk: "moderate",
    author: "Ержан Тулегенов",
    updatedAt: "2026-05-12T09:40:00",
    factSource: "auto",
    history: [
      {
        id: "bl7-h1",
        dateTime: "2026-04-02T09:00:00",
        author: "Ержан Тулегенов",
        field: "Статья",
        oldValue: "—",
        newValue: "Аренда оборудования для контакт-центра",
        comment: "Строка создана при формировании бюджета на II квартал.",
      },
      {
        id: "bl7-h2",
        dateTime: "2026-05-12T09:40:00",
        author: "Ержан Тулегенов",
        field: "Фактическая сумма",
        oldValue: "22 100 000 ₸",
        newValue: "24 800 000 ₸",
        comment: "Уточнена стоимость сервисного обслуживания у поставщика.",
      },
    ],
  },
  {
    id: "bl8",
    year: 2026,
    quarter: 3,
    department: "it",
    article: "Модернизация системы хранения данных",
    type: "capex",
    unit: "Тб",
    quantityPlan: 500,
    quantityFact: 80,
    amountPlan: 96_000_000,
    amountFact: 22_000_000,
    calculation: "Аванс поставщику за 80 Тб из 500 Тб ≈ 22 000 000 ₸",
    justification: "Расширение системы хранения данных под рост объёмов транзакций и резервного копирования.",
    relatedDepartments: ["sec", "opscontrol"],
    productId: "none",
    status: "review",
    risk: "none",
    author: "Ержан Тулегенов",
    updatedAt: "2026-06-08T14:10:00",
    factSource: "manual",
    history: [
      {
        id: "bl8-h1",
        dateTime: "2026-05-15T09:00:00",
        author: "Ержан Тулегенов",
        field: "Статья",
        oldValue: "—",
        newValue: "Модернизация системы хранения данных",
        comment: "Строка создана при формировании бюджета на III квартал.",
      },
      {
        id: "bl8-h2",
        dateTime: "2026-06-08T14:10:00",
        author: "Ержан Тулегенов",
        field: "Фактическая сумма",
        oldValue: "0 ₸",
        newValue: "22 000 000 ₸",
        comment: "Внесён авансовый платёж по договору поставки.",
      },
    ],
  },
  {
    id: "bl9",
    year: 2026,
    quarter: 2,
    department: "it",
    article: "Разработка платёжного шлюза SmartPay",
    type: "capex",
    unit: "чел.-мес.",
    quantityPlan: 48,
    quantityFact: 52,
    amountPlan: 62_000_000,
    amountFact: 67_500_000,
    calculation: "52 чел.-мес. × 1 298 077 ₸ ≈ 67 500 000 ₸",
    justification: "Разработка и вывод в продуктив платёжного шлюза SmartPay для интернет-эквайринга.",
    relatedDepartments: ["payments", "sec"],
    productId: "mspd",
    status: "approved",
    risk: "none",
    author: "Динара Ахметова",
    updatedAt: "2026-06-01T10:30:00",
    factSource: "auto",
    history: [
      {
        id: "bl9-h1",
        dateTime: "2026-04-10T09:00:00",
        author: "Динара Ахметова",
        field: "Статья",
        oldValue: "—",
        newValue: "Разработка платёжного шлюза SmartPay",
        comment: "Строка создана при формировании бюджета на II квартал.",
      },
      {
        id: "bl9-h2",
        dateTime: "2026-06-01T10:30:00",
        author: "Динара Ахметова",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Согласовано",
        comment: "Релиз согласован после успешного пилота.",
      },
    ],
  },
  {
    id: "bl10",
    year: 2026,
    quarter: 1,
    department: "payments",
    article: "Продвижение мобильного приложения SmartBank",
    type: "opex",
    unit: "кампания",
    quantityPlan: 4,
    quantityFact: 4,
    amountPlan: 28_000_000,
    amountFact: 26_300_000,
    calculation: "4 маркетинговые кампании ≈ 26 300 000 ₸",
    justification: "Продвижение мобильного приложения SmartBank в цифровых каналах для роста активной аудитории.",
    relatedDepartments: [],
    productId: "mobile_interbank",
    status: "approved",
    risk: "none",
    author: "Алия Сериккызы",
    updatedAt: "2026-03-28T11:00:00",
    factSource: "auto",
    history: [
      {
        id: "bl10-h1",
        dateTime: "2026-01-15T09:00:00",
        author: "Алия Сериккызы",
        field: "Статья",
        oldValue: "—",
        newValue: "Продвижение мобильного приложения SmartBank",
        comment: "Строка создана при формировании бюджета на 2026 год.",
      },
      {
        id: "bl10-h2",
        dateTime: "2026-03-28T11:00:00",
        author: "Алия Сериккызы",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Согласовано",
        comment: "Медиаплан утверждён маркетинговым комитетом.",
      },
    ],
  },
  {
    id: "bl11",
    year: 2026,
    quarter: 3,
    department: "sec",
    article: "Аудит информационной безопасности",
    type: "opex",
    unit: "аудит",
    quantityPlan: 2,
    quantityFact: 1,
    amountPlan: 14_000_000,
    amountFact: 7_200_000,
    calculation: "1 из 2 запланированных аудитов × 7 200 000 ₸",
    justification: "Внешний аудит соответствия требованиям регулятора и стандарту PCI DSS.",
    relatedDepartments: ["it"],
    productId: "none",
    status: "clarification",
    risk: "moderate",
    author: "Марат Жумабеков",
    updatedAt: "2026-06-18T09:50:00",
    factSource: "manual",
    history: [
      {
        id: "bl11-h1",
        dateTime: "2026-05-20T09:00:00",
        author: "Марат Жумабеков",
        field: "Статья",
        oldValue: "—",
        newValue: "Аудит информационной безопасности",
        comment: "Строка создана при формировании бюджета на III квартал.",
      },
      {
        id: "bl11-h2",
        dateTime: "2026-06-18T09:50:00",
        author: "Бюджетный комитет",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Требует уточнения",
        comment: "Нужно уточнить причину переноса второго аудита на 2027 год.",
      },
    ],
  },
  {
    id: "bl12",
    year: 2026,
    quarter: 1,
    department: "fin",
    article: "Консалтинговые услуги по МСФО",
    type: "opex",
    unit: "услуга",
    quantityPlan: 1,
    quantityFact: 1,
    amountPlan: 18_400_000,
    amountFact: 18_400_000,
    calculation: "1 договор консалтинга по переходу на МСФО 9 ≈ 18 400 000 ₸",
    justification: "Консультационные услуги по подготовке финансовой отчётности по стандартам МСФО.",
    relatedDepartments: [],
    productId: "none",
    status: "approved",
    risk: "none",
    author: "Асем Нурланова",
    updatedAt: "2026-01-25T10:00:00",
    factSource: "auto",
    history: [
      {
        id: "bl12-h1",
        dateTime: "2026-01-25T10:00:00",
        author: "Асем Нурланова",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Согласовано",
        comment: "Договор с консалтинговой компанией подписан.",
      },
    ],
  },
  {
    id: "bl13",
    year: 2026,
    quarter: 4,
    department: "adm",
    article: "Аренда офисных помещений",
    type: "opex",
    unit: "м²",
    quantityPlan: 1200,
    quantityFact: 0,
    amountPlan: 54_000_000,
    amountFact: 0,
    calculation: "1 200 м² × 45 000 ₸/год ≈ 54 000 000 ₸ (план на IV квартал)",
    justification: "Продление договора аренды дополнительных офисных площадей для растущих команд разработки.",
    relatedDepartments: ["it", "payments"],
    productId: "none",
    status: "draft",
    risk: "none",
    author: "Гульнара Бекова",
    updatedAt: "2026-06-22T13:15:00",
    factSource: "manual",
    history: [
      {
        id: "bl13-h1",
        dateTime: "2026-06-22T13:15:00",
        author: "Гульнара Бекова",
        field: "Статья",
        oldValue: "—",
        newValue: "Аренда офисных помещений",
        comment: "Строка создана для планирования бюджета IV квартала.",
      },
    ],
  },
  {
    id: "bl14",
    year: 2026,
    quarter: 2,
    department: "adm",
    article: "Закупка ноутбуков для новых сотрудников",
    type: "capex",
    unit: "шт.",
    quantityPlan: 60,
    quantityFact: 74,
    amountPlan: 30_000_000,
    amountFact: 37_500_000,
    calculation: "74 ноутбука × 506 757 ₸ ≈ 37 500 000 ₸",
    justification: "Закупка рабочей техники сверх плана в связи с ускоренным наймом в ИТ и продуктовые команды.",
    relatedDepartments: ["it", "payments"],
    productId: "none",
    status: "approved",
    risk: "high",
    author: "Гульнара Бекова",
    updatedAt: "2026-06-05T16:00:00",
    factSource: "auto",
    history: [
      {
        id: "bl14-h1",
        dateTime: "2026-04-08T09:00:00",
        author: "Гульнара Бекова",
        field: "Статья",
        oldValue: "—",
        newValue: "Закупка ноутбуков для новых сотрудников",
        comment: "Строка создана при формировании бюджета на II квартал.",
      },
      {
        id: "bl14-h2",
        dateTime: "2026-06-05T16:00:00",
        author: "Гульнара Бекова",
        field: "Фактическое количество",
        oldValue: "58 шт.",
        newValue: "74 шт.",
        comment: "Дополнительный найм превысил план по численности.",
      },
    ],
  },
  {
    id: "bl15",
    year: 2026,
    quarter: 4,
    department: "it",
    article: "Разработка системы быстрых платежей",
    type: "capex",
    unit: "чел.-мес.",
    quantityPlan: 30,
    quantityFact: 0,
    amountPlan: 45_000_000,
    amountFact: 0,
    calculation: "30 чел.-мес. × 1 500 000 ₸ ≈ 45 000 000 ₸ (план на IV квартал)",
    justification: "Разработка интеграции с системой быстрых платежей Национального банка.",
    relatedDepartments: ["payments", "sec"],
    productId: "smep",
    status: "review",
    risk: "none",
    author: "Динара Ахметова",
    updatedAt: "2026-06-20T09:00:00",
    factSource: "manual",
    history: [
      {
        id: "bl15-h1",
        dateTime: "2026-06-20T09:00:00",
        author: "Динара Ахметова",
        field: "Статья",
        oldValue: "—",
        newValue: "Разработка системы быстрых платежей",
        comment: "Строка создана для планирования бюджета IV квартала.",
      },
    ],
  },
  {
    id: "bl16",
    year: 2026,
    quarter: 1,
    department: "opscontrol",
    article: "Аутсорс поддержки контакт-центра",
    type: "opex",
    unit: "мес.",
    quantityPlan: 3,
    quantityFact: 3,
    amountPlan: 27_000_000,
    amountFact: 25_600_000,
    calculation: "3 месяца × 8 533 333 ₸ ≈ 25 600 000 ₸",
    justification: "Услуги аутсорсинговой компании по обработке обращений клиентов в пиковые часы.",
    relatedDepartments: ["payments"],
    productId: "smk_clearing",
    status: "approved",
    risk: "none",
    author: "Ержан Тулегенов",
    updatedAt: "2026-02-10T10:20:00",
    factSource: "auto",
    history: [
      {
        id: "bl16-h1",
        dateTime: "2026-02-10T10:20:00",
        author: "Ержан Тулегенов",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Согласовано",
        comment: "Контракт с аутсорсинговым партнёром продлён.",
      },
    ],
  },
  {
    id: "bl17",
    year: 2026,
    quarter: 3,
    department: "fin",
    article: "Юридическое сопровождение сделок",
    type: "opex",
    unit: "услуга",
    quantityPlan: 5,
    quantityFact: 2,
    amountPlan: 11_000_000,
    amountFact: 4_800_000,
    calculation: "2 из 5 запланированных сделок × 2 400 000 ₸",
    justification: "Юридическое сопровождение сделок по привлечению фондирования и партнёрских соглашений.",
    relatedDepartments: [],
    productId: "none",
    status: "draft",
    risk: "none",
    author: "Асем Нурланова",
    updatedAt: "2026-06-12T09:30:00",
    factSource: "manual",
    history: [
      {
        id: "bl17-h1",
        dateTime: "2026-06-12T09:30:00",
        author: "Асем Нурланова",
        field: "Статья",
        oldValue: "—",
        newValue: "Юридическое сопровождение сделок",
        comment: "Строка создана при формировании бюджета на III квартал.",
      },
    ],
  },
  {
    id: "bl18",
    year: 2026,
    quarter: 2,
    department: "it",
    article: "Тестирование нагрузки системы онлайн-кредитования",
    type: "opex",
    unit: "цикл",
    quantityPlan: 4,
    quantityFact: 5,
    amountPlan: 9_600_000,
    amountFact: 12_100_000,
    calculation: "5 циклов нагрузочного тестирования × 2 420 000 ₸ ≈ 12 100 000 ₸",
    justification: "Дополнительный цикл тестирования перед пиковым сезоном выдачи онлайн-займов.",
    relatedDepartments: ["payments"],
    productId: "fasti",
    status: "clarification",
    risk: "moderate",
    author: "Динара Ахметова",
    updatedAt: "2026-06-27T15:00:00",
    factSource: "manual",
    history: [
      {
        id: "bl18-h1",
        dateTime: "2026-04-14T09:00:00",
        author: "Динара Ахметова",
        field: "Статья",
        oldValue: "—",
        newValue: "Тестирование нагрузки системы онлайн-кредитования",
        comment: "Строка создана при формировании бюджета на II квартал.",
      },
      {
        id: "bl18-h2",
        dateTime: "2026-06-27T15:00:00",
        author: "Бюджетный комитет",
        field: "Статус",
        oldValue: "На согласовании",
        newValue: "Требует уточнения",
        comment: "Запрошено обоснование пятого дополнительного цикла тестирования.",
      },
    ],
  },
];

// ---- Доходы: строки по продуктам ----

const INCOME_FORECAST: Record<Year, number> = {
  2025: 8_100_000_000,
  2026: 9_050_000_000,
  2027: 10_000_000_000,
};

export function getIncomeForecast(year: Year, scope: "org" | DepartmentId): number {
  const scopeWeight = scope === "org" ? 1 : INCOME_DEPARTMENT_WEIGHT[scope];
  return Math.round(INCOME_FORECAST[year] * scopeWeight);
}

export const INCOME_PRODUCT_ROWS: IncomeProductRow[] = [
  {
    id: "ir1",
    year: 2026,
    quarter: 1,
    department: "payments",
    productId: "mobile_interbank",
    isActiveService: true,
    growthRate: 18,
    volumePlan: 2400,
    volumeFact: 2650,
    unit: "транзакции",
    incomePlan: 620_000_000,
    incomeFact: 690_000_000,
    tariff: "0,35% от суммы транзакции",
    calculation: "2 650 тыс. операций × средний чек × 0,35% ≈ 690 000 000 ₸",
    comment: "Рост за счёт кампании кэшбэка и увеличения активной аудитории приложения.",
    author: "Алия Сериккызы",
    updatedAt: "2026-04-05T11:00:00",
    factSource: "auto",
    history: [
      {
        id: "ir1-h1",
        dateTime: "2026-01-15T09:00:00",
        author: "Алия Сериккызы",
        field: "Плановый доход",
        oldValue: "580 000 000 ₸",
        newValue: "620 000 000 ₸",
        comment: "Скорректирован план с учётом роста активной базы за декабрь.",
      },
      {
        id: "ir1-h2",
        dateTime: "2026-04-05T11:00:00",
        author: "Алия Сериккызы",
        field: "Фактический доход",
        oldValue: "0 ₸",
        newValue: "690 000 000 ₸",
        comment: "Закрыт отчётный период за I квартал.",
      },
    ],
  },
  {
    id: "ir2",
    year: 2026,
    quarter: 2,
    department: "payments",
    productId: "mobile_interbank",
    isActiveService: true,
    growthRate: 15,
    volumePlan: 2600,
    volumeFact: 2500,
    unit: "транзакции",
    incomePlan: 660_000_000,
    incomeFact: 615_000_000,
    tariff: "0,35% от суммы транзакции",
    calculation: "2 500 тыс. операций × средний чек × 0,35% ≈ 615 000 000 ₸",
    comment: "Небольшое отставание от плана из-за сезонного снижения активности в мае.",
    author: "Алия Сериккызы",
    updatedAt: "2026-07-01T10:00:00",
    factSource: "auto",
    history: [
      {
        id: "ir2-h1",
        dateTime: "2026-04-10T09:00:00",
        author: "Алия Сериккызы",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "660 000 000 ₸",
        comment: "Строка создана при планировании II квартала.",
      },
      {
        id: "ir2-h2",
        dateTime: "2026-07-01T10:00:00",
        author: "Алия Сериккызы",
        field: "Фактический доход",
        oldValue: "0 ₸",
        newValue: "615 000 000 ₸",
        comment: "Закрыт отчётный период за II квартал.",
      },
    ],
  },
  {
    id: "ir3",
    year: 2026,
    quarter: 1,
    department: "payments",
    productId: "open_banking",
    isActiveService: true,
    growthRate: 9,
    volumePlan: 480,
    volumeFact: 505,
    unit: "запросы",
    incomePlan: 210_000_000,
    incomeFact: 224_000_000,
    tariff: "0,2% от суммы платежа, мин. 500 ₸",
    calculation: "505 тыс. платежей × средняя комиссия ≈ 224 000 000 ₸",
    comment: "Рост числа корпоративных клиентов после запуска зарплатных проектов.",
    author: "Асем Нурланова",
    updatedAt: "2026-04-08T09:30:00",
    factSource: "auto",
    history: [
      {
        id: "ir3-h1",
        dateTime: "2026-01-20T09:00:00",
        author: "Асем Нурланова",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "210 000 000 ₸",
        comment: "Строка создана при формировании бюджета на 2026 год.",
      },
      {
        id: "ir3-h2",
        dateTime: "2026-04-08T09:30:00",
        author: "Асем Нурланова",
        field: "Фактический доход",
        oldValue: "0 ₸",
        newValue: "224 000 000 ₸",
        comment: "Закрыт отчётный период за I квартал.",
      },
    ],
  },
  {
    id: "ir4",
    year: 2026,
    quarter: 2,
    department: "payments",
    productId: "open_banking",
    isActiveService: true,
    growthRate: 11,
    volumePlan: 520,
    volumeFact: 540,
    unit: "запросы",
    incomePlan: 225_000_000,
    incomeFact: 236_000_000,
    tariff: "0,2% от суммы платежа, мин. 500 ₸",
    calculation: "540 тыс. платежей × средняя комиссия ≈ 236 000 000 ₸",
    comment: "Стабильный рост клиентской базы малого и среднего бизнеса.",
    author: "Асем Нурланова",
    updatedAt: "2026-07-01T09:15:00",
    factSource: "manual",
    history: [
      {
        id: "ir4-h1",
        dateTime: "2026-04-12T09:00:00",
        author: "Асем Нурланова",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "225 000 000 ₸",
        comment: "Строка создана при планировании II квартала.",
      },
    ],
  },
  {
    id: "ir5",
    year: 2026,
    quarter: 1,
    department: "it",
    productId: "mspd",
    isActiveService: true,
    growthRate: 240,
    volumePlan: 90,
    volumeFact: 130,
    unit: "транзакции",
    incomePlan: 32_000_000,
    incomeFact: 48_000_000,
    tariff: "1,2% от суммы операции",
    calculation: "130 тыс. операций × средний чек × 1,2% ≈ 48 000 000 ₸",
    comment: "Быстрый рост нового продукта после подключения первых крупных мерчантов.",
    author: "Динара Ахметова",
    updatedAt: "2026-04-03T10:45:00",
    factSource: "auto",
    history: [
      {
        id: "ir5-h1",
        dateTime: "2026-01-05T09:00:00",
        author: "Динара Ахметова",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "32 000 000 ₸",
        comment: "Строка создана после запуска пилота SmartPay.",
      },
      {
        id: "ir5-h2",
        dateTime: "2026-04-03T10:45:00",
        author: "Динара Ахметова",
        field: "Фактический доход",
        oldValue: "0 ₸",
        newValue: "48 000 000 ₸",
        comment: "Подключены первые крупные торговые сети.",
      },
    ],
  },
  {
    id: "ir6",
    year: 2026,
    quarter: 2,
    department: "it",
    productId: "smep",
    isActiveService: false,
    growthRate: 320,
    volumePlan: 15,
    volumeFact: 6,
    unit: "транзакции",
    incomePlan: 4_000_000,
    incomeFact: 1_100_000,
    tariff: "0,1% от суммы перевода",
    calculation: "6 тыс. переводов × средняя сумма × 0,1% ≈ 1 100 000 ₸",
    comment: "Продукт находится в пилотной эксплуатации, полноценный запуск запланирован на III квартал.",
    author: "Динара Ахметова",
    updatedAt: "2026-07-01T08:30:00",
    factSource: "manual",
    history: [
      {
        id: "ir6-h1",
        dateTime: "2026-05-02T09:00:00",
        author: "Динара Ахметова",
        field: "Действующая услуга",
        oldValue: "—",
        newValue: "Нет (пилот)",
        comment: "Продукт запущен в режиме ограниченного пилота.",
      },
    ],
  },
  {
    id: "ir7",
    year: 2026,
    quarter: 1,
    department: "payments",
    productId: "remote_id",
    isActiveService: true,
    growthRate: 65,
    volumePlan: 320,
    volumeFact: 410,
    unit: "идентификации",
    incomePlan: 38_000_000,
    incomeFact: 49_500_000,
    tariff: "2,5% комиссия с транзакции партнёра",
    calculation: "410 тыс. транзакций участников × 2,5% ≈ 49 500 000 ₸",
    comment: "Высокий интерес клиентов к программе лояльности после ребрендинга.",
    author: "Алия Сериккызы",
    updatedAt: "2026-04-06T14:00:00",
    factSource: "manual",
    history: [
      {
        id: "ir7-h1",
        dateTime: "2026-01-18T09:00:00",
        author: "Алия Сериккызы",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "38 000 000 ₸",
        comment: "Строка создана при запуске обновлённой программы SmartBonus.",
      },
    ],
  },
  {
    id: "ir8",
    year: 2026,
    quarter: 2,
    department: "payments",
    productId: "remote_id",
    isActiveService: true,
    growthRate: 40,
    volumePlan: 380,
    volumeFact: 402,
    unit: "идентификации",
    incomePlan: 44_000_000,
    incomeFact: 46_800_000,
    tariff: "2,5% комиссия с транзакции партнёра",
    calculation: "402 тыс. транзакций участников × 2,5% ≈ 46 800 000 ₸",
    comment: "Рост числа партнёров программы продолжается умеренными темпами.",
    author: "Алия Сериккызы",
    updatedAt: "2026-07-01T09:00:00",
    factSource: "manual",
    history: [
      {
        id: "ir8-h1",
        dateTime: "2026-04-20T09:00:00",
        author: "Алия Сериккызы",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "44 000 000 ₸",
        comment: "Строка создана при планировании II квартала.",
      },
    ],
  },
  {
    id: "ir9",
    year: 2026,
    quarter: 1,
    department: "payments",
    productId: "fasti",
    isActiveService: true,
    growthRate: -6,
    volumePlan: 18_000,
    volumeFact: 16_200,
    unit: "операции",
    incomePlan: 310_000_000,
    incomeFact: 288_000_000,
    tariff: "18–24% годовых",
    calculation: "16 200 займов × средний доход на займ ≈ 288 000 000 ₸",
    comment: "Снижение объёма выдач связано с ужесточением скоринговой модели.",
    author: "Асем Нурланова",
    updatedAt: "2026-04-04T10:00:00",
    factSource: "manual",
    history: [
      {
        id: "ir9-h1",
        dateTime: "2026-02-01T09:00:00",
        author: "Асем Нурланова",
        field: "Коэффициент роста",
        oldValue: "+4%",
        newValue: "-6%",
        comment: "Скорректирован прогноз после ужесточения скоринга.",
      },
    ],
  },
  {
    id: "ir10",
    year: 2026,
    quarter: 2,
    department: "payments",
    productId: "fasti",
    isActiveService: true,
    growthRate: 4,
    volumePlan: 19_000,
    volumeFact: 19_800,
    unit: "операции",
    incomePlan: 320_000_000,
    incomeFact: 335_000_000,
    tariff: "18–24% годовых",
    calculation: "19 800 займов × средний доход на займ ≈ 335 000 000 ₸",
    comment: "Восстановление темпов выдачи после калибровки скоринговой модели.",
    author: "Асем Нурланова",
    updatedAt: "2026-07-01T09:20:00",
    factSource: "manual",
    history: [
      {
        id: "ir10-h1",
        dateTime: "2026-04-15T09:00:00",
        author: "Асем Нурланова",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "320 000 000 ₸",
        comment: "Строка создана при планировании II квартала.",
      },
    ],
  },
  {
    id: "ir11",
    year: 2026,
    quarter: 1,
    department: "payments",
    productId: "card_interbank",
    isActiveService: true,
    growthRate: 12,
    volumePlan: 1800,
    volumeFact: 1950,
    unit: "транзакции",
    incomePlan: 145_000_000,
    incomeFact: 158_000_000,
    tariff: "1,8% от оборота торговой точки",
    calculation: "1 950 млн ₸ оборота × 1,8% ≈ 158 000 000 ₸",
    comment: "Подключение новых торговых точек в сегменте e-commerce.",
    author: "Алия Сериккызы",
    updatedAt: "2026-04-07T11:30:00",
    factSource: "manual",
    history: [
      {
        id: "ir11-h1",
        dateTime: "2026-01-22T09:00:00",
        author: "Алия Сериккызы",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "145 000 000 ₸",
        comment: "Строка создана при формировании бюджета на 2026 год.",
      },
    ],
  },
  {
    id: "ir12",
    year: 2026,
    quarter: 1,
    department: "fin",
    productId: "digital_tenge",
    isActiveService: true,
    growthRate: 5,
    volumePlan: 42_000,
    volumeFact: 43_500,
    unit: "пользователи",
    incomePlan: 96_000_000,
    incomeFact: 101_000_000,
    tariff: "маржа 2,1% годовых",
    calculation: "43 500 млн ₸ привлечённых депозитов × маржа 2,1% ≈ 101 000 000 ₸",
    comment: "Приток вкладов на фоне повышения ставок по онлайн-депозитам.",
    author: "Асем Нурланова",
    updatedAt: "2026-04-09T09:00:00",
    factSource: "manual",
    history: [
      {
        id: "ir12-h1",
        dateTime: "2026-01-25T09:00:00",
        author: "Асем Нурланова",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "96 000 000 ₸",
        comment: "Строка создана при формировании бюджета на 2026 год.",
      },
    ],
  },
  {
    id: "ir13",
    year: 2026,
    quarter: 2,
    department: "fin",
    productId: "swift_bureau",
    isActiveService: true,
    growthRate: -8,
    volumePlan: 210_000,
    volumeFact: 189_000,
    unit: "сообщения",
    incomePlan: 58_000_000,
    incomeFact: 51_000_000,
    tariff: "спред 0,4–0,6%",
    calculation: "189 тыс. операций × средний спред ≈ 51 000 000 ₸",
    comment: "Снижение объёмов конверсионных операций на фоне валютной волатильности.",
    author: "Асем Нурланова",
    updatedAt: "2026-07-01T10:30:00",
    factSource: "manual",
    history: [
      {
        id: "ir13-h1",
        dateTime: "2026-04-11T09:00:00",
        author: "Асем Нурланова",
        field: "Плановый доход",
        oldValue: "—",
        newValue: "58 000 000 ₸",
        comment: "Строка создана при планировании II квартала.",
      },
    ],
  },
];

// ---- Согласование ----

export const REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "rv1",
    type: "expense",
    title: "Серверное оборудование для ЦОД",
    department: "opscontrol",
    quarter: 2,
    year: 2026,
    amount: 214_000_000,
    previousAmount: 180_000_000,
    submittedAt: "2026-06-20",
    author: "Ержан Тулегенов",
    status: "pending",
    calculation: "14 серверов × 15 285 714 ₸ ≈ 214 000 000 ₸",
    justification:
      "Дополнительная закупка серверов для расширения мощностей процессингового центра на фоне роста транзакционной нагрузки SmartPay.",
    productId: "none",
    comment: "Нагрузка выросла быстрее прогноза — нужно расширение до конца квартала.",
    routeStage: 1,
  },
  {
    id: "rv2",
    type: "expense",
    title: "Тестирование нагрузки системы онлайн-кредитования",
    department: "it",
    quarter: 2,
    year: 2026,
    amount: 12_100_000,
    previousAmount: 9_600_000,
    submittedAt: "2026-06-27",
    author: "Динара Ахметова",
    status: "pending",
    calculation: "5 циклов нагрузочного тестирования × 2 420 000 ₸ ≈ 12 100 000 ₸",
    justification: "Дополнительный цикл тестирования перед пиковым сезоном выдачи онлайн-займов.",
    productId: "fasti",
    comment: "Без пятого цикла есть риск сбоев в высокий сезон.",
    routeStage: 1,
  },
  {
    id: "rv3",
    type: "income",
    title: "Плановый доход: Система быстрых платежей",
    department: "it",
    quarter: 2,
    year: 2026,
    amount: 4_000_000,
    previousAmount: null,
    submittedAt: "2026-05-05",
    author: "Динара Ахметова",
    status: "pending",
    calculation: "15 тыс. переводов × средняя сумма × 0,1% ≈ 4 000 000 ₸",
    justification: "Первая версия плана дохода по пилоту системы быстрых платежей.",
    productId: "smep",
    comment: "План консервативный, пилот только запущен.",
    routeStage: 1,
  },
  {
    id: "rv4",
    type: "expense",
    title: "Обучение сотрудников по кибербезопасности",
    department: "sec",
    quarter: 2,
    year: 2026,
    amount: 12_000_000,
    previousAmount: 7_500_000,
    submittedAt: "2026-06-25",
    author: "Марат Жумабеков",
    status: "pending",
    calculation: "40 сотрудников × 300 000 ₸ = 12 000 000 ₸",
    justification: "Обучение специалистов по стандарту ISO 27001 и практикам реагирования на инциденты.",
    productId: "antifraud_center",
    comment: "Нужно успеть до планового аудита ИБ в июле.",
    routeStage: 1,
  },
  {
    id: "rv5",
    type: "income",
    title: "Плановый доход: SmartBonus, II квартал",
    department: "payments",
    quarter: 2,
    year: 2026,
    amount: 44_000_000,
    previousAmount: 38_000_000,
    submittedAt: "2026-06-15",
    author: "Алия Сериккызы",
    status: "approved",
    calculation: "402 тыс. транзакций участников × 2,5% ≈ 44 000 000 ₸",
    justification: "Рост числа партнёров программы лояльности после ребрендинга.",
    productId: "remote_id",
    comment: "Рост подтверждён фактическими данными за май.",
    routeStage: 3,
  },
  {
    id: "rv6",
    type: "expense",
    title: "Аренда офисных помещений",
    department: "adm",
    quarter: 4,
    year: 2026,
    amount: 54_000_000,
    previousAmount: 48_000_000,
    submittedAt: "2026-06-22",
    author: "Гульнара Бекова",
    status: "pending",
    calculation: "1 200 м² × 45 000 ₸/год ≈ 54 000 000 ₸",
    justification: "Продление договора аренды дополнительных офисных площадей для растущих команд разработки.",
    productId: "none",
    comment: "Ставка аренды выросла на 12% при продлении договора.",
    routeStage: 2,
  },
  {
    id: "rv7",
    type: "expense",
    title: "Аудит информационной безопасности",
    department: "sec",
    quarter: 3,
    year: 2026,
    amount: 14_000_000,
    previousAmount: 9_000_000,
    submittedAt: "2026-06-10",
    author: "Марат Жумабеков",
    status: "clarification",
    calculation: "2 аудита × 7 000 000 ₸ ≈ 14 000 000 ₸",
    justification: "Внешний аудит соответствия требованиям регулятора и стандарту PCI DSS.",
    productId: "none",
    comment: "Финансовое подразделение запросило детализацию по второму аудиту.",
    routeStage: 0,
  },
  {
    id: "rv8",
    type: "income",
    title: "Плановый доход: Валютно-обменные операции",
    department: "fin",
    quarter: 2,
    year: 2026,
    amount: 58_000_000,
    previousAmount: 63_000_000,
    submittedAt: "2026-06-18",
    author: "Асем Нурланова",
    status: "clarification",
    calculation: "189 тыс. операций × средний спред ≈ 58 000 000 ₸",
    justification: "Снижение плана дохода из-за валютной волатильности.",
    productId: "swift_bureau",
    comment: "Нужно уточнить методику расчёта среднего спреда.",
    routeStage: 0,
  },
  {
    id: "rv9",
    type: "expense",
    title: "Командировки на международные конференции",
    department: "payments",
    quarter: 3,
    year: 2026,
    amount: 14_200_000,
    previousAmount: 9_000_000,
    submittedAt: "2026-06-14",
    author: "Алия Сериккызы",
    status: "rejected",
    calculation: "9 поездок × 1 577 778 ₸ ≈ 14 200 000 ₸",
    justification: "Участие команды в международных конференциях по продуктам лояльности.",
    productId: "remote_id",
    comment: "Превышение лимита командировочных расходов без предварительного согласования.",
    routeStage: 1,
  },
  {
    id: "rv10",
    type: "expense",
    title: "Закупка ноутбуков для новых сотрудников",
    department: "adm",
    quarter: 2,
    year: 2026,
    amount: 37_500_000,
    previousAmount: 30_000_000,
    submittedAt: "2026-06-05",
    author: "Гульнара Бекова",
    status: "approved",
    calculation: "74 ноутбука × 506 757 ₸ ≈ 37 500 000 ₸",
    justification: "Закупка рабочей техники сверх плана в связи с ускоренным наймом.",
    productId: "none",
    comment: "Найм подтверждён HR-департаментом.",
    routeStage: 3,
  },
  {
    id: "rv11",
    type: "income",
    title: "Плановый доход: SmartBank, III квартал",
    department: "payments",
    quarter: 3,
    year: 2026,
    amount: 705_000_000,
    previousAmount: 660_000_000,
    submittedAt: "2026-06-29",
    author: "Алия Сериккызы",
    status: "pending",
    calculation: "2 720 тыс. операций × средний чек × 0,35% ≈ 705 000 000 ₸",
    justification: "Прогноз на III квартал с учётом сезонного роста транзакций.",
    productId: "mobile_interbank",
    comment: "Ожидаем рост активности в период отпусков.",
    routeStage: 2,
  },
  {
    id: "rv12",
    type: "expense",
    title: "Разработка системы быстрых платежей",
    department: "it",
    quarter: 4,
    year: 2026,
    amount: 45_000_000,
    previousAmount: null,
    submittedAt: "2026-06-21",
    author: "Динара Ахметова",
    status: "pending",
    calculation: "30 чел.-мес. × 1 500 000 ₸ ≈ 45 000 000 ₸",
    justification: "Разработка интеграции с системой быстрых платежей Национального банка.",
    productId: "smep",
    comment: "Первая версия сметы на IV квартал.",
    routeStage: 2,
  },
  {
    id: "rv13",
    type: "expense",
    title: "Юридическое сопровождение сделок",
    department: "fin",
    quarter: 3,
    year: 2026,
    amount: 11_000_000,
    previousAmount: 8_000_000,
    submittedAt: "2026-06-13",
    author: "Асем Нурланова",
    status: "pending",
    calculation: "5 сделок × 2 200 000 ₸ ≈ 11 000 000 ₸",
    justification: "Юридическое сопровождение сделок по привлечению фондирования.",
    productId: "none",
    comment: "Добавлена ещё одна сделка по партнёрскому соглашению.",
    routeStage: 1,
  },
  {
    id: "rv14",
    type: "income",
    title: "Плановый доход: Эквайринг для бизнеса, II квартал",
    department: "payments",
    quarter: 2,
    year: 2026,
    amount: 162_000_000,
    previousAmount: 145_000_000,
    submittedAt: "2026-06-24",
    author: "Алия Сериккызы",
    status: "approved",
    calculation: "2 100 млн ₸ оборота × 1,8% ≈ 162 000 000 ₸",
    justification: "Рост оборота торговых точек в сегменте e-commerce.",
    productId: "card_interbank",
    comment: "Подтверждено фактическими данными за май-июнь.",
    routeStage: 3,
  },
];

export const AVG_REVIEW_DAYS = 3.4;

// ---- Исполнение бюджета: состояния риска ----

export const BUDGET_STATE_META: Record<BudgetState, { label: string; tone: "normal" | "warning" | "critical" }> = {
  within: { label: "В пределах плана", tone: "normal" },
  overrun: { label: "Риск превышения", tone: "critical" },
  underuse: { label: "Риск неосвоения", tone: "warning" },
  near_limit: { label: "Лимит почти исчерпан", tone: "warning" },
};

export function classifyBudgetState(plan: number, fact: number, forecast: number): BudgetState {
  if (plan <= 0) return "within";
  const factRatio = fact / plan;
  const forecastRatio = forecast / plan;
  if (forecastRatio >= 1.12) return "overrun";
  if (factRatio >= 0.92 && forecastRatio <= 1.12) return "near_limit";
  if (factRatio <= 0.4) return "underuse";
  return "within";
}

function estimateLineForecast(line: BudgetLine): number {
  if (line.amountFact <= 0) return line.amountPlan;
  const ratio = line.amountPlan > 0 ? line.amountFact / line.amountPlan : 1;
  if (line.risk === "high") return Math.round(line.amountPlan * Math.max(ratio, 1.15));
  if (line.risk === "moderate") return Math.round(line.amountPlan * Math.max(ratio, 0.85));
  return Math.round(Math.max(line.amountFact, line.amountPlan * 0.98));
}

export function getProblemArticles(
  year: Year,
  scope: "org" | DepartmentId,
  mode: "expense" | "income"
): ProblemArticleRow[] {
  if (mode === "expense") {
    const rows = BUDGET_LINES.filter(
      (l) => l.year === year && (scope === "org" || l.department === scope)
    ).map((l) => {
      const forecast = estimateLineForecast(l);
      return {
        id: l.id,
        department: l.department,
        article: l.article,
        plan: l.amountPlan,
        fact: l.amountFact,
        forecast,
        executionPercent: l.amountPlan > 0 ? Math.round((l.amountFact / l.amountPlan) * 1000) / 10 : 0,
        state: classifyBudgetState(l.amountPlan, l.amountFact, forecast),
      };
    });
    return rows.filter((r) => r.state !== "within");
  }

  const rows = INCOME_PRODUCT_ROWS.filter(
    (r) => r.year === year && (scope === "org" || r.department === scope)
  ).map((r) => ({
    id: r.id,
    department: r.department,
    article: productName(r.productId),
    plan: r.incomePlan,
    fact: r.incomeFact,
    forecast: r.incomeFact,
    executionPercent: r.incomePlan > 0 ? Math.round((r.incomeFact / r.incomePlan) * 1000) / 10 : 0,
    state: classifyBudgetState(r.incomePlan, r.incomeFact, r.incomeFact),
  }));
  return rows.filter((r) => r.state !== "within");
}

function getDepartmentExpenseForecast(year: Year, deptId: DepartmentId): number {
  const series = getMonthlySeries(year, deptId);
  const yearTotals = sumRange(series, PERIODS[0].months);
  return year === 2027
    ? yearTotals.plan
    : yearTotals.fact + sumRange(series, [7, 8, 9, 10, 11, 12]).forecast;
}

export function getDepartmentIncomeBars(year: Year, period: PeriodId) {
  const periodDef = PERIODS.find((p) => p.id === period)!;
  const periodWeight = periodDef.months.reduce((sum, m) => sum + SEASONAL_WEIGHTS[m - 1], 0);
  return DEPARTMENTS.map((dept) => {
    const weight = INCOME_DEPARTMENT_WEIGHT[dept.id];
    const plan = Math.round(INCOME_PLAN[year] * periodWeight * weight);
    const fact = Math.round(YEAR_INCOME[year] * periodWeight * weight);
    return {
      department: dept.short,
      departmentId: dept.id,
      plan,
      fact,
      executionPercent: plan > 0 ? Math.round((fact / plan) * 1000) / 10 : 0,
    };
  });
}

export function getDepartmentBudgetStates(year: Year, period: PeriodId, mode: "expense" | "income") {
  if (mode === "expense") {
    return getDepartmentExecutionBars(year, period).map((b) => {
      const forecast = getDepartmentExpenseForecast(year, b.departmentId);
      return { ...b, forecast, state: classifyBudgetState(b.plan, b.fact, forecast) };
    });
  }
  return getDepartmentIncomeBars(year, period).map((b) => {
    const forecast = getIncomeForecast(year, b.departmentId);
    return { ...b, forecast, state: classifyBudgetState(b.plan, b.fact, forecast) };
  });
}

// ---- История изменений ----

export const BUDGET_VERSIONS: BudgetVersion[] = [
  {
    id: "v1",
    label: "V1 — Первоначальный план",
    date: "2026-01-10",
    expense: 12_200_000_000,
    income: 8_700_000_000,
    author: "Асем Нурланова",
    basis: "Сформирован на основе предварительных заявок подразделений на 2026 год.",
  },
  {
    id: "v2",
    label: "V2 — После согласования подразделений",
    date: "2026-02-20",
    expense: 12_950_000_000,
    income: 8_900_000_000,
    author: "Бюджетный комитет",
    basis: "Учтены заявки подразделений после первого круга согласования.",
  },
  {
    id: "v3",
    label: "V3 — Утверждённый бюджет",
    date: "2026-03-15",
    expense: 12_800_000_000,
    income: 9_200_000_000,
    author: "Адилбек Сагадиев",
    basis: "Бюджет утверждён советом директоров после пересмотра статей ИТ и эксплуатации.",
  },
  {
    id: "v4",
    label: "V4 — Актуальный прогноз",
    date: "2026-07-01",
    expense: 12_500_000_000,
    income: 9_050_000_000,
    author: "Финансовый департамент",
    basis: "Прогноз по итогам первого полугодия с учётом фактического исполнения бюджета.",
  },
];

export const ACTION_LOG: ActionLogEntry[] = [
  {
    id: "al1",
    dateTime: "2026-06-28T09:15:00",
    author: "Адилбек Сагадиев",
    department: "it",
    section: "Расходы",
    action: "Утверждение строки",
    object: "Продление лицензий Microsoft 365",
    comment: "Утверждена заявка на сумму 48,5 млн ₸.",
  },
  {
    id: "al2",
    dateTime: "2026-06-27T15:00:00",
    author: "Бюджетный комитет",
    department: "it",
    section: "Расходы",
    action: "Возврат на уточнение",
    object: "Тестирование нагрузки системы онлайн-кредитования",
    comment: "Запрошено обоснование пятого цикла тестирования.",
  },
  {
    id: "al3",
    dateTime: "2026-06-25T10:00:00",
    author: "Марат Жумабеков",
    department: "sec",
    section: "Расходы",
    action: "Создание строки",
    object: "Обучение сотрудников по кибербезопасности",
    comment: "Расширена программа обучения на весь департамент.",
  },
  {
    id: "al4",
    dateTime: "2026-06-22T13:15:00",
    author: "Гульнара Бекова",
    department: "adm",
    section: "Расходы",
    action: "Создание строки",
    object: "Аренда офисных помещений",
    comment: "Планирование бюджета IV квартала.",
  },
  {
    id: "al5",
    dateTime: "2026-06-20T15:45:00",
    author: "Бюджетный комитет",
    department: "payments",
    section: "Согласование",
    action: "Возврат на уточнение",
    object: "Командировки на международные конференции",
    comment: "Запрошено обоснование превышения количества поездок.",
  },
  {
    id: "al6",
    dateTime: "2026-06-18T09:50:00",
    author: "Бюджетный комитет",
    department: "sec",
    section: "Согласование",
    action: "Возврат на уточнение",
    object: "Аудит информационной безопасности",
    comment: "Требуется уточнить причину переноса второго аудита.",
  },
  {
    id: "al7",
    dateTime: "2026-06-15T14:32:00",
    author: "Айжан Нуртаева",
    department: "it",
    section: "Расходы",
    action: "Изменение суммы",
    object: "Лицензии корпоративного программного обеспечения",
    comment: "Увеличение количества лицензий.",
  },
  {
    id: "al8",
    dateTime: "2026-06-10T11:00:00",
    author: "Адилбек Сагадиев",
    department: "cards",
    section: "Согласование",
    action: "Утверждение",
    object: "Эквайринг для бизнеса — план дохода за II квартал",
    comment: "Подтверждено фактическими данными за май-июнь.",
  },
  {
    id: "al9",
    dateTime: "2026-06-05T16:00:00",
    author: "Гульнара Бекова",
    department: "adm",
    section: "Расходы",
    action: "Изменение количества",
    object: "Закупка ноутбуков для новых сотрудников",
    comment: "Найм превысил план по численности.",
  },
  {
    id: "al10",
    dateTime: "2026-05-15T09:00:00",
    author: "Адилбек Сагадиев",
    department: "fin",
    section: "Сценарии",
    action: "Утверждение сценария",
    object: "Базовый сценарий бюджета на III квартал",
    comment: "Согласован советом директоров.",
  },
  {
    id: "al11",
    dateTime: "2026-04-30T10:00:00",
    author: "Асем Нурланова",
    department: "fin",
    section: "Исполнение бюджета",
    action: "Закрытие периода",
    object: "Отчёт об исполнении за I квартал 2026",
    comment: "Сформирован сводный отчёт по исполнению.",
  },
  {
    id: "al12",
    dateTime: "2026-04-05T11:00:00",
    author: "Алия Сериккызы",
    department: "payments",
    section: "Доходы",
    action: "Изменение суммы",
    object: "Мобильное приложение SmartBank — факт за I квартал",
    comment: "Закрыт отчётный период за I квартал.",
  },
  {
    id: "al13",
    dateTime: "2026-03-15T10:00:00",
    author: "Адилбек Сагадиев",
    department: "fin",
    section: "Бюджет",
    action: "Утверждение версии",
    object: "V3 — Утверждённый бюджет",
    comment: "Бюджет утверждён советом директоров.",
  },
  {
    id: "al14",
    dateTime: "2026-02-20T09:00:00",
    author: "Бюджетный комитет",
    department: "fin",
    section: "Бюджет",
    action: "Обновление версии",
    object: "V2 — После согласования подразделений",
    comment: "Учтены заявки подразделений после первого круга согласования.",
  },
  {
    id: "al15",
    dateTime: "2026-01-25T10:00:00",
    author: "Асем Нурланова",
    department: "fin",
    section: "Расходы",
    action: "Утверждение строки",
    object: "Консалтинговые услуги по МСФО",
    comment: "Договор с консалтинговой компанией подписан.",
  },
  {
    id: "al16",
    dateTime: "2026-01-10T09:00:00",
    author: "Асем Нурланова",
    department: "fin",
    section: "Бюджет",
    action: "Создание версии",
    object: "V1 — Первоначальный план",
    comment: "Сформирован на основе предварительных заявок подразделений.",
  },
];

export const ACTION_LOG_SECTIONS = Array.from(new Set(ACTION_LOG.map((a) => a.section)));
export const ACTION_LOG_AUTHORS = Array.from(new Set(ACTION_LOG.map((a) => a.author)));
export const ACTION_LOG_ACTIONS = Array.from(new Set(ACTION_LOG.map((a) => a.action)));

// ---- Аналитика: продукты ----

export interface ProductFinancials {
  productId: string;
  name: string;
  income: number;
  expense: number;
  result: number;
  volumePlan: number;
  volumeFact: number;
  volumeUnit: string;
  volumeCompletionPercent: number;
}

export function getProductFinancials(year: Year, scope: "org" | DepartmentId): ProductFinancials[] {
  return PRODUCTS.filter((p) => p.id !== "none")
    .map((product) => {
      const incomeRows = INCOME_PRODUCT_ROWS.filter(
        (r) => r.productId === product.id && r.year === year && (scope === "org" || r.department === scope)
      );
      const expenseLines = BUDGET_LINES.filter(
        (l) => l.productId === product.id && l.year === year && (scope === "org" || l.department === scope)
      );
      const income = incomeRows.reduce((sum, r) => sum + r.incomeFact, 0);
      const expense = expenseLines.reduce((sum, l) => sum + l.amountFact, 0);
      const volumePlan = incomeRows.reduce((sum, r) => sum + r.volumePlan, 0);
      const volumeFact = incomeRows.reduce((sum, r) => sum + r.volumeFact, 0);
      return {
        productId: product.id,
        name: product.name,
        income,
        expense,
        result: income - expense,
        volumePlan,
        volumeFact,
        volumeUnit: incomeRows[0]?.unit ?? "",
        volumeCompletionPercent: volumePlan > 0 ? Math.round((volumeFact / volumePlan) * 1000) / 10 : 0,
      };
    })
    .filter((p) => p.income > 0 || p.expense > 0);
}
