"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatFullTenge } from "@/lib/format";

export interface CategorySlice {
  id: string;
  name: string;
  value: number;
  percent: number;
  color: string;
}

export function CategoryDonutChart({ data }: { data: CategorySlice[] }) {
  return (
    <div className="@container">
      <div className="flex min-w-0 flex-col items-center gap-4 @min-[420px]:flex-row @min-[420px]:gap-6">
        <div className="h-[220px] w-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={98}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((slice) => (
                  <Cell key={slice.id} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatFullTenge(Number(value ?? 0))}
                contentStyle={{ borderRadius: 12, border: "1px solid #D7DADD", fontSize: 13 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex w-full min-w-0 flex-col gap-3 @min-[420px]:w-auto @min-[420px]:flex-1">
          {data.map((slice) => (
            <li key={slice.id} className="flex items-start justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-start gap-2">
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-ink-soft">{slice.name}</span>
              </span>
              <span className="shrink-0 font-semibold text-ink">{slice.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
