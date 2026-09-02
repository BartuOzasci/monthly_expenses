import { MONTHS_TR, DAYS_TR } from "./constants";

export const formatCurrency = (amount) => {
  return (
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0) + " ₺"
  );
};

/** Kuruşsuz, yuvarlanmış gösterim (limit / özet kartları için). */
export const formatCurrencyShort = (amount) =>
  formatCurrency(Math.round(Number(amount) || 0));

export const getMonthName = (index) => MONTHS_TR[index] ?? "";

export const getCurrentMonthName = () => MONTHS_TR[new Date().getMonth()];

export const getFormattedDate = (date = new Date()) => {
  const day = DAYS_TR[date.getDay()];
  const d = date.getDate();
  const month = MONTHS_TR[date.getMonth()];
  const year = date.getFullYear();
  return `${d} ${month} ${year}, ${day}`;
};

export const getShortDate = (isoString) => {
  const d = new Date(isoString);
  const date = d.getDate();
  const month = MONTHS_TR[d.getMonth()];
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${date} ${month} ${hours}:${mins}`;
};

/** İlgili ayın gün sayısı (28 / 29 / 30 / 31). */
export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

/** İki tarih aynı ay/yıl içinde mi? */
export const isSameMonth = (date, year, month) =>
  date.getFullYear() === year && date.getMonth() === month;

export const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);
