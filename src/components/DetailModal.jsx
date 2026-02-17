import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { CATEGORIES } from "../data/constants";
import { formatCurrency, getShortDate } from "../data/helpers";

const DetailModal = ({ isOpen, onClose, categoryKey }) => {
  const { transactions, editTransaction, deleteTransaction } = useBudget();
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  if (!isOpen || !categoryKey) return null;

  const cat = CATEGORIES[categoryKey] || {
    label: categoryKey,
    text: "text-white",
    border: "border-white/10",
    icon: "📌",
    gradient: "from-gray-400 to-gray-500",
  };

  const categoryTx = transactions.filter((t) => t.category === categoryKey);
  const relatedTx =
    categoryKey === "genelHarcamalar"
      ? [
          ...categoryTx,
          ...transactions.filter((t) => t.category === "zorunluGiderler"),
        ]
      : categoryTx;

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

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={handleOverlay}
    >
      <div className="w-full max-w-lg glass-strong rounded-t-[2rem] p-5 sm:p-6 animate-slide-up max-h-[85vh] overflow-y-auto safe-bottom">
        {/* Handle */}
        <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-5" />

        {/* Başlık */}
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <div
            className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cat.gradient || "from-gray-400 to-gray-500"} flex items-center justify-center text-sm shadow-lg`}
          >
            {cat.icon}
          </div>
          <h2
            className={`text-base sm:text-lg font-bold ${cat.text || "text-white"}`}
          >
            {cat.label} — Detay
          </h2>
        </div>

        {relatedTx.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-3xl block mb-3 opacity-30">📭</span>
            <p className="text-white/25 text-sm">Henüz işlem bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {relatedTx.map((tx) => (
              <div
                key={tx.id}
                className="glass rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/5"
              >
                {editingId === tx.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="flex-1 glass rounded-xl px-3 py-2.5 text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(tx.id)}
                      className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-sm font-bold btn-press border border-emerald-500/20"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="w-10 h-10 rounded-xl glass text-white/40 flex items-center justify-center text-sm btn-press"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                            tx.type === "harcama"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-emerald-500/15 text-emerald-400"
                          }`}
                        >
                          {tx.type === "harcama" ? "↓ Harcama" : "↑ Para Ekle"}
                        </span>
                        {tx.category === "zorunluGiderler" && (
                          <span className="text-[10px] sm:text-xs text-orange-400/70 font-medium">
                            Zorunlu
                          </span>
                        )}
                      </div>
                      <p className="text-base sm:text-lg font-bold text-white/90">
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/25 mt-0.5 font-medium">
                        {getShortDate(tx.date)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 ml-3">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors btn-press text-sm"
                        title="Düzenle"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass flex items-center justify-center hover:bg-red-500/15 transition-colors btn-press text-sm"
                        title="Sil"
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
          className="w-full mt-5 py-3.5 rounded-xl glass text-white/50 font-medium hover:bg-white/5 transition-colors btn-press"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default DetailModal;
