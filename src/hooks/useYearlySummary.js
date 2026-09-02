import { useMemo } from "react";
import { useBudget } from "../context/BudgetContext";
import { MONTHS_TR } from "../data/constants";
import { computeMonthResult } from "../data/budgetMath";

/**
 * İçinde bulunulan yılın ay ay sonucu (yatırım hariç).
 * net > 0 → paradan artırıldı, net < 0 → fazla harcama.
 * Her yıl başında liste doğal olarak sıfırlanır.
 */
export const useYearlySummary = (includeCurrentMonth = true) => {
  const { pastMonths, transactions, budget, currentMonth, currentYear } =
    useBudget();

  return useMemo(() => {
    const year = new Date().getFullYear();

    const months = (pastMonths || [])
      .filter((m) => m.year === year)
      .map(computeMonthResult);

    if (includeCurrentMonth && budget > 0) {
      months.push(
        computeMonthResult({
          month: currentMonth,
          year: currentYear,
          monthName: MONTHS_TR[currentMonth],
          budget,
          transactions,
          inProgress: true,
        }),
      );
    }

    months.sort((a, b) => a.month - b.month);

    const totals = months.reduce(
      (acc, m) => {
        acc.net += m.net;
        acc.spent += m.spent;
        acc.pool += m.pool;
        return acc;
      },
      { net: 0, spent: 0, pool: 0 },
    );

    return { year, months, totals };
  }, [
    pastMonths,
    transactions,
    budget,
    currentMonth,
    currentYear,
    includeCurrentMonth,
  ]);
};
