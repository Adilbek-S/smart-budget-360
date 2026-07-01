"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DepartmentId, PeriodId, Year } from "@/lib/types";
import { departmentShort, getCategoryDistribution, getDeviations, getKpi } from "@/lib/mock-data";
import { formatCompactTenge, formatFullTenge, formatSignedPercent } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { CategoryDonutChart } from "@/components/charts/category-donut-chart";

export function CategoriesTab({
  year,
  period,
  scope,
}: {
  year: Year;
  period: PeriodId;
  scope: "org" | DepartmentId;
}) {
  const kpi = getKpi(year, period, scope);
  const factByCategory = getCategoryDistribution(scope, kpi.actualExpense || 1);
  const planByCategory = getCategoryDistribution(scope, kpi.budgetExpense || 1);

  const chartData = factByCategory.map((c, i) => ({
    name: c.name,
    План: planByCategory[i].value,
    Факт: c.value,
  }));

  const topDeviations = [...getDeviations(year, scope)]
    .sort((a, b) => Math.abs(b.fact - b.plan) - Math.abs(a.fact - a.plan))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Структура расходов" subtitle="Доля по категориям" />
          <CategoryDonutChart data={factByCategory} />
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="План и факт по статьям" subtitle="По основным категориям, ₸" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#E3EEEB" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#686868", fontSize: 11 }} axisLine={{ stroke: "#D7DADD" }} tickLine={false} interval={0} />
              <YAxis
                tickFormatter={(v) => formatCompactTenge(Number(v))}
                tick={{ fill: "#686868", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value, name) => [formatFullTenge(Number(value ?? 0)), String(name)]}
                contentStyle={{ borderRadius: 12, border: "1px solid #D7DADD", fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
              <Bar dataKey="План" fill="#CFDFD9" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Факт" fill="#295A5B" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardHeader title="Топ-5 статей по отклонению" subtitle="Наибольшее расхождение план/факт" />
        {topDeviations.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">Год ещё не начался — данные недоступны.</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {topDeviations.map((row) => {
              const dev = row.fact - row.plan;
              const devPercent = row.plan !== 0 ? (dev / row.plan) * 100 : 0;
              return (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line-soft bg-canvas-3 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{row.article}</p>
                    <p className="text-xs text-ink-muted">{departmentShort(row.department)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-ink">{formatFullTenge(row.fact)}</p>
                    <p className={`text-xs font-semibold ${dev > 0 ? "text-risk" : "text-accent"}`}>
                      {formatSignedPercent(devPercent)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
