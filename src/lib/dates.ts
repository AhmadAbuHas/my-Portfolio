import type { Locale } from "@/i18n/routing";

type YearMonth = { year: number; month: number };

function parse(value: string): YearMonth {
  const [year, month] = value.split("-").map(Number);
  return { year, month };
}

/** "Nov 2025" / "نوفمبر 2025". Arabic keeps Western digits (ar-u-nu-latn). */
export function formatMonthYear(value: string, locale: Locale) {
  const format = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en-US",
    { month: locale === "ar" ? "long" : "short", year: "numeric", timeZone: "UTC" },
  );
  return format.format(new Date(`${value}T00:00:00Z`));
}

/** Value for <time dateTime>, e.g. "2025-11". */
export function toYearMonth(value: string) {
  return value.slice(0, 7);
}

/** Months between two dates, counting both the start and end month (LinkedIn-style). */
export function monthsInclusive(start: string, end: string) {
  const a = parse(start);
  const b = parse(end);
  return (b.year - a.year) * 12 + (b.month - a.month) + 1;
}

/** Whole months elapsed since a date. */
export function monthsSince(start: string, now = new Date()) {
  const a = parse(start);
  return (now.getUTCFullYear() - a.year) * 12 + (now.getUTCMonth() + 1 - a.month);
}

export function splitMonths(total: number) {
  return { years: Math.floor(total / 12), months: total % 12 };
}
