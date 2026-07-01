"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DEPARTMENTS, PRODUCTS } from "@/lib/mock-data";
import { useIncomeRows } from "@/lib/use-income-rows";
import type { DepartmentId, Year } from "@/lib/types";

const QUARTERS: { id: 1 | 2 | 3 | 4; label: string }[] = [
  { id: 1, label: "I квартал" },
  { id: 2, label: "II квартал" },
  { id: 3, label: "III квартал" },
  { id: 4, label: "IV квартал" },
];

const REAL_PRODUCTS = PRODUCTS.filter((p) => p.id !== "none");

const FIELD_CLASS =
  "w-full rounded-lg border border-line-soft bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal";
const LABEL_CLASS = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted";

interface NewIncomeRowModalProps {
  open: boolean;
  onClose: () => void;
  year: Year;
}

export function NewIncomeRowModal({ open, onClose, year }: NewIncomeRowModalProps) {
  const { addRow } = useIncomeRows();

  const [department, setDepartment] = useState<DepartmentId>(DEPARTMENTS[0].id);
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [productId, setProductId] = useState<string>(REAL_PRODUCTS[0]?.id ?? "");
  const [isActiveService, setIsActiveService] = useState(true);
  const [volumePlan, setVolumePlan] = useState("");
  const [unit, setUnit] = useState("транзакции");
  const [incomePlan, setIncomePlan] = useState("");
  const [tariff, setTariff] = useState("");
  const [comment, setComment] = useState("");

  const isValid = productId.length > 0 && Number(volumePlan) > 0 && Number(incomePlan) > 0;

  function reset() {
    setDepartment(DEPARTMENTS[0].id);
    setQuarter(1);
    setProductId(REAL_PRODUCTS[0]?.id ?? "");
    setIsActiveService(true);
    setVolumePlan("");
    setUnit("транзакции");
    setIncomePlan("");
    setTariff("");
    setComment("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit() {
    if (!isValid) return;
    addRow({
      year,
      quarter,
      department,
      productId,
      isActiveService,
      volumePlan: Number(volumePlan),
      unit: unit.trim() || "транзакции",
      incomePlan: Number(incomePlan),
      tariff: tariff.trim() || "Не указан",
      comment: comment.trim() || "Комментарий не указан.",
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Новая строка дохода"
      subtitle="Строка будет добавлена с плановыми показателями"
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Продукт</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className={FIELD_CLASS}>
              {REAL_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Действующая услуга</label>
            <select
              value={isActiveService ? "yes" : "no"}
              onChange={(e) => setIsActiveService(e.target.value === "yes")}
              className={FIELD_CLASS}
            >
              <option value="yes">Да</option>
              <option value="no">Нет (пилот)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Плановый объём, тыс.</label>
            <input
              type="number"
              min={0}
              value={volumePlan}
              onChange={(e) => setVolumePlan(e.target.value)}
              placeholder="0"
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Единица измерения</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="транзакции, пользователи…"
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Плановый доход, ₸</label>
            <input
              type="number"
              min={0}
              value={incomePlan}
              onChange={(e) => setIncomePlan(e.target.value)}
              placeholder="0"
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Тариф</label>
            <input
              value={tariff}
              onChange={(e) => setTariff(e.target.value)}
              placeholder="Например, 0,3% от суммы транзакции"
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>Комментарий</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Кратко опишите основание плана"
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>
      </div>
    </Modal>
  );
}
