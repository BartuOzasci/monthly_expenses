/**
 * BÜTÇE MATEMATİĞİ
 * ------------------------------------------------------------------
 * Tüm hesaplamalar burada toplanır; hem canlı (bu ay) hem de geçmiş
 * ay özetleri aynı fonksiyonları kullanır.
 */
import { CATEGORIES, SPENDING_KEYS } from "./constants";
import { FIXED_EXPENSES_TOTAL } from "./fixedExpenses";
import { getDaysInMonth, isSameMonth } from "./helpers";

/** Bütçeden sabit giderler düşüldükten sonra kategorilere dağıtılan tutar. */
export const getDistributable = (budget, fixedTotal = FIXED_EXPENSES_TOTAL) =>
  Math.max(0, (Number(budget) || 0) - fixedTotal);

const sumBy = (list, predicate) =>
  list.reduce(
    (sum, t) => (predicate(t) ? sum + (Number(t.amount) || 0) : sum),
    0,
  );

/**
 * Kategori bazlı dağılım.
 * base      → kategoriye ayrılan pay
 * spent     → yapılan harcamalar
 * added     → sonradan eklenen para
 * remaining → kalan bakiye
 */
export const computeCategories = (
  budget,
  transactions = [],
  fixedTotal = FIXED_EXPENSES_TOTAL,
) => {
  const distributable = getDistributable(budget, fixedTotal);
  const result = {};

  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const base = (distributable * cat.percentage) / 100;
    const txs = transactions.filter((t) => t.category === key);
    const spent = sumBy(txs, (t) => t.type === "harcama");
    const added = sumBy(txs, (t) => t.type === "paraEkle");

    result[key] = {
      base,
      spent,
      added,
      remaining: base - spent + added,
      percentage: cat.percentage,
    };
  });

  return result;
};

/**
 * Harcanabilir havuz = yatırım hariç kategorilerin payı (+ eklenen para).
 */
export const computeSpendablePool = (categories) =>
  SPENDING_KEYS.reduce(
    (sum, key) =>
      sum + (categories[key]?.base ?? 0) + (categories[key]?.added ?? 0),
    0,
  );

/** Yatırım hariç toplam harcama. */
export const computeSpendableSpent = (categories) =>
  SPENDING_KEYS.reduce((sum, key) => sum + (categories[key]?.spent ?? 0), 0);

/**
 * GÜNLÜK HARCAMA LİMİTİ (devreden bakiyeli)
 * ------------------------------------------------------------------
 * baseDaily  = havuz / ayın gün sayısı        (ayın başında sabitlenir)
 * carryLimit = baseDaily × bugünün günü − bugünden önce harcanan
 *              → harcamadığın gün bir sonraki güne devreder
 * paceLimit  = kalan havuz / kalan gün
 *              → fazla harcadıysan günlük hak buraya düşer
 *
 * Bugünün hakkı ikisinin büyüğüdür: normal seyirde devreden mantık
 * çalışır, limit aşıldığında kalan para kalan güne bölünerek düşer,
 * tekrar birikince devreden mantık kaldığı yerden devam eder.
 */
export const computeDailyLimit = (
  categories,
  transactions = [],
  referenceDate = new Date(),
) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const today = referenceDate.getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const remainingDays = daysInMonth - today + 1;

  const pool = computeSpendablePool(categories);
  const baseDaily = pool > 0 ? pool / daysInMonth : 0;

  let spentBefore = 0;
  let spentToday = 0;

  transactions.forEach((t) => {
    if (t.type !== "harcama" || !SPENDING_KEYS.includes(t.category)) return;
    const d = new Date(t.date);
    if (!isSameMonth(d, year, month)) return;
    if (d.getDate() < today) spentBefore += Number(t.amount) || 0;
    else if (d.getDate() === today) spentToday += Number(t.amount) || 0;
  });

  const totalSpent = spentBefore + spentToday;
  const remainingPool = Math.max(0, pool - totalSpent);

  const carryLimit = baseDaily * today - spentBefore;
  const paceLimit =
    remainingDays > 0 ? Math.max(0, pool - spentBefore) / remainingDays : 0;

  const todayLimit = Math.max(0, carryLimit, paceLimit);
  const todayRemaining = Math.max(0, todayLimit - spentToday);

  // Önceki günlerden devreden kısım (limit düşürüldüyse 0).
  const carriedOver = Math.max(0, todayLimit - baseDaily);
  const isReduced = pool > 0 && todayLimit < baseDaily - 0.01;

  return {
    pool,
    baseDaily,
    todayLimit,
    todayUsed: spentToday,
    todayRemaining,
    carriedOver,
    isReduced,
    remainingPool,
    totalSpent,
    daysInMonth,
    remainingDays,
    todayPct: todayLimit > 0 ? (todayRemaining / todayLimit) * 100 : 0,
    poolPct: pool > 0 ? (remainingPool / pool) * 100 : 0,
  };
};

/**
 * Bir ayın "yatırım hariç" net sonucu.
 * net > 0 → paradan artırıldı, net < 0 → fazla harcama yapıldı.
 */
export const computeMonthResult = (monthData) => {
  const fixedTotal = monthData.fixedTotal ?? FIXED_EXPENSES_TOTAL;
  const categories = computeCategories(
    monthData.budget,
    monthData.transactions || [],
    fixedTotal,
  );
  const pool = computeSpendablePool(categories);
  const spent = computeSpendableSpent(categories);

  return {
    month: monthData.month,
    year: monthData.year,
    monthName: monthData.monthName,
    budget: monthData.budget || 0,
    fixedTotal,
    pool,
    spent,
    net: pool - spent,
    inProgress: !!monthData.inProgress,
  };
};
