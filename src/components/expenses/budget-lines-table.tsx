"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { BudgetLine } from "@/lib/types";
import {
  BUDGET_LINE_STATUS_META,
  BUDGET_LINE_TYPE_LABEL,
  departmentShort,
  productName,
} from "@/lib/mock-data";
import { formatCompactTenge, formatSignedPercent } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export type SortKey = "amount" | "deviation" | null;
export type SortDir = "asc" | "desc";

const QUARTER_LABEL: Record<number, string> = { 1: "I кв.", 2: "II кв.", 3: "III кв.", 4: "IV кв." };

const TYPE_STYLE: Record<BudgetLine["type"], string> = {
  opex: "bg-canvas-4 text-primary-dark",
  capex: "bg-canvas-3 text-ink-soft",
};

const RISK_TEXT_CLASS: Record<BudgetLine["risk"], string> = {
  high: "text-risk",
  moderate: "text-warning",
  none: "text-ink-soft",
};

interface BudgetLinesTableProps {
  rows: BudgetLine[];
  onSelectRow: (row: BudgetLine) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: "amount" | "deviation") => void;
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

export function BudgetLinesTable({ rows, onSelectRow, sortKey, sortDir, onSort }: BudgetLinesTableProps) {
  return (
    <div className="max-h-[600px] overflow-auto rounded-lg border border-line-soft">
      <table className="w-full min-w-[980px] border-collapse text-sm">
        <thead>
          <tr className="sticky top-0 z-10 bg-canvas-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <th className="px-4 py-3">Статья</th>
            <th className="px-3 py-3">Тип</th>
            <th className="px-3 py-3">Продукт</th>
            <th className="px-3 py-3">Кв.</th>
            <th className="px-3 py-3 text-right">Кол-во план/факт</th>
            <th className="px-3 py-3 text-right">
              <SortHeader
                label="Сумма план/факт"
                active={sortKey === "amount"}
                dir={sortDir}
                onClick={() => onSort("amount")}
              />
            </th>
            <th className="px-3 py-3 text-right">
              <SortHeader
                label="Отклонение"
                active={sortKey === "deviation"}
                dir={sortDir}
                onClick={() => onSort("deviation")}
              />
            </th>
            <th className="px-4 py-3 text-right">Статус</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-sm text-ink-muted">
                Строк не найдено — измените фильтры или поисковый запрос.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const deviation = row.amountFact - row.amountPlan;
              const deviationPercent = row.amountPlan !== 0 ? (deviation / row.amountPlan) * 100 : 0;
              const statusMeta = BUDGET_LINE_STATUS_META[row.status];
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
                  <td className="max-w-[260px] px-4 py-3">
                    <p className="truncate font-medium text-ink" title={row.article}>
                      {row.article}
                    </p>
                    <p className="truncate text-xs text-ink-muted">{departmentShort(row.department)}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_STYLE[row.type]}`}
                    >
                      {BUDGET_LINE_TYPE_LABEL[row.type]}
                    </span>
                  </td>
                  <td className="max-w-[180px] px-3 py-3 text-ink-soft">
                    <span className="truncate block" title={productName(row.productId)}>
                      {productName(row.productId)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{QUARTER_LABEL[row.quarter]}</td>
                  <td className="px-3 py-3 text-right text-ink-soft tabular-nums">
                    {row.quantityPlan.toLocaleString("ru-RU")} / {row.quantityFact.toLocaleString("ru-RU")} {row.unit}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    <span className="block text-xs text-ink-muted">{formatCompactTenge(row.amountPlan)}</span>
                    <span className="block font-semibold text-ink">{formatCompactTenge(row.amountFact)}</span>
                  </td>
                  <td className={`px-3 py-3 text-right font-semibold tabular-nums ${RISK_TEXT_CLASS[row.risk]}`}>
                    {formatSignedPercent(deviationPercent)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
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
