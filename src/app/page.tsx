"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Gauge,
  Info,
  PiggyBank,
  Receipt,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useFilters } from "@/lib/filter-context";
import {
  DEPARTMENTS,
  MONTH_NAMES,
  PERIODS,
  departmentShort,
  getApprovalsForScope,
  getCategoryDistribution,
  getDepartmentExecutionBars,
  getDeviations,
  getKpi,
  getMonthlySeries,
  getRisksForScope,
} from "@/lib/mock-data";
import {
  formatCompactTenge,
  formatFullTenge,
  formatPercent,
  formatSignedPercent,
  formatSignedPoints,
} from "@/lib/format";
import { FilterBar } from "@/components/filters/filter-bar";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { ExpenseTrendChart } from "@/components/charts/expense-trend-chart";
import { DepartmentBarChart } from "@/components/charts/department-bar-chart";
import { CategoryDonutChart } from "@/components/charts/category-donut-chart";

const SEVERITY_ICON = {
  critical: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
};

const SEVERITY_TONE = {
  critical: "critical",
  warning: "warning",
  info: "info",
} as const;

const STATUS_LABEL = {
  critical: "Критично",
  warning: "Требует внимания",
  normal: "В норме",
} as const;

export default function DashboardPage() {
  const { year, period, scope } = useFilters();

  const kpi = useMemo(() => getKpi(year, period, scope), [year, period, scope]);

  const trendData = useMemo(() => {
    const series = getMonthlySeries(year, scope);
    const periodDef = PERIODS.find((p) => p.id === period)!;
    return series
      .filter((p) => periodDef.months.includes(p.month))
      .map((p) => ({
        label: MONTH_NAMES[p.month - 1],
        plan: p.plan,
        fact: p.fact,
        forecast: p.forecast,
      }));
  }, [year, period, scope]);

  const departmentBars = useMemo(
    () => getDepartmentExecutionBars(year, period),
    [year, period]
  );

  const categoryData = useMemo(
    () => getCategoryDistribution(scope, kpi.actualExpense || 1),
    [scope, kpi.actualExpense]
  );

  const risks = useMemo(() => getRisksForScope(scope, 4), [scope]);
  const approvals = useMemo(() => getApprovalsForScope(scope, "pending", 4), [scope]);

  const deviations = useMemo(() => {
    return [...getDeviations(year, scope)]
      .sort((a, b) => Math.abs(b.fact - b.plan) - Math.abs(a.fact - a.plan))
      .slice(0, 8);
  }, [year, scope]);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Бюджет организации</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Сводная информация о планировании и исполнении бюджета за {year} год
        </p>
      </div>

      <FilterBar />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={Wallet}
          label="Бюджет расходов"
          value={formatCompactTenge(kpi.budgetExpense)}
          deltaText={formatSignedPercent(kpi.deltas.budgetExpense)}
          deltaDirection={kpi.deltas.budgetExpense >= 0 ? "up" : "down"}
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={Receipt}
          label="Фактические расходы"
          value={formatCompactTenge(kpi.actualExpense)}
          deltaText={formatSignedPercent(kpi.deltas.actualExpense)}
          deltaDirection={kpi.deltas.actualExpense >= 0 ? "up" : "down"}
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={Gauge}
          label="Исполнение бюджета"
          value={formatPercent(kpi.executionPercent)}
          deltaText={formatSignedPoints(kpi.deltas.executionPercent)}
          deltaDirection={kpi.deltas.executionPercent >= 0 ? "up" : "down"}
          deltaSentiment={kpi.deltas.executionPercent >= 0 ? "positive" : "negative"}
          iconTone="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Доходы"
          value={formatCompactTenge(kpi.income)}
          deltaText={formatSignedPercent(kpi.deltas.income)}
          deltaDirection={kpi.deltas.income >= 0 ? "up" : "down"}
          deltaSentiment={kpi.deltas.income >= 0 ? "positive" : "negative"}
          iconTone="accent"
        />
        <StatCard
          icon={Target}
          label="Прогноз до конца года"
          value={formatCompactTenge(kpi.forecastExpense)}
          deltaText={formatSignedPercent(kpi.deltas.forecastExpense)}
          deltaDirection={kpi.deltas.forecastExpense >= 0 ? "up" : "down"}
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={PiggyBank}
          label="Ожидаемая экономия"
          value={formatCompactTenge(kpi.savings)}
          deltaText={
            kpi.deltas.savings === 0 ? "—" : formatSignedPercent(kpi.deltas.savings)
          }
          deltaDirection={kpi.deltas.savings >= 0 ? "up" : "down"}
          deltaSentiment={kpi.deltas.savings >= 0 ? "positive" : "negative"}
          iconTone="warning"
        />
      </div>

      <Card>
        <CardHeader
          title="План, факт и прогноз расходов"
          subtitle="Динамика по месяцам, ₸"
        />
        <ExpenseTrendChart data={trendData} />
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Исполнение по подразделениям" subtitle="План и факт, ₸" />
          <DepartmentBarChart data={departmentBars} />
        </Card>
        <Card>
          <CardHeader title="Структура расходов" subtitle="Доля по категориям" />
          <CategoryDonutChart data={categoryData} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Бюджетные риски" subtitle="Ключевые предупреждения" />
          <ul className="flex flex-col gap-3">
            {risks.map((risk) => {
              const Icon = SEVERITY_ICON[risk.severity];
              return (
                <li
                  key={risk.id}
                  className="flex gap-3 rounded-lg border border-line-soft bg-canvas-3 p-3"
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      risk.severity === "critical"
                        ? "bg-[#f6e0dd] text-risk"
                        : risk.severity === "warning"
                          ? "bg-[#f6ecd7] text-warning"
                          : "bg-canvas-4 text-teal"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{risk.title}</p>
                      <Badge tone={SEVERITY_TONE[risk.severity]}>
                        {risk.severity === "critical"
                          ? "Критично"
                          : risk.severity === "warning"
                            ? "Внимание"
                            : "Инфо"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">{risk.description}</p>
                    <p className="mt-1 text-xs font-medium text-ink-muted">
                      {DEPARTMENTS.find((d) => d.id === risk.department)?.name}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader title="На согласовании" subtitle="Бюджетные заявки, ожидающие решения" />
          <ul className="flex flex-col gap-3">
            {approvals.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-line-soft bg-canvas-3 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas-4 text-primary-dark">
                    <ClipboardList size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{req.title}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {departmentShort(req.department)} · {req.author}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-ink">{formatCompactTenge(req.amount)}</p>
                  <p className="text-xs text-ink-muted">На согласовании</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/approval"
            className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            Все заявки
            <ArrowRight size={15} />
          </Link>
        </Card>
      </div>

      <Card>
        <CardHeader title="Крупнейшие отклонения" subtitle="План и факт по статьям бюджета" />
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <th className="py-2.5 pr-4">Подразделение</th>
                <th className="py-2.5 pr-4">Статья</th>
                <th className="py-2.5 pr-4 text-right">План</th>
                <th className="py-2.5 pr-4 text-right">Факт</th>
                <th className="py-2.5 pr-4 text-right">Отклонение</th>
                <th className="py-2.5 pl-2 text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {deviations.map((row) => {
                const dev = row.fact - row.plan;
                const devPercent = row.plan !== 0 ? (dev / row.plan) * 100 : 0;
                return (
                  <tr key={row.id} className="border-b border-line-soft last:border-0 transition-colors hover:bg-canvas-3/60">
                    <td className="py-3 pr-4 font-medium text-ink">
                      {departmentShort(row.department)}
                    </td>
                    <td className="py-3 pr-4 text-ink-soft">{row.article}</td>
                    <td className="py-3 pr-4 text-right text-ink-soft">
                      {formatFullTenge(row.plan)}
                    </td>
                    <td className="py-3 pr-4 text-right font-medium text-ink">
                      {formatFullTenge(row.fact)}
                    </td>
                    <td
                      className={`py-3 pr-4 text-right font-semibold ${
                        dev > 0 ? "text-risk" : "text-accent"
                      }`}
                    >
                      {formatSignedPercent(devPercent)}
                    </td>
                    <td className="py-3 pl-2 text-right">
                      <Badge
                        tone={
                          row.status === "critical"
                            ? "critical"
                            : row.status === "warning"
                              ? "warning"
                              : "normal"
                        }
                      >
                        {STATUS_LABEL[row.status]}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
