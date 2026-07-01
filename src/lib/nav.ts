import {
  Home,
  ArrowDownCircle,
  ArrowUpCircle,
  ClipboardCheck,
  Activity,
  GitBranch,
  PieChart,
  History,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/expenses", label: "Расходы", icon: ArrowDownCircle },
  { href: "/income", label: "Доходы", icon: ArrowUpCircle },
  { href: "/approval", label: "Согласование", icon: ClipboardCheck },
  { href: "/execution", label: "Исполнение бюджета", icon: Activity },
  { href: "/scenarios", label: "Сценарное моделирование", icon: GitBranch },
  { href: "/analytics", label: "Аналитика", icon: PieChart },
  { href: "/history", label: "История изменений", icon: History },
];

export function pageTitle(pathname: string): string {
  const item = NAV_ITEMS.find((n) =>
    n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)
  );
  return item?.label ?? "Smart Budget 360";
}
