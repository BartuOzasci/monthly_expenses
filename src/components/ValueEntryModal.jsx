import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { CATEGORIES, SPENDING_KEYS } from "../data/constants";
import BottomSheet from "./ui/BottomSheet";

/** Sadece harcama yapılabilen kategoriler; yatırım burada yer almaz. */
const ENTRY_CATEGORIES = SPENDING_KEYS.map((key) => ({
  key,
  ...CATEGORIES[key],
}));

const ValueEntryModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useBudget();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("harcama");

  const reset = () => {
    setAmount("");
    setCategory("");
    setType("harcama");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !type) return;
    addTransaction({
      amount,
      category,
      type,
      description: CATEGORIES[category]?.label || category,
    });
    handleClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Değer Gir"
      subtitle="Harcama veya para ekleme kaydı"
      icon="✏️"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Miktar */}
        <div>
          <Label>Miktar</Label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full glass rounded-2xl px-4 py-4 pr-10 text-white/90 text-xl sm:text-2xl font-bold placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 tracking-wide"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 text-lg font-bold pointer-events-none">
              ₺
            </span>
          </div>
        </div>

        {/* Kategori */}
        <div>
          <Label>Kategori</Label>
          <div className="grid grid-cols-2 gap-3">
            {ENTRY_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className={`flex items-center gap-2.5 py-4 px-4 rounded-2xl text-sm sm:text-base font-medium transition-all btn-press min-h-[52px] ${
                  category === cat.key
                    ? "bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 ring-2 ring-indigo-500/15"
                    : "glass text-white/50 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <span className="text-lg shrink-0" aria-hidden="true">
                  {cat.icon}
                </span>
                <span className="truncate text-left">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* İşlem türü */}
        <div>
          <Label>İşlem Türü</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("harcama")}
              className={`py-4 rounded-2xl text-sm sm:text-base font-semibold transition-all btn-press min-h-[52px] ${
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
              className={`py-4 rounded-2xl text-sm sm:text-base font-semibold transition-all btn-press min-h-[52px] ${
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
        <div className="pt-4 border-t border-white/10 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3.5 sm:py-4 rounded-2xl glass text-white/50 text-sm sm:text-base font-semibold hover:bg-white/5 transition-colors btn-press min-h-[50px]"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={!amount || !category || !type}
            className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm sm:text-base font-semibold disabled:opacity-25 btn-press shadow-lg shadow-indigo-500/20 min-h-[50px]"
          >
            Kaydet
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

const Label = ({ children }) => (
  <label className="text-[11px] sm:text-xs text-white/40 mb-2 block font-medium uppercase tracking-wider">
    {children}
  </label>
);

export default ValueEntryModal;
