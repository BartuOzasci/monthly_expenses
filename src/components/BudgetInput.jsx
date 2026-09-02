import { useEffect, useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { getCurrentMonthName, formatCurrency } from "../data/helpers";

const BudgetInput = () => {
  const { budget, setBudget, fixedExpensesTotal, distributable } = useBudget();
  const [inputValue, setInputValue] = useState(
    budget > 0 ? budget.toString() : "",
  );
  const [saved, setSaved] = useState(false);
  const monthName = getCurrentMonthName();

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 1600);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue && parseFloat(inputValue) > 0) {
      setBudget(inputValue);
      setSaved(true);
      e.target.querySelector("input")?.blur();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) setInputValue(val);
  };

  const isDirty = parseFloat(inputValue || "0") !== budget;

  return (
    <section className="mb-5 sm:mb-6">
      {/* Başlık */}
      <div className="text-center mb-4 sm:mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight">
          {monthName} Ayı Bütçem
        </h2>
        <p className="text-xs sm:text-sm text-white/35 mt-1 font-light">
          {budget <= 0
            ? "Başlamak için bu ayki bütçeni gir"
            : "Sabit giderler otomatik düşülür"}
        </p>
      </div>

      {/* Giriş formu */}
      <form onSubmit={handleSubmit} className="flex gap-2.5 sm:gap-3">
        <div className="flex-1 relative">
          <input
            type="number"
            inputMode="decimal"
            value={inputValue}
            onChange={handleChange}
            placeholder="0.00"
            aria-label="Aylık bütçe"
            className="w-full glass rounded-2xl px-4 py-3.5 sm:py-4 pr-10 text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-lg sm:text-xl font-semibold tracking-wide"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 text-lg font-semibold pointer-events-none">
            ₺
          </span>
        </div>
        <button
          type="submit"
          disabled={!inputValue || parseFloat(inputValue) <= 0}
          className="px-5 sm:px-7 py-3.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl font-semibold text-white text-sm sm:text-base btn-press shadow-lg shadow-indigo-500/20 disabled:opacity-30 transition-all whitespace-nowrap"
        >
          {saved && !isDirty ? "✓" : budget > 0 ? "Güncelle" : "Kaydet"}
        </button>
      </form>

      {/* Bütçe dağılımı özeti */}
      {budget > 0 && (
        <div className="mt-3 glass rounded-2xl divide-y divide-white/5 overflow-hidden">
          <Row label="Toplam bütçe" value={formatCurrency(budget)} />
          <Row
            label="Zorunlu giderler"
            value={`− ${formatCurrency(fixedExpensesTotal)}`}
            valueClass="text-amber-400/90"
          />
          <Row
            label="Dağıtılan tutar"
            value={formatCurrency(distributable)}
            valueClass="text-white/90 font-bold"
            strong
          />
        </div>
      )}
    </section>
  );
};

const Row = ({ label, value, valueClass = "text-white/70", strong }) => (
  <div
    className={`flex items-center justify-between px-4 ${strong ? "py-3.5 bg-white/[0.02]" : "py-2.5"}`}
  >
    <span className="text-xs sm:text-sm text-white/40 font-medium">
      {label}
    </span>
    <span className={`text-sm sm:text-base font-semibold ${valueClass}`}>
      {value}
    </span>
  </div>
);

export default BudgetInput;
