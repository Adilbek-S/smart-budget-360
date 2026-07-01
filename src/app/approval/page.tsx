"use client";

import { useMemo, useState } from "react";
import { Check, Clock, FileEdit, ListChecks, Search, Undo2, X } from "lucide-react";
import {
  AVG_REVIEW_DAYS,
  DEPARTMENTS,
  REVIEW_ITEMS,
  departmentName,
  departmentShort,
  productName,
} from "@/lib/mock-data";
import { useReviewDecisions } from "@/lib/use-review-decisions";
import { formatDate, formatFullTenge, formatSignedPercent } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { RouteStepper } from "@/components/ui/route-stepper";
import { ToastStack, useToasts } from "@/components/ui/toast";
import type { DepartmentId, ReviewItemType, ReviewStatus } from "@/lib/types";

const TYPE_FILTER_OPTIONS: { id: "all" | ReviewItemType; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "expense", label: "Расходы" },
  { id: "income", label: "Доходы" },
];

const STATUS_FILTER_OPTIONS: { id: "all" | ReviewStatus; label: string }[] = [
  { id: "all", label: "Все статусы" },
  { id: "pending", label: "На рассмотрении" },
  { id: "approved", label: "Согласовано" },
  { id: "clarification", label: "На уточнении" },
  { id: "rejected", label: "Отклонено" },
];

const STATUS_META: Record<ReviewStatus, { label: string; tone: "warning" | "normal" | "info" | "critical" }> = {
  pending: { label: "На рассмотрении", tone: "warning" },
  approved: { label: "Согласовано", tone: "normal" },
  clarification: { label: "На уточнении", tone: "info" },
  rejected: { label: "Отклонено", tone: "critical" },
};

const TYPE_META: Record<ReviewItemType, { label: string; tone: "info" | "normal" }> = {
  expense: { label: "Расход", tone: "info" },
  income: { label: "Доход", tone: "normal" },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line-soft py-3 first:pt-0 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
      <div className="text-sm text-ink">{children}</div>
    </div>
  );
}

export default function ApprovalWorkspacePage() {
  const { decisions, setDecision } = useReviewDecisions();
  const { toasts, push, dismiss } = useToasts();

  const [department, setDepartment] = useState<"all" | DepartmentId>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ReviewItemType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ReviewStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(REVIEW_ITEMS[0]?.id ?? null);

  const items = useMemo(
    () =>
      REVIEW_ITEMS.map((item) => {
        const decision = decisions[item.id];
        return decision ? { ...item, status: decision.status, routeStage: decision.routeStage } : item;
      }),
    [decisions]
  );

  const counts = useMemo(
    () => ({
      pending: items.filter((i) => i.status === "pending").length,
      approved: items.filter((i) => i.status === "approved").length,
      clarification: items.filter((i) => i.status === "clarification").length,
    }),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      if (department !== "all" && item.department !== department) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (query) {
        const haystack = `${item.title} ${departmentName(item.department)} ${item.author}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [items, department, typeFilter, statusFilter, search]);

  const selectedItem = items.find((i) => i.id === selectedId) ?? null;

  function handleDecision(status: ReviewStatus) {
    if (!selectedItem) return;
    const nextStage = status === "approved" ? 3 : status === "clarification" ? 0 : selectedItem.routeStage;
    setDecision(selectedItem.id, status, nextStage);
    const messages: Record<ReviewStatus, string> = {
      approved: `Заявка «${selectedItem.title}» согласована`,
      clarification: `Заявка «${selectedItem.title}» возвращена на уточнение`,
      rejected: `Заявка «${selectedItem.title}» отклонена`,
      pending: `Заявка «${selectedItem.title}» возвращена в очередь`,
    };
    const tone = status === "approved" ? "success" : status === "rejected" ? "warning" : "info";
    push(messages[status], tone);
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Согласование</h2>
        <p className="mt-1 text-sm text-ink-muted">Рассмотрение бюджетных строк и корректировок</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Ожидают решения"
          value={String(counts.pending)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="warning"
        />
        <StatCard
          icon={ListChecks}
          label="Согласовано"
          value={String(counts.approved)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="accent"
        />
        <StatCard
          icon={FileEdit}
          label="Возвращено на уточнение"
          value={String(counts.clarification)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={Clock}
          label="Средний срок рассмотрения"
          value={`${AVG_REVIEW_DAYS.toLocaleString("ru-RU")} дня`}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="primary"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as "all" | DepartmentId)}
            className="max-w-[220px] truncate rounded-full border border-line-soft bg-white px-3.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-teal"
          >
            <option value="all">Все подразделения</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 rounded-full bg-canvas-3 p-1">
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTypeFilter(opt.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  typeFilter === opt.id ? "bg-primary text-white shadow-sm" : "text-ink-soft hover:text-primary-dark"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | ReviewStatus)}
            className="rounded-full border border-line-soft bg-white px-3.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-teal"
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию, подразделению, инициатору"
            className="w-full rounded-full border border-line-soft bg-white py-2 pl-9 pr-3.5 text-sm text-ink outline-none focus:border-teal"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <Card className="lg:sticky lg:top-6">
          <CardHeader title="Список заявок" subtitle={`Показано: ${filteredItems.length}`} />
          <div className="max-h-[640px] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">
                Заявок не найдено — измените фильтры или поиск.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {filteredItems.map((item) => {
                  const meta = STATUS_META[item.status];
                  const active = item.id === selectedId;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setSelectedId(item.id)}
                        className={`flex w-full flex-col gap-2 rounded-lg border p-3.5 text-left transition-colors ${
                          active ? "border-primary bg-canvas-4" : "border-line-soft bg-canvas-3 hover:border-teal"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-ink">{item.title}</p>
                          <Badge tone={meta.tone}>{meta.label}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                          <span>{departmentShort(item.department)}</span>
                          <span>{item.author}</span>
                          <span>подано {formatDate(item.submittedAt)}</span>
                        </div>
                        <p className="text-sm font-bold text-ink">{formatFullTenge(item.amount)}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        <Card className="lg:sticky lg:top-6">
          {!selectedItem ? (
            <p className="py-10 text-center text-sm text-ink-muted">Выберите заявку слева.</p>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{selectedItem.title}</h3>
                  <Badge tone={TYPE_META[selectedItem.type].tone}>{TYPE_META[selectedItem.type].label}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {departmentName(selectedItem.department)} · {selectedItem.author}
                </p>
              </div>

              <div>
                <Field label="Основные параметры">
                  Q{selectedItem.quarter} {selectedItem.year} · {formatFullTenge(selectedItem.amount)} · подано{" "}
                  {formatDate(selectedItem.submittedAt)}
                </Field>
                <Field label="Расчёт">{selectedItem.calculation}</Field>
                <Field label="Обоснование">{selectedItem.justification}</Field>
                <Field label="Связанный продукт">{productName(selectedItem.productId)}</Field>
                <Field label="Отклонение от предыдущей версии">
                  {selectedItem.previousAmount === null ? (
                    <span className="text-ink-muted">Первая версия строки</span>
                  ) : (
                    (() => {
                      const delta = selectedItem.amount - selectedItem.previousAmount;
                      const deltaPercent = (delta / selectedItem.previousAmount) * 100;
                      return (
                        <span>
                          {formatFullTenge(selectedItem.previousAmount)} →{" "}
                          <span className="font-semibold">{formatFullTenge(selectedItem.amount)}</span>{" "}
                          <span className={delta >= 0 ? "text-risk" : "text-accent"}>
                            ({formatSignedPercent(deltaPercent)})
                          </span>
                        </span>
                      );
                    })()
                  )}
                </Field>
                <Field label="Комментарий инициатора">{selectedItem.comment}</Field>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Маршрут согласования
                </p>
                <RouteStepper stage={selectedItem.routeStage} rejected={selectedItem.status === "rejected"} />
              </div>

              {selectedItem.status === "pending" && (
                <div className="flex flex-wrap items-center gap-2 border-t border-line-soft pt-4">
                  <button
                    onClick={() => handleDecision("approved")}
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    <Check size={15} />
                    Согласовать
                  </button>
                  <button
                    onClick={() => handleDecision("clarification")}
                    className="flex items-center gap-1.5 rounded-full border border-line-soft bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-teal"
                  >
                    <Undo2 size={15} />
                    Вернуть на уточнение
                  </button>
                  <button
                    onClick={() => handleDecision("rejected")}
                    className="flex items-center gap-1.5 rounded-full border border-line-soft bg-white px-4 py-2 text-sm font-semibold text-risk transition-colors hover:border-risk"
                  >
                    <X size={15} />
                    Отклонить
                  </button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
