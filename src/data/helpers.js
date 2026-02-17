import { MONTHS_TR, DAYS_TR } from "./constants";

export const formatCurrency = (amount) => {
  return (
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + " ₺"
  );
};

export const getCurrentMonthName = () => MONTHS_TR[new Date().getMonth()];

export const getFormattedDate = () => {
  const now = new Date();
  const day = DAYS_TR[now.getDay()];
  const date = now.getDate();
  const month = MONTHS_TR[now.getMonth()];
  const year = now.getFullYear();
  return `${date} ${month} ${year}, ${day}`;
};

export const getShortDate = (isoString) => {
  const d = new Date(isoString);
  const date = d.getDate();
  const month = MONTHS_TR[d.getMonth()];
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${date} ${month} ${hours}:${mins}`;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
