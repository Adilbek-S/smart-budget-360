"use client";

import { useMemo, useState } from "react";
import { PiggyBank, Receipt, Target, Wallet } from "lucide-react";
import { useFilters } from "@/lib/filter-context";
import {
  BUDGET_STATE_META,
  MONTH_NAMES,
  PERIODS,
  departmentShort,
  getDepartmentBudgetStates,
  getIncomeForecast,
  getIncomeMonthlySeriesWithForecast,
  getKpi,
  getMonthlySeries,
  getProblemArticles,
} from "@/lib/mock-data";
import { formatCompactTenge, formatFullTenge, formatPercent, formatSignedPercent } from "@/lib/format";
import { FilterBar } from "@/components/filters/filter-bar";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { ExpenseTrendChart } from "@/components/charts/expense-trend-chart";

type Mode = "expense" | "income";

const BAR_TONE: Record<string, string> = {
  within: "bg-accent",
  overrun: "bg-risk",
  underuse: "bg-warning",
  near_limit: "bg-warning",
};

export default function ExecutionPage() {
  const { year, period, scope } = useFilters();
  const [mode, setMode] = useState<Mode>("expense");
  const kpi = useMemo(() => getKpi(year, period, scope), [year, period, scope]);

  const periodDef = PERIODS.find((p) => p.id === period)!;

  const incomeSeriesFull = useMemo(
    () => getIncomeMonthlySeriesWithForecast(year, scope),
    [year, scope]
  );
  const incomePlanTotal = useMemo(
    () => incomeSeriesFull.reduce((sum, p) => sum + p.plan, 0),
    [incomeSeriesFull]
  );

  const trendData = useMemo(() => {
    const series = mode === "expense" ? getMonthlySeries(year, scope) : incomeSeriesFull;
    return series
      .filter((p) => periodDef.months.includes(p.month))
      .map((p) => ({
        label: MONTH_NAMES[p.month - 1],
        plan: p.plan,
        fact: p.fact,
        forecast: p.forecast,
      }));
  }, [year, scope, mode, incomeSeriesFull, periodDef]);

  const departmentStates = useMemo(
    () => getDepartmentBudgetStates(year, period, mode),
    [year, period, mode]
  );

  const problemArticles = useMemo(
    () => getProblemArticles(year, scope, mode),
    [year, scope, mode]
  );

  const incomeForecast = useMemo(() => getIncomeForecast(year, scope), [year, scope]);

  const planLabel = mode === "expense" ? "План" : "Плановый доход";
  const factLabel = mode === "expense" ? "Факт" : "Фактический доход";
  const forecastLabel = mode === "expense" ? "Прогноз" : "Прогноз дохода";
  const remainderLabel = mode === "expense" ? "Остаток" : "Отставание от плана";
  const planValue = mode === "expense" ? kpi.budgetExpense : incomePlanTotal;
  const factValue = mode === "expense" ? kpi.actualExpense : kpi.income;
  const forecastValue = mode === "expense" ? kpi.forecastExpense : incomeForecast;
  const remainderValue = mode === "expense" ? kpi.budgetExpense - kpi.actualExpense : incomePlanTotal - kpi.income;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Исполнение бюджета</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Ход исполнения бюджета по подразделениям за {year} год
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={Wallet}
          label={planLabel}
          value={formatCompactTenge(planValue)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={Receipt}
          label={factLabel}
          value={formatCompactTenge(factValue)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={Target}
          label={forecastLabel}
          value={formatCompactTenge(forecastValue)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="accent"
        />
        <StatCard
          icon={PiggyBank}
          label={remainderLabel}
          value={formatCompactTenge(remainderValue)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="warning"
        />
      </div>

      <FilterBar />

      <div className="flex items-center gap-1 rounded-full bg-canvas-3 p-1 sm:w-fit">
        <button
          onClick={() => setMode("expense")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            mode === "expense" ? "bg-primary text-white shadow-sm" : "text-ink-soft hover:text-primary-dark"
          }`}
        >
          Расходы
        </button>
        <button
          onClick={() => setMode("income")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            mode === "income" ? "bg-primary text-white shadow-sm" : "text-ink-soft hover:text-primary-dark"
          }`}
        >
          Доходы
        </button>
      </div>

      <Card>
        <CardHeader
          title={mode === "expense" ? "План, факт и прогноз расходов" : "План, факт и прогноз доходов"}
          subtitle="Динамика по месяцам, ₸"
        />
        <ExpenseTrendChart data={trendData} />
      </Card>

      <Card>
        <CardHeader title="Исполнение по подразделениям" subtitle="Доля освоенного бюджета" />
        <ul className="flex flex-col gap-4">
          {departmentStates.map((d) => {
            const meta = BUDGET_STATE_META[d.state];
            return (
              <li key={d.departmentId}>
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-ink">{d.department}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink-soft">{formatPercent(d.executionPercent)}</span>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-canvas-3">
                  <div
                    className={`h-full rounded-full ${BAR_TONE[d.state]}`}
                    style={{ width: `${Math.min(100, d.executionPercent)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <CardHeader
          title="Проблемные статьи"
          subtitle={mode === "expense" ? "Статьи расходов с отклонением от плана" : "Продукты с отклонением дохода от плана"}
        />
        {problemArticles.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-muted">
            Проблемных статей не найдено — всё в пределах плана.
          </p>
        ) : (
          <div className="max-h-[520px] overflow-auto rounded-lg border border-line-soft">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="sticky top-0 z-10 bg-canvas-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3">Подразделение</th>
                  <th className="px-3 py-3">Статья</th>
                  <th className="px-3 py-3 text-right">План</th>
                  <th className="px-3 py-3 text-right">Факт</th>
                  <th className="px-3 py-3 text-right">Прогноз</th>
                  <th className="px-3 py-3 text-right">Исполнение</th>
                  <th className="px-4 py-3 text-right">Риск</th>
                </tr>
              </thead>
              <tbody>
                {problemArticles.map((row) => {
                  const meta = BUDGET_STATE_META[row.state];
                  return (
                    <tr key={row.id} className="border-b border-line-soft last:border-0 transition-colors hover:bg-canvas-3/60">
                      <td className="px-4 py-3 font-medium text-ink">{departmentShort(row.department)}</td>
                      <td className="max-w-[240px] px-3 py-3 text-ink-soft">
                        <span className="block truncate" title={row.article}>
                          {row.article}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right text-ink-soft">{formatFullTenge(row.plan)}</td>
                      <td className="px-3 py-3 text-right font-medium text-ink">{formatFullTenge(row.fact)}</td>
                      <td className="px-3 py-3 text-right text-ink-soft">{formatFullTenge(row.forecast)}</td>
                      <td className="px-3 py-3 text-right font-semibold text-ink">
                        {formatSignedPercent(row.executionPercent, 0)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
