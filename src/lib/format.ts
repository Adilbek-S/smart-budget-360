export function formatCompactTenge(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) {
    return `${sign}${round1(abs / 1_000_000_000)} млрд ₸`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${round1(abs / 1_000_000)} млн ₸`;
  }
  if (abs >= 1_000) {
    return `${sign}${round1(abs / 1_000)} тыс ₸`;
  }
  return `${sign}${abs} ₸`;
}

export function formatFullTenge(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₸`;
}

function round1(value: number): string {
  return (Math.round(value * 10) / 10).toLocaleString("ru-RU", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toLocaleString("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatSignedPercent(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${formatPercent(value, digits)}`;
}

export function formatSignedPoints(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toLocaleString("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} п.п.`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const datePart = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
  const timePart = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${datePart}, ${timePart}`;
}
