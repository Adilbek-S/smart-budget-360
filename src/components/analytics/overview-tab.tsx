"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DepartmentId, PeriodId, Year } from "@/lib/types";
import {
  MONTH_NAMES,
  departmentShort,
  getDeviations,
  getIncomeMonthlySeries,
  getKpi,
  getMonthlySeries,
} from "@/lib/mock-data";
import { formatCompactTenge, formatFullTenge, formatPercent, formatSignedPercent } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_LABEL = { critical: "Критично", warning: "Внимание", normal: "В норме" } as const;

export function OverviewTab({
  year,
  period,
  scope,
}: {
  year: Year;
  period: PeriodId;
  scope: "org" | DepartmentId;
}) {
  const kpi = getKpi(year, period, scope);

  const comparisonData = getMonthlySeries(year, scope).map((e, i) => {
    const income = getIncomeMonthlySeries(year, scope)[i];
    return {
      label: MONTH_NAMES[e.month - 1],
      Расходы: e.fact ?? e.forecast ?? e.plan,
      Доходы: income.fact ?? income.plan,
    };
  });

  const deviations = [...getDeviations(year, scope)]
    .sort((a, b) => Math.abs(b.fact - b.plan) - Math.abs(a.fact - a.plan))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Динамика расходов и доходов" subtitle="По месяцам, ₸" />
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={comparisonData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ovIncomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#659945" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#659945" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="ovExpenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#295A5B" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#295A5B" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E3EEEB" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#686868", fontSize: 12 }} axisLine={{ stroke: "#D7DADD" }} tickLine={false} />
            <YAxis
              tickFormatter={(v) => formatCompactTenge(Number(v))}
              tick={{ fill: "#686868", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              formatter={(value, name) => [formatFullTenge(Number(value ?? 0)), String(name)]}
              contentStyle={{ borderRadius: 12, border: "1px solid #D7DADD", fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
            <Area type="monotone" dataKey="Доходы" stroke="#659945" strokeWidth={2} fill="url(#ovIncomeFill)" />
            <Area type="monotone" dataKey="Расходы" stroke="#295A5B" strokeWidth={2} fill="url(#ovExpenseFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Исполнение бюджета" subtitle="Доля освоенного плана" />
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            <p className="text-4xl font-bold text-primary-dark">{formatPercent(kpi.executionPercent)}</p>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-canvas-3">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, kpi.executionPercent)}%` }}
              />
            </div>
            <div className="mt-2 grid w-full grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-canvas-3 p-2.5 text-center">
                <p className="text-xs text-ink-muted">Бюджет</p>
                <p className="font-semibold text-ink">{formatCompactTenge(kpi.budgetExpense)}</p>
              </div>
              <div className="rounded-lg bg-canvas-3 p-2.5 text-center">
                <p className="text-xs text-ink-muted">Факт</p>
                <p className="font-semibold text-ink">{formatCompactTenge(kpi.actualExpense)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Крупнейшие отклонения" subtitle="План и факт по статьям бюджета" />
          {deviations.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">Год ещё не начался — данные недоступны.</p>
          ) : (
            <div className="-mx-5 overflow-x-auto px-5">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    <th className="py-2 pr-3">Подразделение</th>
                    <th className="py-2 pr-3">Статья</th>
                    <th className="py-2 pr-3 text-right">Отклонение</th>
                    <th className="py-2 pl-2 text-right">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {deviations.map((row) => {
                    const dev = row.fact - row.plan;
                    const devPercent = row.plan !== 0 ? (dev / row.plan) * 100 : 0;
                    return (
                      <tr key={row.id} className="border-b border-line-soft last:border-0 transition-colors hover:bg-canvas-3/60">
                        <td className="py-2.5 pr-3 font-medium text-ink">{departmentShort(row.department)}</td>
                        <td className="max-w-[220px] py-2.5 pr-3 text-ink-soft">
                          <span className="block truncate">{row.article}</span>
                        </td>
                        <td className={`py-2.5 pr-3 text-right font-semibold ${dev > 0 ? "text-risk" : "text-accent"}`}>
                          {formatSignedPercent(devPercent)}
                        </td>
                        <td className="py-2.5 pl-2 text-right">
                          <Badge
                            tone={row.status === "critical" ? "critical" : row.status === "warning" ? "warning" : "normal"}
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
          )}
        </Card>
      </div>
    </div>
  );
}
