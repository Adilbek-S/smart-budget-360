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
import type { DepartmentId, Year } from "@/lib/types";
import { getProductFinancials } from "@/lib/mock-data";
import { formatCompactTenge, formatFullTenge, formatPercent } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";

export function ProductsTab({ year, scope }: { year: Year; scope: "org" | DepartmentId }) {
  const products = getProductFinancials(year, scope);

  const chartData = products.map((p) => ({
    name: p.name.length > 18 ? `${p.name.slice(0, 18)}…` : p.name,
    fullName: p.name,
    Доходы: p.income,
    Расходы: p.expense,
  }));

  const byResult = [...products].sort((a, b) => b.result - a.result);
  const byVolume = [...products]
    .filter((p) => p.volumePlan > 0)
    .sort((a, b) => b.volumeCompletionPercent - a.volumeCompletionPercent);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Доходы и расходы по продуктам" subtitle="Фактические значения, ₸" />
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">Данные по продуктам недоступны.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#E3EEEB" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#686868", fontSize: 11 }}
                axisLine={{ stroke: "#D7DADD" }}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={(v) => formatCompactTenge(Number(v))}
                tick={{ fill: "#686868", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value, name) => [formatFullTenge(Number(value ?? 0)), String(name)]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                contentStyle={{ borderRadius: 12, border: "1px solid #D7DADD", fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
              <Bar dataKey="Доходы" fill="#659945" radius={[6, 6, 0, 0]} maxBarSize={26} />
              <Bar dataKey="Расходы" fill="#295A5B" radius={[6, 6, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Условный финансовый результат" subtitle="Доходы минус расходы по продукту" />
          <ul className="flex flex-col gap-2.5">
            {byResult.map((p) => (
              <li
                key={p.productId}
                className="flex items-center justify-between gap-3 rounded-lg border border-line-soft bg-canvas-3 p-3"
              >
                <span className="min-w-0 truncate text-sm font-medium text-ink">{p.name}</span>
                <span className={`shrink-0 text-sm font-bold ${p.result >= 0 ? "text-accent" : "text-risk"}`}>
                  {formatCompactTenge(p.result)}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Выполнение плана по объёму" subtitle="Факт к плану по продукту, ед. изм." />
          {byVolume.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">Нет данных по объёму операций.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {byVolume.map((p) => (
                <li key={p.productId}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate font-medium text-ink">{p.name}</span>
                    <span className="shrink-0 font-semibold text-ink-soft">
                      {formatPercent(p.volumeCompletionPercent, 0)}
                      <span className="ml-1 font-normal text-ink-muted">тыс. {p.volumeUnit}</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-canvas-3">
                    <div
                      className={`h-full rounded-full ${p.volumeCompletionPercent >= 100 ? "bg-accent" : "bg-primary"}`}
                      style={{ width: `${Math.min(100, p.volumeCompletionPercent)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
