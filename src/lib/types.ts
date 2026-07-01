export type Year = 2025 | 2026 | 2027;

export type PeriodId = "year" | "q1" | "q2" | "q3" | "q4";

export type FilterMode = "org" | "department";

export type DepartmentId =
  | "techdev"
  | "it"
  | "opscontrol"
  | "cards"
  | "antifraud"
  | "payments"
  | "digitaltenge"
  | "orgdev"
  | "fin"
  | "sec"
  | "architecture"
  | "astana"
  | "adm";

export interface Department {
  id: DepartmentId;
  name: string;
  short: string;
}

export type ExpenseCategoryId =
  | "staff"
  | "it_infra"
  | "software"
  | "services"
  | "travel"
  | "other";

export interface ExpenseCategory {
  id: ExpenseCategoryId;
  name: string;
}

export interface MonthPoint {
  month: number; // 1-12
  plan: number;
  fact: number | null;
  forecast: number | null;
}

export type RiskSeverity = "critical" | "warning" | "info";

export interface BudgetRisk {
  id: string;
  title: string;
  description: string;
  department: DepartmentId;
  severity: RiskSeverity;
}

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ApprovalRequest {
  id: string;
  title: string;
  department: DepartmentId;
  amount: number;
  author: string;
  submittedAt: string;
  status: ApprovalStatus;
  comment?: string;
}

export type DeviationStatus = "critical" | "warning" | "normal";

export interface DeviationRow {
  id: string;
  year: Year;
  department: DepartmentId;
  article: string;
  plan: number;
  fact: number;
  status: DeviationStatus;
}

export interface HistoryEntry {
  id: string;
  date: string;
  author: string;
  department: DepartmentId | "org";
  action: string;
  details: string;
}

// ---- Расходы: бюджетные строки ----

export type BudgetLineType = "opex" | "capex";

export type BudgetLineStatus = "draft" | "review" | "approved" | "clarification";

export type LineRisk = "high" | "moderate" | "none";

// How the "факт" value was populated: pulled automatically from the accounting
// system (e.g. 1С) or entered manually by a user.
export type FactSource = "auto" | "manual";

export interface LineHistoryEntry {
  id: string;
  dateTime: string; // ISO datetime
  author: string;
  field: string;
  oldValue: string;
  newValue: string;
  comment: string;
}

export interface BudgetLine {
  id: string;
  year: Year;
  quarter: 1 | 2 | 3 | 4;
  department: DepartmentId;
  article: string;
  type: BudgetLineType;
  unit: string;
  quantityPlan: number;
  quantityFact: number;
  amountPlan: number;
  amountFact: number;
  factSource: FactSource;
  calculation: string;
  justification: string;
  relatedDepartments: DepartmentId[];
  productId: string | null;
  status: BudgetLineStatus;
  risk: LineRisk;
  author: string;
  updatedAt: string; // ISO datetime
  history: LineHistoryEntry[];
}

// ---- Продукты (общие для расходов и доходов) ----

export type ProductStage = "new" | "existing";

export interface Product {
  id: string;
  name: string;
  stage: ProductStage;
  department: DepartmentId;
}

// ---- Доходы: строки по продуктам ----

export interface IncomeProductRow {
  id: string;
  year: Year;
  quarter: 1 | 2 | 3 | 4;
  department: DepartmentId;
  productId: string;
  isActiveService: boolean;
  growthRate: number; // percent, may be negative
  volumePlan: number;
  volumeFact: number;
  unit: string; // e.g. "транзакции", "пользователи", "запросы"
  incomePlan: number;
  incomeFact: number;
  factSource: FactSource;
  tariff: string;
  calculation: string;
  comment: string;
  author: string;
  updatedAt: string;
  history: LineHistoryEntry[];
}

// ---- Согласование ----

export type ReviewItemType = "expense" | "income";

export type ReviewStatus = "pending" | "approved" | "clarification" | "rejected";

export interface ReviewItem {
  id: string;
  type: ReviewItemType;
  title: string;
  department: DepartmentId;
  quarter: 1 | 2 | 3 | 4;
  year: Year;
  amount: number;
  previousAmount: number | null;
  submittedAt: string; // ISO date
  author: string;
  status: ReviewStatus;
  calculation: string;
  justification: string;
  productId: string | null;
  comment: string;
  routeStage: number; // 0=Инициатор, 1=Руководитель, 2=Финансовое подразделение, 3=Утверждено
}

// ---- Исполнение бюджета ----

export type BudgetState = "within" | "overrun" | "underuse" | "near_limit";

export interface ProblemArticleRow {
  id: string;
  department: DepartmentId;
  article: string;
  plan: number;
  fact: number;
  forecast: number;
  executionPercent: number;
  state: BudgetState;
}

// ---- Сценарное моделирование ----

export interface ScenarioParams {
  incomeGrowth: number;
  opexGrowth: number;
  itCostGrowth: number;
  usdRate: number;
  userGrowth: number;
}

export interface ScenarioPreset {
  id: "conservative" | "base" | "optimistic";
  name: string;
  description: string;
  params: ScenarioParams;
}

export interface ScenarioResult {
  expense: number;
  income: number;
  result: number;
  expenseDeltaPercent: number;
  incomeDeltaPercent: number;
}

// ---- История изменений ----

export interface BudgetVersion {
  id: string;
  label: string;
  date: string; // ISO date
  expense: number;
  income: number;
  author: string;
  basis: string;
}

export interface ActionLogEntry {
  id: string;
  dateTime: string; // ISO datetime
  author: string;
  department: DepartmentId;
  section: string;
  action: string;
  object: string;
  comment: string;
}

export interface KpiData {
  budgetExpense: number;
  actualExpense: number;
  executionPercent: number;
  income: number;
  forecastExpense: number;
  savings: number;
  deltas: {
    budgetExpense: number;
    actualExpense: number;
    executionPercent: number;
    income: number;
    forecastExpense: number;
    savings: number;
  };
}
