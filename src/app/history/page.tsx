"use client";

import { useMemo, useState } from "react";
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
  ACTION_LOG,
  ACTION_LOG_ACTIONS,
  ACTION_LOG_AUTHORS,
  ACTION_LOG_SECTIONS,
  BUDGET_VERSIONS,
} from "@/lib/mock-data";
import { formatCompactTenge, formatDate, formatDateTime, formatFullTenge } from "@/lib/format";
import { FilterBar } from "@/components/filters/filter-bar";
import { Card, CardHeader } from "@/components/ui/card";

const TABS = [
  { id: "versions", label: "Версии бюджета" },
  { id: "log", label: "Журнал действий" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function HistoryPage() {
  const { year, period } = useFilters();
  const [tab, setTab] = useState<TabId>("versions");

  const [author, setAuthor] = useState("all");
  const [section, setSection] = useState("all");
  const [actionType, setActionType] = useState("all");

  const chartData = BUDGET_VERSIONS.map((v) => ({
    name: v.label.split(" — ")[0],
    Расходы: v.expense,
    Доходы: v.income,
  }));

  const filteredLog = useMemo(() => {
    return ACTION_LOG.filter((entry) => {
      const entryYear = Number(entry.dateTime.slice(0, 4));
      const entryMonth = Number(entry.dateTime.slice(5, 7));
      const entryQuarter = Math.ceil(entryMonth / 3);
      if (entryYear !== year) return false;
      if (period !== "year") {
        const periodQuarter = { q1: 1, q2: 2, q3: 3, q4: 4 }[period];
        if (periodQuarter && entryQuarter !== periodQuarter) return false;
      }
      if (author !== "all" && entry.author !== author) return false;
      if (section !== "all" && entry.section !== section) return false;
      if (actionType !== "all" && entry.action !== actionType) return false;
      return true;
    }).sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1));
  }, [year, period, author, section, actionType]);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">История изменений</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Версии бюджета организации и журнал действий пользователей
        </p>
      </div>

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

      {tab === "versions" && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Версии бюджета" subtitle="Ключевые вехи планирования 2026 года" />
            <div className="-mx-5 overflow-x-auto px-5">
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    <th className="py-2.5 pr-4">Версия</th>
                    <th className="py-2.5 pr-4">Дата</th>
                    <th className="py-2.5 pr-4 text-right">Расходы</th>
                    <th className="py-2.5 pr-4 text-right">Доходы</th>
                    <th className="py-2.5 pr-4 text-right">Финансовый результат</th>
                    <th className="py-2.5 pr-4">Автор</th>
                    <th className="py-2.5 pl-2">Основание</th>
                  </tr>
                </thead>
                <tbody>
                  {BUDGET_VERSIONS.map((v) => {
                    const result = v.income - v.expense;
                    return (
                      <tr key={v.id} className="border-b border-line-soft last:border-0 align-top transition-colors hover:bg-canvas-3/60">
                        <td className="py-3 pr-4 font-semibold text-ink">{v.label}</td>
                        <td className="py-3 pr-4 text-ink-soft">{formatDate(v.date)}</td>
                        <td className="py-3 pr-4 text-right text-ink-soft">{formatFullTenge(v.expense)}</td>
                        <td className="py-3 pr-4 text-right text-ink-soft">{formatFullTenge(v.income)}</td>
                        <td className={`py-3 pr-4 text-right font-semibold ${result >= 0 ? "text-accent" : "text-risk"}`}>
                          {formatCompactTenge(result)}
                        </td>
                        <td className="py-3 pr-4 text-ink-soft">{v.author}</td>
                        <td className="max-w-[280px] py-3 pl-2 text-ink-soft">{v.basis}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="Изменение расходов и доходов между версиями" subtitle="₸" />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#E3EEEB" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#686868", fontSize: 12 }} axisLine={{ stroke: "#D7DADD" }} tickLine={false} />
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
                <Bar dataKey="Расходы" fill="#295A5B" radius={[6, 6, 0, 0]} maxBarSize={36} />
                <Bar dataKey="Доходы" fill="#659945" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab === "log" && (
        <div className="flex flex-col gap-6">
          <FilterBar />

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4 shadow-sm">
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="rounded-full border border-line-soft bg-white px-3.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-teal"
            >
              <option value="all">Все пользователи</option>
              {ACTION_LOG_AUTHORS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="rounded-full border border-line-soft bg-white px-3.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-teal"
            >
              <option value="all">Все разделы</option>
              {ACTION_LOG_SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="rounded-full border border-line-soft bg-white px-3.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-teal"
            >
              <option value="all">Все действия</option>
              {ACTION_LOG_ACTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <Card>
            <CardHeader title="Журнал действий" subtitle={`Записей: ${filteredLog.length}`} />
            {filteredLog.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">
                Событий не найдено — измените фильтры или период.
              </p>
            ) : (
              <div className="max-h-[600px] overflow-auto rounded-lg border border-line-soft">
                <table className="w-full min-w-[880px] border-collapse text-sm">
                  <thead>
                    <tr className="sticky top-0 z-10 bg-canvas-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      <th className="px-4 py-3">Дата и время</th>
                      <th className="px-3 py-3">Пользователь</th>
                      <th className="px-3 py-3">Раздел</th>
                      <th className="px-3 py-3">Действие</th>
                      <th className="px-3 py-3">Объект</th>
                      <th className="px-4 py-3">Комментарий</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLog.map((entry) => (
                      <tr key={entry.id} className="border-b border-line-soft last:border-0 transition-colors hover:bg-canvas-3/60">
                        <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{formatDateTime(entry.dateTime)}</td>
                        <td className="px-3 py-3 font-medium text-ink">{entry.author}</td>
                        <td className="px-3 py-3 text-ink-soft">{entry.section}</td>
                        <td className="px-3 py-3 text-ink-soft">{entry.action}</td>
                        <td className="max-w-[220px] px-3 py-3 text-ink-soft">
                          <span className="block truncate" title={entry.object}>
                            {entry.object}
                          </span>
                        </td>
                        <td className="max-w-[260px] px-4 py-3 text-ink-soft">
                          <span className="block truncate" title={entry.comment}>
                            {entry.comment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
