import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { formatCurrency } from "../data/helpers";

const MandatoryExpenses = () => {
  const { addTransaction, zorunluGiderlerTotal, budget } = useBudget();
  const [inputValue, setInputValue] = useState("");

  if (budget <= 0) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (inputValue && parseFloat(inputValue) > 0) {
      addTransaction({
        amount: inputValue,
        category: "zorunluGiderler",
        type: "harcama",
        description: "Zorunlu Gider",
      });
      setInputValue("");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-5 mb-10 sm:mb-12 mt-6 sm:mt-8">
      <div className="glass rounded-2xl p-5 sm:p-6 glow-orange">
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg shadow-lg">
            📋
          </div>
          <div>
            <h3 className="font-semibold text-white/90 text-sm sm:text-base">
              Zorunlu Giderler
            </h3>
            <span className="text-[11px] text-white/30">
              Genel Harcamalar'dan düşülür
            </span>
          </div>
        </div>

        {/* Giriş */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tutar girin"
              className="w-full glass rounded-xl px-4 py-3 text-white/90 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm font-medium">
              ₺
            </span>
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white text-sm font-semibold btn-press shadow-lg shadow-orange-500/20"
          >
            Ekle
          </button>
        </form>

        {/* Toplam */}
        <div className="flex items-center justify-between bg-orange-500/8 rounded-lg px-4 py-3 border border-orange-500/10">
          <span className="text-xs sm:text-sm text-white/40">Toplam</span>
          <span className="text-lg sm:text-xl font-bold text-orange-400">
            {formatCurrency(zorunluGiderlerTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MandatoryExpenses;
