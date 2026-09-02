import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  STORAGE_KEY,
  SCHEMA_VERSION,
  SPENDING_KEYS,
  MONTHS_TR,
} from "../data/constants";
import { FIXED_EXPENSES, FIXED_EXPENSES_TOTAL } from "../data/fixedExpenses";
import { generateId } from "../data/helpers";
import {
  computeCategories,
  computeDailyLimit,
  getDistributable,
} from "../data/budgetMath";

const BudgetContext = createContext(null);

const getInitialState = () => ({
  version: SCHEMA_VERSION,
  budget: 0,
  transactions: [],
  pastMonths: [],
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
});

/** Sadece geçerli kategorilerdeki işlemleri bırak (borç / eski zorunlu gider temizliği). */
const sanitizeTransactions = (transactions = []) =>
  transactions.filter((t) => SPENDING_KEYS.includes(t?.category));

/** Eski sürümden gelen veriyi yeni şemaya taşı. */
const migrate = (state) => {
  if (!state || typeof state !== "object") return getInitialState();
  if (state.version === SCHEMA_VERSION) return state;

  return {
    ...getInitialState(),
    ...state,
    version: SCHEMA_VERSION,
    transactions: sanitizeTransactions(state.transactions),
    pastMonths: (state.pastMonths || []).map((m) => ({
      ...m,
      fixedTotal: m.fixedTotal ?? FIXED_EXPENSES_TOTAL,
      transactions: sanitizeTransactions(m.transactions),
    })),
  };
};

export const BudgetProvider = ({ children }) => {
  const [rawState, setState] = useLocalStorage(STORAGE_KEY, getInitialState());
  const state = useMemo(() => migrate(rawState), [rawState]);

  /* ---- Ay geçişi: biten ayı arşivle, yeni aya sıfırdan başla ---- */
  useEffect(() => {
    const now = new Date();
    const cm = now.getMonth();
    const cy = now.getFullYear();

    setState((prev) => {
      const p = migrate(prev);
      if (p.currentMonth === cm && p.currentYear === cy) {
        return p === prev ? prev : p;
      }

      const summary = {
        month: p.currentMonth,
        year: p.currentYear,
        monthName: MONTHS_TR[p.currentMonth],
        budget: p.budget,
        fixedTotal: FIXED_EXPENSES_TOTAL,
        transactions: sanitizeTransactions(p.transactions),
      };

      return {
        ...getInitialState(),
        currentMonth: cm,
        currentYear: cy,
        // Yıllık özet için son 24 ay saklanır (görüntülemede yıla göre filtrelenir).
        pastMonths: [...(p.pastMonths || []), summary].slice(-24),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Aksiyonlar ---- */
  const setBudget = useCallback(
    (amount) =>
      setState((p) => ({ ...migrate(p), budget: parseFloat(amount) || 0 })),
    [setState],
  );

  const addTransaction = useCallback(
    (tx) => {
      if (!SPENDING_KEYS.includes(tx.category)) return;
      const newTx = {
        ...tx,
        id: generateId(),
        date: new Date().toISOString(),
        amount: parseFloat(tx.amount) || 0,
      };
      setState((p) => {
        const prev = migrate(p);
        return { ...prev, transactions: [...prev.transactions, newTx] };
      });
    },
    [setState],
  );

  const editTransaction = useCallback(
    (id, updates) =>
      setState((p) => {
        const prev = migrate(p);
        return {
          ...prev,
          transactions: prev.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                  amount: parseFloat(updates.amount) || t.amount,
                }
              : t,
          ),
        };
      }),
    [setState],
  );

  const deleteTransaction = useCallback(
    (id) =>
      setState((p) => {
        const prev = migrate(p);
        return {
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== id),
        };
      }),
    [setState],
  );

  /* ---- Hesaplamalar ---- */
  const categories = useMemo(
    () =>
      computeCategories(state.budget, state.transactions, FIXED_EXPENSES_TOTAL),
    [state.budget, state.transactions],
  );

  const dailyLimit = useMemo(
    () => computeDailyLimit(categories, state.transactions),
    [categories, state.transactions],
  );

  const distributable = useMemo(
    () => getDistributable(state.budget, FIXED_EXPENSES_TOTAL),
    [state.budget],
  );

  const value = useMemo(
    () => ({
      budget: state.budget,
      transactions: state.transactions,
      pastMonths: state.pastMonths,
      currentMonth: state.currentMonth,
      currentYear: state.currentYear,
      categories,
      dailyLimit,
      distributable,
      fixedExpenses: FIXED_EXPENSES,
      fixedExpensesTotal: FIXED_EXPENSES_TOTAL,
      setBudget,
      addTransaction,
      editTransaction,
      deleteTransaction,
    }),
    [
      state,
      categories,
      dailyLimit,
      distributable,
      setBudget,
      addTransaction,
      editTransaction,
      deleteTransaction,
    ],
  );

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
};
