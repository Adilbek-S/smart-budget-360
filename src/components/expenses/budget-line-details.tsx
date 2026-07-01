import type { BudgetLine } from "@/lib/types";
import {
  BUDGET_LINE_STATUS_META,
  BUDGET_LINE_TYPE_LABEL,
  departmentName,
  productName,
} from "@/lib/mock-data";
import { formatDate, formatFullTenge } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const QUARTER_LABEL: Record<number, string> = {
  1: "I квартал",
  2: "II квартал",
  3: "III квартал",
  4: "IV квартал",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line-soft py-3 first:pt-0 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
      <div className="text-sm text-ink">{children}</div>
    </div>
  );
}

export function BudgetLineDetails({ line }: { line: BudgetLine }) {
  const statusMeta = BUDGET_LINE_STATUS_META[line.status];

  return (
    <div className="flex flex-col">
      <Field label="Статья расхода">{line.article}</Field>
      <Field label="Подразделение">{departmentName(line.department)}</Field>
      <Field label="Квартал">
        {QUARTER_LABEL[line.quarter]} {line.year}
      </Field>
      <Field label="Тип">{BUDGET_LINE_TYPE_LABEL[line.type]}</Field>
      <Field label="Количество: план / факт">
        {line.quantityPlan.toLocaleString("ru-RU")} {line.unit} / {line.quantityFact.toLocaleString("ru-RU")}{" "}
        {line.unit}
      </Field>
      <Field label="Сумма: план / факт">
        {formatFullTenge(line.amountPlan)} / <span className="font-semibold">{formatFullTenge(line.amountFact)}</span>
      </Field>
      <Field label="Расчёт">{line.calculation}</Field>
      <Field label="Обоснование">{line.justification}</Field>
      <Field label="Смежные подразделения">
        {line.relatedDepartments.length === 0 ? (
          <span className="text-ink-muted">Не указаны</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {line.relatedDepartments.map((d) => (
              <Badge key={d} tone="neutral">
                {departmentName(d)}
              </Badge>
            ))}
          </div>
        )}
      </Field>
      <Field label="Продукт">{productName(line.productId)}</Field>
      <Field label="Статус">
        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
      </Field>
      <Field label="Автор">{line.author}</Field>
      <Field label="Дата последнего изменения">{formatDate(line.updatedAt.slice(0, 10))}</Field>
    </div>
  );
}
