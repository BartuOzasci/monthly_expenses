import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { CATEGORIES } from "../data/constants";

const ALL_CATEGORIES = {
  ...CATEGORIES,
  zorunluGiderler: {
    label: "Zorunlu Giderler",
    icon: "📋",
    gradient: "from-amber-400 to-orange-500",
  },
  borc: {
    label: "Borçlar",
    icon: "💳",
    gradient: "from-rose-400 to-red-500",
  },
};

const ValueEntryModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useBudget();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !type) return;
    addTransaction({
      amount,
      category,
      type,
      description: ALL_CATEGORIES[category]?.label || category,
    });
    setAmount("");
    setCategory("");
    setType("");
    onClose();
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={handleOverlay}
    >
      <div className="w-full max-w-lg glass-strong rounded-t-3xl p-6 sm:p-7 animate-slide-up safe-bottom">
        {/* Handle */}
        <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-5" />
        <h2 className="text-base sm:text-lg font-bold text-white/90 mb-5 text-center tracking-tight">
          Değer Gir
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Miktar */}
          <div>
            <label className="text-[11px] sm:text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">
              Miktar
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full glass rounded-2xl px-4 py-4 text-white/90 text-xl sm:text-2xl font-bold placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 tracking-wide"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 text-lg font-bold">
                ₺
              </span>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="text-[11px] sm:text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">
              Kategori
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ALL_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`flex items-center gap-2.5 py-4 px-4 rounded-2xl text-sm sm:text-base font-medium transition-all btn-press min-h-[52px] ${
                    category === key
                      ? "bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 ring-2 ring-indigo-500/15"
                      : "glass text-white/50 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* İşlem türü */}
          <div>
            <label className="text-[11px] sm:text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">
              İşlem Türü
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("harcama")}
                className={`py-4 rounded-2xl text-base font-semibold transition-all btn-press min-h-[52px] ${
                  type === "harcama"
                    ? "bg-red-500/15 border border-red-400/30 text-red-400 ring-2 ring-red-500/15"
                    : "glass text-white/50 hover:text-white/70"
                }`}
              >
                📉 Harcama
              </button>
              <button
                type="button"
                onClick={() => setType("paraEkle")}
                className={`py-4 rounded-2xl text-base font-semibold transition-all btn-press min-h-[52px] ${
                  type === "paraEkle"
                    ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 ring-2 ring-emerald-500/15"
                    : "glass text-white/50 hover:text-white/70"
                }`}
              >
                📈 Para Ekle
              </button>
            </div>
          </div>

          {/* Butonlar */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-white/10">
            <div className="glass-strong rounded-2xl p-3.5 sm:p-4 border border-white/8">
              <div className="flex gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 sm:py-4 rounded-2xl glass text-white/50 text-sm sm:text-base font-semibold hover:bg-white/5 transition-colors btn-press min-h-[48px] sm:min-h-[52px]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={!amount || !category || !type}
                  className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm sm:text-base font-semibold disabled:opacity-20 btn-press shadow-lg shadow-indigo-500/20 min-h-[48px] sm:min-h-[52px]"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ValueEntryModal;
