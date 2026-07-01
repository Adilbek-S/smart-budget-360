"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Wallet, Receipt, Target, PiggyBank } from "lucide-react";
import { useFilters } from "@/lib/filter-context";
import { BUDGET_LINES, DEPARTMENTS, PERIODS, getKpi, productName } from "@/lib/mock-data";
import { useBudgetLines } from "@/lib/use-budget-lines";
import { formatCompactTenge } from "@/lib/format";
import { FilterBar } from "@/components/filters/filter-bar";
import { DepartmentMultiSelect } from "@/components/filters/department-multi-select";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { SidePanel } from "@/components/ui/side-panel";
import { HistoryTimeline } from "@/components/ui/history-timeline";
import { FactSourceLegend } from "@/components/ui/fact-source-icon";
import { BudgetLinesTable, type SortDir, type SortKey } from "@/components/expenses/budget-lines-table";
import { BudgetLineDetails } from "@/components/expenses/budget-line-details";
import { NewBudgetLineModal } from "@/components/expenses/new-budget-line-modal";
import type { BudgetLine, DepartmentId } from "@/lib/types";

export default function ExpensesPage() {
  const { year, period, scope } = useFilters();
  const kpi = useMemo(() => getKpi(year, period, scope), [year, period, scope]);
  const { customLines } = useBudgetLines();

  const [selectedDepartments, setSelectedDepartments] = useState<DepartmentId[]>(
    DEPARTMENTS.map((d) => d.id)
  );
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedRow, setSelectedRow] = useState<BudgetLine | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allLines = useMemo(() => [...BUDGET_LINES, ...customLines], [customLines]);

  const periodDef = PERIODS.find((p) => p.id === period);
  const quarterFilter = periodDef && periodDef.id !== "year" ? periodDef.months[0] : null;
  const quarterFromMonth = quarterFilter ? Math.ceil(quarterFilter / 3) : null;

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    let rows = allLines.filter((row) => row.year === year);
    if (quarterFromMonth) rows = rows.filter((row) => row.quarter === quarterFromMonth);
    rows = rows.filter((row) => selectedDepartments.includes(row.department));
    if (query) {
      rows = rows.filter((row) => {
        const product = productName(row.productId).toLowerCase();
        return (
          row.article.toLowerCase().includes(query) ||
          product.includes(query) ||
          row.justification.toLowerCase().includes(query)
        );
      });
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const valueA = sortKey === "amount" ? a.amountFact : a.amountFact - a.amountPlan;
        const valueB = sortKey === "amount" ? b.amountFact : b.amountFact - b.amountPlan;
        return sortDir === "asc" ? valueA - valueB : valueB - valueA;
      });
    }
    return rows;
  }, [allLines, year, quarterFromMonth, selectedDepartments, search, sortKey, sortDir]);

  function handleSort(key: "amount" | "deviation") {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Расходы</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Планирование и контроль расходной части бюджета
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="План"
          value={formatCompactTenge(kpi.budgetExpense)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={Receipt}
          label="Факт"
          value={formatCompactTenge(kpi.actualExpense)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={Target}
          label="Прогноз"
          value={formatCompactTenge(kpi.forecastExpense)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="accent"
        />
        <StatCard
          icon={PiggyBank}
          label="Остаток"
          value={formatCompactTenge(kpi.budgetExpense - kpi.actualExpense)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="warning"
        />
      </div>

      <FilterBar />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <DepartmentMultiSelect selected={selectedDepartments} onChange={setSelectedDepartments} />
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по статье, продукту, обоснованию"
            className="w-full rounded-full border border-line-soft bg-white py-2 pl-9 pr-3.5 text-sm text-ink outline-none focus:border-teal"
          />
        </div>
      </div>

      <Card>
        <CardHeader
          title="Бюджетные строки"
          subtitle={`Показано строк: ${filteredRows.length}`}
          action={
            <div className="flex flex-wrap items-center gap-4">
              <FactSourceLegend />
              <button
                onClick={() => setModalOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                <Plus size={16} />
                Новая строка
              </button>
            </div>
          }
        />
        <BudgetLinesTable
          rows={filteredRows}
          onSelectRow={setSelectedRow}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </Card>

      <SidePanel
        open={selectedRow !== null}
        onClose={() => setSelectedRow(null)}
        title={selectedRow?.article ?? ""}
        subtitle={selectedRow ? `${productName(selectedRow.productId)}` : undefined}
        resetKey={selectedRow?.id}
        tabs={
          selectedRow
            ? [
                { id: "details", label: "Детали", content: <BudgetLineDetails line={selectedRow} /> },
                {
                  id: "history",
                  label: "История изменений",
                  content: <HistoryTimeline entries={selectedRow.history} />,
                },
              ]
            : []
        }
      />

      <NewBudgetLineModal open={modalOpen} onClose={() => setModalOpen(false)} year={year} />
    </div>
  );
}
