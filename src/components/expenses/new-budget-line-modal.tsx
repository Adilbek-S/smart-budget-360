"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DEPARTMENTS, PRODUCTS } from "@/lib/mock-data";
import { useBudgetLines } from "@/lib/use-budget-lines";
import type { BudgetLineType, DepartmentId, Year } from "@/lib/types";

const QUARTERS: { id: 1 | 2 | 3 | 4; label: string }[] = [
  { id: 1, label: "I квартал" },
  { id: 2, label: "II квартал" },
  { id: 3, label: "III квартал" },
  { id: 4, label: "IV квартал" },
];

const FIELD_CLASS =
  "w-full rounded-lg border border-line-soft bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal";
const LABEL_CLASS = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted";

interface NewBudgetLineModalProps {
  open: boolean;
  onClose: () => void;
  year: Year;
}

export function NewBudgetLineModal({ open, onClose, year }: NewBudgetLineModalProps) {
  const { addLine } = useBudgetLines();

  const [department, setDepartment] = useState<DepartmentId>(DEPARTMENTS[0].id);
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [article, setArticle] = useState("");
  const [type, setType] = useState<BudgetLineType>("opex");
  const [quantityPlan, setQuantityPlan] = useState("");
  const [amountPlan, setAmountPlan] = useState("");
  const [productId, setProductId] = useState<string>("none");
  const [justification, setJustification] = useState("");

  const isValid = article.trim().length > 0 && Number(quantityPlan) > 0 && Number(amountPlan) > 0;

  function reset() {
    setDepartment(DEPARTMENTS[0].id);
    setQuarter(1);
    setArticle("");
    setType("opex");
    setQuantityPlan("");
    setAmountPlan("");
    setProductId("none");
    setJustification("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit() {
    if (!isValid) return;
    addLine({
      year,
      quarter,
      department,
      article: article.trim(),
      type,
      unit: "шт.",
      quantityPlan: Number(quantityPlan),
      amountPlan: Number(amountPlan),
      productId: productId === "none" ? "none" : productId,
      justification: justification.trim() || "Обоснование не указано.",
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Новая строка"
      subtitle="Бюджетная строка будет добавлена в статусе «Черновик»"
      footer={
        <>
          <button
            onClick={handleClose}
            className="rounded-full border border-line-soft px-4 py-2 text-sm font-semibold text-ink-soft hover:border-teal"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Сохранить
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Подразделение</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as DepartmentId)}
              className={FIELD_CLASS}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Квартал</label>
            <select
              value={quarter}
              onChange={(e) => setQuarter(Number(e.target.value) as 1 | 2 | 3 | 4)}
              className={FIELD_CLASS}
            >
              {QUARTERS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>Статья расхода</label>
          <input
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            placeholder="Например, обучение сотрудников"
            className={FIELD_CLASS}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Тип</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as BudgetLineType)}
              className={FIELD_CLASS}
            >
              <option value="opex">OPEX</option>
              <option value="capex">CAPEX</option>
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Продукт</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className={FIELD_CLASS}>
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Плановое количество</label>
            <input
              type="number"
              min={0}
              value={quantityPlan}
              onChange={(e) => setQuantityPlan(e.target.value)}
              placeholder="0"
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Плановая сумма, ₸</label>
            <input
              type="number"
              min={0}
              value={amountPlan}
              onChange={(e) => setAmountPlan(e.target.value)}
              placeholder="0"
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>Обоснование</label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={3}
            placeholder="Кратко опишите причину и цель расхода"
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>
      </div>
    </Modal>
  );
}
