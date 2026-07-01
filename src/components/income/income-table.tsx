"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { IncomeProductRow } from "@/lib/types";
import { PRODUCT_STAGE_LABEL, PRODUCTS, departmentShort, productName } from "@/lib/mock-data";
import { formatCompactTenge, formatPercent, formatSignedPercent } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export type IncomeSortKey = "income" | "completion" | null;
export type SortDir = "asc" | "desc";

const QUARTER_LABEL: Record<number, string> = { 1: "I кв.", 2: "II кв.", 3: "III кв.", 4: "IV кв." };

function completionTone(percent: number): string {
  if (percent >= 95) return "text-accent";
  if (percent >= 80) return "text-warning";
  return "text-risk";
}

function growthTone(growth: number): string {
  if (growth <= -15) return "text-risk";
  if (growth > 0) return "text-accent";
  return "text-ink-soft";
}

interface IncomeTableProps {
  rows: IncomeProductRow[];
  onSelectRow: (row: IncomeProductRow) => void;
  sortKey: IncomeSortKey;
  sortDir: SortDir;
  onSort: (key: "income" | "completion") => void;
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide ${
        active ? "text-primary-dark" : "text-ink-muted hover:text-primary-dark"
      }`}
    >
      {label}
      {active ? (
        dir === "asc" ? (
          <ArrowUp size={12} />
        ) : (
          <ArrowDown size={12} />
        )
      ) : (
        <ArrowUpDown size={12} className="opacity-50" />
      )}
    </button>
  );
}

export function IncomeTable({ rows, onSelectRow, sortKey, sortDir, onSort }: IncomeTableProps) {
  return (
    <div className="max-h-[600px] overflow-auto rounded-lg border border-line-soft">
      <table className="w-full min-w-[1040px] border-collapse text-sm">
        <thead>
          <tr className="sticky top-0 z-10 bg-canvas-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <th className="px-4 py-3">Продукт</th>
            <th className="px-3 py-3">Кв.</th>
            <th className="px-3 py-3">Услуга</th>
            <th className="px-3 py-3">Тип</th>
            <th className="px-3 py-3 text-right">Рост</th>
            <th className="px-3 py-3 text-right">Объём план/факт</th>
            <th className="px-3 py-3 text-right">Пользователи план/факт</th>
            <th className="px-3 py-3 text-right">
              <SortHeader
                label="Доход план/факт"
                active={sortKey === "income"}
                dir={sortDir}
                onClick={() => onSort("income")}
              />
            </th>
            <th className="px-4 py-3 text-right">
              <SortHeader
                label="Выполнение"
                active={sortKey === "completion"}
                dir={sortDir}
                onClick={() => onSort("completion")}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-10 text-center text-sm text-ink-muted">
                Строк не найдено — измените фильтры или поисковый запрос.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const completion = row.incomePlan !== 0 ? (row.incomeFact / row.incomePlan) * 100 : 0;
              const stage = PRODUCTS.find((p) => p.id === row.productId)?.stage ?? "existing";
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow(row)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSelectRow(row);
                  }}
                  className="cursor-pointer border-b border-line-soft last:border-0 hover:bg-canvas-3/60 focus:bg-canvas-3/60 focus:outline-none"
                >
                  <td className="max-w-[220px] px-4 py-3">
                    <p className="truncate font-medium text-ink" title={productName(row.productId)}>
                      {productName(row.productId)}
                    </p>
                    <p className="truncate text-xs text-ink-muted">{departmentShort(row.department)}</p>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{QUARTER_LABEL[row.quarter]}</td>
                  <td className="px-3 py-3">
                    <Badge tone={row.isActiveService ? "normal" : "neutral"}>
                      {row.isActiveService ? "Да" : "Нет"}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone={stage === "new" ? "info" : "neutral"}>{PRODUCT_STAGE_LABEL[stage]}</Badge>
                  </td>
                  <td className={`px-3 py-3 text-right font-semibold tabular-nums ${growthTone(row.growthRate)}`}>
                    {formatSignedPercent(row.growthRate, 0)}
                  </td>
                  <td className="px-3 py-3 text-right text-ink-soft tabular-nums">
                    {row.volumePlan.toLocaleString("ru-RU")} / {row.volumeFact.toLocaleString("ru-RU")}
                  </td>
                  <td className="px-3 py-3 text-right text-ink-soft tabular-nums">
                    {row.usersPlan.toLocaleString("ru-RU")} / {row.usersFact.toLocaleString("ru-RU")}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className="block text-xs text-ink-muted">{formatCompactTenge(row.incomePlan)}</span>
                    <span className="block font-semibold text-ink">{formatCompactTenge(row.incomeFact)}</span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold tabular-nums ${completionTone(completion)}`}>
                    {formatPercent(completion, 0)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
