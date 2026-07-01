import type { IncomeProductRow } from "@/lib/types";
import { PRODUCTS, PRODUCT_STAGE_LABEL, departmentName, productName } from "@/lib/mock-data";
import { formatFullTenge, formatSignedPercent } from "@/lib/format";
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

export function IncomeDetails({ row }: { row: IncomeProductRow }) {
  const stage = PRODUCTS.find((p) => p.id === row.productId)?.stage ?? "existing";

  return (
    <div className="flex flex-col">
      <Field label="Подразделение">{departmentName(row.department)}</Field>
      <Field label="Период">
        {QUARTER_LABEL[row.quarter]} {row.year}
      </Field>
      <Field label="Название продукта">{productName(row.productId)}</Field>
      <Field label="Тип продукта">
        <Badge tone={stage === "new" ? "info" : "neutral"}>{PRODUCT_STAGE_LABEL[stage]}</Badge>
      </Field>
      <Field label="Действующая услуга">
        <Badge tone={row.isActiveService ? "normal" : "neutral"}>
          {row.isActiveService ? "Да" : "Нет"}
        </Badge>
      </Field>
      <Field label="Рост или снижение">{formatSignedPercent(row.growthRate, 0)}</Field>
      <Field label="Объём операций: план / факт">
        {row.volumePlan.toLocaleString("ru-RU")} тыс. / {row.volumeFact.toLocaleString("ru-RU")} тыс.
      </Field>
      <Field label="Количество пользователей: план / факт">
        {row.usersPlan.toLocaleString("ru-RU")} / {row.usersFact.toLocaleString("ru-RU")}
      </Field>
      <Field label="Тариф">{row.tariff}</Field>
      <Field label="Плановый доход">{formatFullTenge(row.incomePlan)}</Field>
      <Field label="Фактический доход">{formatFullTenge(row.incomeFact)}</Field>
      <Field label="Формула расчёта">{row.calculation}</Field>
      <Field label="Комментарий">{row.comment}</Field>
    </div>
  );
}
