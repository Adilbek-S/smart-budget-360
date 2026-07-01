import { AlertTriangle, Info } from "lucide-react";
import type { DepartmentId, PeriodId, Year } from "@/lib/types";
import { DEPARTMENTS, getDepartmentExecutionBars, getRisksForScope } from "@/lib/mock-data";
import { formatPercent } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentBarChart } from "@/components/charts/department-bar-chart";

const SEVERITY_TONE = { critical: "critical", warning: "warning", info: "info" } as const;

export function DepartmentsTab({
  year,
  period,
  scope,
}: {
  year: Year;
  period: PeriodId;
  scope: "org" | DepartmentId;
}) {
  const bars = getDepartmentExecutionBars(year, period);
  const ranked = [...bars].sort((a, b) => b.executionPercent - a.executionPercent);
  const risks = getRisksForScope(scope, 4);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Сравнение подразделений" subtitle="План и факт, ₸" />
        <DepartmentBarChart data={bars} />
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Рейтинг подразделений" subtitle="По исполнению бюджета" />
          <ul className="flex flex-col gap-2.5">
            {ranked.map((d, index) => (
              <li
                key={d.departmentId}
                className="flex items-center gap-3 rounded-lg border border-line-soft bg-canvas-3 p-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-canvas-4 text-sm font-bold text-primary-dark">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-ink">
                  {DEPARTMENTS.find((dep) => dep.id === d.departmentId)?.name ?? d.department}
                </span>
                <span className="text-sm font-bold text-ink">{formatPercent(d.executionPercent)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Риски по подразделениям" subtitle="Ключевые предупреждения" />
          <ul className="flex flex-col gap-3">
            {risks.map((risk) => {
              const Icon = risk.severity === "info" ? Info : AlertTriangle;
              return (
                <li key={risk.id} className="flex gap-3 rounded-lg border border-line-soft bg-canvas-3 p-3">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      risk.severity === "critical"
                        ? "bg-[#f6e0dd] text-risk"
                        : risk.severity === "warning"
                          ? "bg-[#f6ecd7] text-warning"
                          : "bg-canvas-4 text-teal"
                    }`}
                  >
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{risk.title}</p>
                      <Badge tone={SEVERITY_TONE[risk.severity]}>
                        {risk.severity === "critical" ? "Критично" : risk.severity === "warning" ? "Внимание" : "Инфо"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">
                      {DEPARTMENTS.find((d) => d.id === risk.department)?.short}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
