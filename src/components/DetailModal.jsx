import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { CATEGORIES } from "../data/constants";
import { formatCurrency, getShortDate } from "../data/helpers";
import BottomSheet from "./ui/BottomSheet";

const DetailModal = ({ isOpen, onClose, categoryKey }) => {
  const { transactions, categories, editTransaction, deleteTransaction } =
    useBudget();
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  if (!isOpen || !categoryKey) return null;

  const cat = CATEGORIES[categoryKey];
  const data = categories[categoryKey];
  const list = transactions
    .filter((t) => t.category === categoryKey)
    .slice()
    .reverse();

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setEditAmount(tx.amount.toString());
  };

  const handleSaveEdit = (id) => {
    if (editAmount && parseFloat(editAmount) > 0) {
      editTransaction(id, { amount: editAmount });
    }
    setEditingId(null);
    setEditAmount("");
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${cat?.label ?? categoryKey} — Detay`}
      subtitle={`${list.length} işlem`}
      icon={cat?.icon ?? "📌"}
    >
      {/* Özet şeridi */}
      {data && (
        <div className="grid grid-cols-3 gap-2 mb-5">
          <Summary label="Pay" value={data.base} tone="text-white/70" />
          <Summary label="Harcanan" value={data.spent} tone="text-red-400/90" />
          <Summary
            label="Kalan"
            value={data.remaining}
            tone={data.remaining < 0 ? "text-red-400" : "text-emerald-400/90"}
          />
        </div>
      )}

      {list.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-3xl block mb-3 opacity-30">📭</span>
          <p className="text-white/25 text-sm">Henüz işlem bulunmuyor</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map((tx) => (
            <div
              key={tx.id}
              className="glass rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/5"
            >
              {editingId === tx.id ? (
                <div className="flex items-center gap-2.5">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="flex-1 min-w-0 glass rounded-2xl px-4 py-3 text-white/90 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(tx.id)}
                    aria-label="Kaydet"
                    className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-base font-bold btn-press border border-emerald-500/20"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    aria-label="Vazgeç"
                    className="w-12 h-12 shrink-0 rounded-2xl glass text-white/40 flex items-center justify-center text-base btn-press"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium mb-1.5 ${
                        tx.type === "harcama"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}
                    >
                      {tx.type === "harcama" ? "↓ Harcama" : "↑ Para Ekle"}
                    </span>
                    <p className="text-base sm:text-lg font-bold text-white/90 tabular-nums">
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/25 mt-0.5 font-medium">
                      {getShortDate(tx.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(tx)}
                      className="w-11 h-11 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition-colors btn-press text-base"
                      title="Düzenle"
                      aria-label="Düzenle"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="w-11 h-11 rounded-2xl glass flex items-center justify-center hover:bg-red-500/15 transition-colors btn-press text-base"
                      title="Sil"
                      aria-label="Sil"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full mt-5 py-4 rounded-2xl glass text-white/50 text-base font-semibold hover:bg-white/5 transition-colors btn-press min-h-[52px]"
      >
        Kapat
      </button>
    </BottomSheet>
  );
};

const Summary = ({ label, value, tone }) => (
  <div className="rounded-xl bg-white/[0.02] border border-white/5 px-3 py-2.5 text-center">
    <p className="text-[10px] text-white/25 uppercase tracking-wider">
      {label}
    </p>
    <p className={`text-xs sm:text-sm font-bold font-mono mt-1 ${tone}`}>
      {formatCurrency(value)}
    </p>
  </div>
);

export default DetailModal;
