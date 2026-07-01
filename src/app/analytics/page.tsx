"use client";

import { useState } from "react";
import { useFilters } from "@/lib/filter-context";
import { FilterBar } from "@/components/filters/filter-bar";
import { OverviewTab } from "@/components/analytics/overview-tab";
import { DepartmentsTab } from "@/components/analytics/departments-tab";
import { CategoriesTab } from "@/components/analytics/categories-tab";
import { ProductsTab } from "@/components/analytics/products-tab";

const TABS = [
  { id: "overview", label: "Обзор" },
  { id: "departments", label: "Подразделения" },
  { id: "categories", label: "Статьи расходов" },
  { id: "products", label: "Продукты" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AnalyticsPage() {
  const { year, period, scope } = useFilters();
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Аналитика</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Сравнительный анализ доходов, расходов и структуры затрат за {year} год
        </p>
      </div>

      <FilterBar />

      <div className="flex flex-wrap items-center gap-1 rounded-full bg-canvas-3 p-1 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-primary text-white shadow-sm" : "text-ink-soft hover:text-primary-dark"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab year={year} period={period} scope={scope} />}
      {tab === "departments" && <DepartmentsTab year={year} period={period} scope={scope} />}
      {tab === "categories" && <CategoriesTab year={year} period={period} scope={scope} />}
      {tab === "products" && <ProductsTab year={year} scope={scope} />}
    </div>
  );
}
