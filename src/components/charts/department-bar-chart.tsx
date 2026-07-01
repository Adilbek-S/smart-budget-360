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
import { formatCompactTenge, formatFullTenge } from "@/lib/format";

export interface DepartmentBarPoint {
  department: string;
  plan: number;
  fact: number;
}

export function DepartmentBarChart({ data }: { data: DepartmentBarPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#E3EEEB" vertical={false} />
        <XAxis
          dataKey="department"
          tick={{ fill: "#686868", fontSize: 12 }}
          axisLine={{ stroke: "#D7DADD" }}
          tickLine={false}
          interval={0}
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
          contentStyle={{ borderRadius: 12, border: "1px solid #D7DADD", fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
        <Bar dataKey="plan" name="План" fill="#CFDFD9" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="fact" name="Факт" fill="#295A5B" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
