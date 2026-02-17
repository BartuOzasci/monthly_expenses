import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { getCurrentMonthName, formatCurrency } from "../data/helpers";

const BudgetInput = () => {
  const { budget, setBudget } = useBudget();
  const [inputValue, setInputValue] = useState(
    budget > 0 ? budget.toString() : "",
  );
  const monthName = getCurrentMonthName();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue && parseFloat(inputValue) > 0) {
      setBudget(inputValue);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) setInputValue(val);
  };

  return (
    <div className="max-w-lg mx-auto px-5 mb-8">
      {/* Başlık */}
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight">
          {monthName} Ayı Bütçem
        </h2>
        {budget <= 0 && (
          <p className="text-sm text-white/35 mt-1.5 font-light">
            Lütfen bütçenizi girin
          </p>
        )}
      </div>

      {/* Giriş formu */}
      <form onSubmit={handleSubmit} className="flex gap-2.5 sm:gap-3">
        <div className="flex-1 relative group">
          <input
            type="number"
            value={inputValue}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full glass rounded-2xl px-4 py-3.5 sm:py-4 text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all text-lg sm:text-xl font-medium tracking-wide"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 text-lg font-semibold">
            ₺
          </span>
        </div>
        <button
          type="submit"
          className="px-5 sm:px-7 py-3.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl font-semibold text-white text-sm sm:text-base btn-press shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow"
        >
          {budget > 0 ? "Güncelle" : "Kaydet"}
        </button>
      </form>

      {/* Özet */}
      {budget > 0 && (
        <div className="mt-4 glass rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-xs sm:text-sm text-white/35 font-medium">
            Toplam bütçe
          </span>
          <span className="text-base sm:text-lg font-bold text-white/80">
            {formatCurrency(budget)}
          </span>
        </div>
      )}
    </div>
  );
};

export default BudgetInput;
