"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactTenge, formatFullTenge } from "@/lib/format";

export interface TrendPoint {
  label: string;
  plan: number;
  fact: number | null;
  forecast: number | null;
}

export function ExpenseTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#E3EEEB" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#686868", fontSize: 12 }}
          axisLine={{ stroke: "#D7DADD" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatCompactTenge(Number(v))}
          tick={{ fill: "#686868", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip
          formatter={(value, name) => [formatFullTenge(Number(value ?? 0)), String(name)]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #D7DADD",
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
        <Line
          type="monotone"
          dataKey="plan"
          name="План"
          stroke="#295A5B"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="fact"
          name="Факт"
          stroke="#005A4B"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Прогноз"
          stroke="#659945"
          strokeWidth={2}
          strokeDasharray="3 3"
          dot={{ r: 3 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
