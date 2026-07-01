"use client";

import { useMemo, useState } from "react";
import { Check, Scale, TrendingDown, TrendingUp, Wallet } from "lucide-react";
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
import {
  BASE_SCENARIO_RESULT,
  SCENARIO_PRESETS,
  calculateScenario,
} from "@/lib/mock-data";
import { formatCompactTenge, formatFullTenge, formatPercent, formatSignedPercent } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { SliderField } from "@/components/ui/slider-field";
import type { ScenarioParams } from "@/lib/types";

export default function ScenariosPage() {
  const basePreset = SCENARIO_PRESETS.find((s) => s.id === "base")!;
  const [selectedId, setSelectedId] = useState(basePreset.id);
  const [params, setParams] = useState<ScenarioParams>(basePreset.params);

  function selectPreset(id: (typeof SCENARIO_PRESETS)[number]["id"]) {
    const preset = SCENARIO_PRESETS.find((s) => s.id === id)!;
    setSelectedId(id);
    setParams(preset.params);
  }

  function updateParam<K extends keyof ScenarioParams>(key: K, value: number) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => calculateScenario(params), [params]);
  const deltaVsBase = result.result - BASE_SCENARIO_RESULT.result;
  const deltaVsBasePercent =
    BASE_SCENARIO_RESULT.result !== 0 ? (deltaVsBase / Math.abs(BASE_SCENARIO_RESULT.result)) * 100 : 0;

  const chartData = SCENARIO_PRESETS.map((preset) => {
    const presetResult = calculateScenario(preset.params);
    return {
      name: preset.name,
      Доходы: presetResult.income,
      Расходы: presetResult.expense,
    };
  });

  const interpretation = useMemo(() => {
    const incomePart =
      result.incomeDeltaPercent >= 0
        ? `доходы увеличатся на ${formatPercent(result.incomeDeltaPercent)}`
        : `доходы снизятся на ${formatPercent(Math.abs(result.incomeDeltaPercent))}`;
    const expensePart =
      result.expenseDeltaPercent >= 0
        ? `рост расходов (с учётом стоимости ИТ-ресурсов и курса доллара) на ${formatPercent(result.expenseDeltaPercent)}`
        : `снижение расходов на ${formatPercent(Math.abs(result.expenseDeltaPercent))}`;
    const resultPart =
      deltaVsBase >= 0
        ? `увеличит ожидаемый финансовый результат на ${formatCompactTenge(Math.abs(deltaVsBase))} относительно базового сценария`
        : `уменьшит ожидаемый финансовый результат на ${formatCompactTenge(Math.abs(deltaVsBase))} относительно базового сценария`;
    return `При выбранных параметрах ${incomePart}, однако ${expensePart} ${resultPart}.`;
  }, [result, deltaVsBase]);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Сценарное моделирование</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Сравнение вариантов развития бюджета на 2026 год при изменении ключевых параметров
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SCENARIO_PRESETS.map((preset) => {
          const active = preset.id === selectedId;
          const presetResult = calculateScenario(preset.params);
          return (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset.id)}
              className={`flex flex-col gap-3 rounded-xl border p-5 text-left shadow-sm transition-colors ${
                active ? "border-primary bg-canvas-4" : "border-line bg-white hover:border-teal"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-ink">{preset.name}</span>
                {active && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={14} />
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-muted">{preset.description}</p>
              <div className="mt-1 flex items-center justify-between border-t border-line-soft pt-3">
                <span className="text-xs font-medium text-ink-muted">Финансовый результат</span>
                <span className={`text-sm font-bold ${presetResult.result >= 0 ? "text-accent" : "text-risk"}`}>
                  {formatCompactTenge(presetResult.result)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader title="Параметры сценария" subtitle="Скорректируйте значения вручную" />
          <div className="flex flex-col gap-5">
            <SliderField
              label="Рост доходов"
              value={params.incomeGrowth}
              min={-10}
              max={30}
              onChange={(v) => updateParam("incomeGrowth", v)}
            />
            <SliderField
              label="Рост операционных расходов"
              value={params.opexGrowth}
              min={-5}
              max={20}
              onChange={(v) => updateParam("opexGrowth", v)}
            />
            <SliderField
              label="Рост стоимости ИТ-ресурсов"
              value={params.itCostGrowth}
              min={-5}
              max={25}
              onChange={(v) => updateParam("itCostGrowth", v)}
            />
            <SliderField
              label="Курс доллара"
              value={params.usdRate}
              min={400}
              max={600}
              step={5}
              suffix="₸"
              onChange={(v) => updateParam("usdRate", v)}
            />
            <SliderField
              label="Изменение количества пользователей"
              value={params.userGrowth}
              min={-15}
              max={25}
              onChange={(v) => updateParam("userGrowth", v)}
            />
          </div>
        </Card>

        <div className="flex flex-col gap-6 xl:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Wallet}
              label="Расходы"
              value={formatCompactTenge(result.expense)}
              deltaText={formatSignedPercent(result.expenseDeltaPercent)}
              deltaDirection={result.expenseDeltaPercent >= 0 ? "up" : "down"}
              deltaSentiment="neutral"
              iconTone="primary"
            />
            <StatCard
              icon={TrendingUp}
              label="Доходы"
              value={formatCompactTenge(result.income)}
              deltaText={formatSignedPercent(result.incomeDeltaPercent)}
              deltaDirection={result.incomeDeltaPercent >= 0 ? "up" : "down"}
              deltaSentiment={result.incomeDeltaPercent >= 0 ? "positive" : "negative"}
              iconTone="accent"
            />
            <StatCard
              icon={Scale}
              label="Финансовый результат"
              value={formatCompactTenge(result.result)}
              deltaText="—"
              deltaDirection="neutral"
              deltaSentiment={result.result >= 0 ? "positive" : "negative"}
              iconTone={result.result >= 0 ? "accent" : "risk"}
            />
            <StatCard
              icon={deltaVsBase >= 0 ? TrendingUp : TrendingDown}
              label="Изменение к базовому сценарию"
              value={formatCompactTenge(deltaVsBase)}
              deltaText={formatSignedPercent(deltaVsBasePercent)}
              deltaDirection={deltaVsBase >= 0 ? "up" : "down"}
              deltaSentiment={deltaVsBase >= 0 ? "positive" : "negative"}
              iconTone="warning"
            />
          </div>

          <Card>
            <CardHeader title="Сравнение сценариев" subtitle="Доходы и расходы по пресетам, ₸" />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#E3EEEB" vertical={false} />
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="Доходы" fill="#659945" radius={[6, 6, 0, 0]} maxBarSize={36} />
                <Bar dataKey="Расходы" fill="#295A5B" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <Card className="bg-canvas-4">
        <p className="text-sm leading-relaxed text-ink">{interpretation}</p>
      </Card>
    </div>
  );
}
