import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEY, CATEGORIES, MONTHS_TR } from "../data/constants";
import { generateId } from "../data/helpers";

const BudgetContext = createContext(null);

const getInitialState = () => ({
  budget: 0,
  transactions: [],
  pastMonths: [],
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
});

export const BudgetProvider = ({ children }) => {
  const [state, setState] = useLocalStorage(STORAGE_KEY, getInitialState());

  /* ---- Ay geçişi kontrolü ---- */
  useEffect(() => {
    const now = new Date();
    const cm = now.getMonth();
    const cy = now.getFullYear();

    if (state.currentMonth !== cm || state.currentYear !== cy) {
      setState((prev) => {
        // Borç hariç tüm işlemleri kaydet
        const saved = prev.transactions.filter((t) => t.category !== "borc");
        const summary = {
          month: prev.currentMonth,
          year: prev.currentYear,
          monthName: MONTHS_TR[prev.currentMonth],
          budget: prev.budget,
          transactions: saved,
        };
        return {
          ...getInitialState(),
          currentMonth: cm,
          currentYear: cy,
          pastMonths: [...(prev.pastMonths || []), summary].slice(-3),
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Aksiyonlar ---- */
  const setBudget = useCallback(
    (amount) => setState((p) => ({ ...p, budget: parseFloat(amount) || 0 })),
    [setState],
  );

  const addTransaction = useCallback(
    (tx) => {
      const newTx = {
        ...tx,
        id: generateId(),
        date: new Date().toISOString(),
        amount: parseFloat(tx.amount) || 0,
      };
      setState((p) => ({ ...p, transactions: [...p.transactions, newTx] }));
    },
    [setState],
  );

  const editTransaction = useCallback(
    (id, updates) =>
      setState((p) => ({
        ...p,
        transactions: p.transactions.map((t) =>
          t.id === id
            ? {
                ...t,
                ...updates,
                amount: parseFloat(updates.amount) || t.amount,
              }
            : t,
        ),
      })),
    [setState],
  );

  const deleteTransaction = useCallback(
    (id) =>
      setState((p) => ({
        ...p,
        transactions: p.transactions.filter((t) => t.id !== id),
      })),
    [setState],
  );

  /* ---- Hesaplamalar ---- */
  const categories = useMemo(() => {
    const result = {};
    const zorunluTotal = state.transactions
      .filter((t) => t.category === "zorunluGiderler")
      .reduce(
        (s, t) => (t.type === "harcama" ? s + t.amount : s - t.amount),
        0,
      );

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      const base = (state.budget * cat.percentage) / 100;
      const txs = state.transactions.filter((t) => t.category === key);
      const spent = txs
        .filter((t) => t.type === "harcama")
        .reduce((s, t) => s + t.amount, 0);
      const added = txs
        .filter((t) => t.type === "paraEkle")
        .reduce((s, t) => s + t.amount, 0);
      let remaining = base - spent + added;
      if (key === "genelHarcamalar") remaining -= zorunluTotal;
      result[key] = { base, remaining, spent, added };
    });
    return result;
  }, [state.budget, state.transactions]);

  const zorunluGiderlerTotal = useMemo(
    () =>
      state.transactions
        .filter((t) => t.category === "zorunluGiderler")
        .reduce(
          (s, t) => (t.type === "harcama" ? s + t.amount : s - t.amount),
          0,
        ),
    [state.transactions],
  );

  const borcTotal = useMemo(
    () =>
      state.transactions
        .filter((t) => t.category === "borc")
        .reduce(
          (s, t) => (t.type === "paraEkle" ? s + t.amount : s - t.amount),
          0,
        ),
    [state.transactions],
  );

  /* ---- Provider değeri ---- */
  const value = useMemo(
    () => ({
      budget: state.budget,
      transactions: state.transactions,
      pastMonths: state.pastMonths,
      currentMonth: state.currentMonth,
      currentYear: state.currentYear,
      categories,
      zorunluGiderlerTotal,
      borcTotal,
      setBudget,
      addTransaction,
      editTransaction,
      deleteTransaction,
    }),
    [
      state,
      categories,
      zorunluGiderlerTotal,
      borcTotal,
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
