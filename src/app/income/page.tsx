"use client";

import { useMemo, useState } from "react";
import { Gauge, Plus, Target, TrendingUp, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFilters } from "@/lib/filter-context";
import {
  DEPARTMENTS,
  INCOME_PRODUCT_ROWS,
  MONTH_NAMES,
  PERIODS,
  PRODUCTS,
  getIncomeForecast,
  getIncomeMonthlySeries,
  getKpi,
  productName,
} from "@/lib/mock-data";
import { formatCompactTenge, formatFullTenge, formatPercent } from "@/lib/format";
import { FilterBar } from "@/components/filters/filter-bar";
import { DepartmentMultiSelect } from "@/components/filters/department-multi-select";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { SidePanel } from "@/components/ui/side-panel";
import { HistoryTimeline } from "@/components/ui/history-timeline";
import { FactSourceLegend } from "@/components/ui/fact-source-icon";
import { IncomeTable, type IncomeSortKey, type SortDir } from "@/components/income/income-table";
import { IncomeDetails } from "@/components/income/income-details";
import { NewIncomeRowModal } from "@/components/income/new-income-row-modal";
import { useIncomeRows } from "@/lib/use-income-rows";
import type { DepartmentId, IncomeProductRow } from "@/lib/types";

type StageFilter = "all" | "new" | "existing";

const STAGE_OPTIONS: { id: StageFilter; label: string }[] = [
  { id: "all", label: "Все продукты" },
  { id: "new", label: "Новые" },
  { id: "existing", label: "Действующие" },
];

export default function IncomePage() {
  const { year, period, scope } = useFilters();
  const kpi = useMemo(() => getKpi(year, period, scope), [year, period, scope]);
  const { customRows } = useIncomeRows();

  const [selectedDepartments, setSelectedDepartments] = useState<DepartmentId[]>(
    DEPARTMENTS.map((d) => d.id)
  );
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [sortKey, setSortKey] = useState<IncomeSortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedRow, setSelectedRow] = useState<IncomeProductRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allRows = useMemo(() => [...INCOME_PRODUCT_ROWS, ...customRows], [customRows]);

  const incomeMonthly = useMemo(() => {
    const series = getIncomeMonthlySeries(year, scope);
    return series.map((p) => ({
      label: MONTH_NAMES[p.month - 1],
      plan: p.plan,
      fact: p.fact,
    }));
  }, [year, scope]);

  const incomePlanTotal = incomeMonthly.reduce((sum, p) => sum + p.plan, 0);
  const executionPercent = incomePlanTotal > 0 ? (kpi.income / incomePlanTotal) * 100 : 0;
  const forecast = useMemo(() => getIncomeForecast(year, scope), [year, scope]);

  const periodDef = PERIODS.find((p) => p.id === period);
  const quarterFilter = periodDef && periodDef.id !== "year" ? periodDef.months[0] : null;
  const quarterFromMonth = quarterFilter ? Math.ceil(quarterFilter / 3) : null;

  const filteredRows = useMemo(() => {
    let rows = allRows.filter((row) => row.year === year);
    if (quarterFromMonth) rows = rows.filter((row) => row.quarter === quarterFromMonth);
    rows = rows.filter((row) => selectedDepartments.includes(row.department));
    if (stageFilter !== "all") {
      rows = rows.filter((row) => {
        const stage = PRODUCTS.find((p) => p.id === row.productId)?.stage ?? "existing";
        return stage === stageFilter;
      });
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const valueA =
          sortKey === "income" ? a.incomeFact : a.incomePlan !== 0 ? a.incomeFact / a.incomePlan : 0;
        const valueB =
          sortKey === "income" ? b.incomeFact : b.incomePlan !== 0 ? b.incomeFact / b.incomePlan : 0;
        return sortDir === "asc" ? valueA - valueB : valueB - valueA;
      });
    }
    return rows;
  }, [allRows, year, quarterFromMonth, selectedDepartments, stageFilter, sortKey, sortDir]);

  function handleSort(key: "income" | "completion") {
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
        <h2 className="text-2xl font-bold text-primary-dark">Доходы</h2>
        <p className="mt-1 text-sm text-ink-muted">Планирование доходов по продуктам и услугам</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Плановый доход"
          value={formatCompactTenge(incomePlanTotal)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Фактический доход"
          value={formatCompactTenge(kpi.income)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="accent"
        />
        <StatCard
          icon={Gauge}
          label="Выполнение плана"
          value={formatPercent(executionPercent)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment={executionPercent >= 95 ? "positive" : "negative"}
          iconTone="accent"
        />
        <StatCard
          icon={Target}
          label="Прогноз до конца года"
          value={formatCompactTenge(forecast)}
          deltaText="—"
          deltaDirection="neutral"
          deltaSentiment="neutral"
          iconTone="primary"
        />
      </div>

      <FilterBar />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <DepartmentMultiSelect selected={selectedDepartments} onChange={setSelectedDepartments} />
        <div className="flex items-center gap-1 rounded-full bg-canvas-3 p-1">
          {STAGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStageFilter(opt.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                stageFilter === opt.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink-soft hover:text-primary-dark"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader title="План и факт доходов по месяцам" subtitle="Динамика по месяцам, ₸" />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeMonthly} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E3EEEB" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#686868", fontSize: 12 }}
              axisLine={{ stroke: "#D7DADD" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatCompactTenge(Number(v))}
              tick={{ fill: "#686868", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              formatter={(value, name) => [formatFullTenge(Number(value ?? 0)), String(name)]}
              contentStyle={{ borderRadius: 12, border: "1px solid #D7DADD", fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
            <Bar dataKey="plan" name="План" fill="#CFDFD9" radius={[6, 6, 0, 0]} maxBarSize={28} />
            <Bar dataKey="fact" name="Факт" fill="#659945" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardHeader
          title="Доходы по продуктам"
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
        <IncomeTable
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
        title={selectedRow ? productName(selectedRow.productId) : ""}
        subtitle={selectedRow ? `Q${selectedRow.quarter} ${selectedRow.year}` : undefined}
        resetKey={selectedRow?.id}
        tabs={
          selectedRow
            ? [
                { id: "details", label: "Детали", content: <IncomeDetails row={selectedRow} /> },
                {
                  id: "history",
                  label: "История изменений",
                  content: <HistoryTimeline entries={selectedRow.history} />,
                },
              ]
            : []
        }
      />

      <NewIncomeRowModal open={modalOpen} onClose={() => setModalOpen(false)} year={year} />
    </div>
  );
}
