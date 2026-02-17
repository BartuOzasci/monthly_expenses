import { useBudget } from "../context/BudgetContext";
import { CATEGORIES, MONTHS_TR } from "../data/constants";
import { formatCurrency } from "../data/helpers";

const PastMonthsModal = ({ isOpen, onClose }) => {
  const { pastMonths } = useBudget();

  if (!isOpen) return null;

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const computeSummary = (data) => {
    const result = {};
    const zorunluTotal = (data.transactions || [])
      .filter((t) => t.category === "zorunluGiderler")
      .reduce(
        (s, t) => (t.type === "harcama" ? s + t.amount : s - t.amount),
        0,
      );

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      const base = (data.budget * cat.percentage) / 100;
      const txs = (data.transactions || []).filter((t) => t.category === key);
      const spent = txs
        .filter((t) => t.type === "harcama")
        .reduce((s, t) => s + t.amount, 0);
      const added = txs
        .filter((t) => t.type === "paraEkle")
        .reduce((s, t) => s + t.amount, 0);
      let remaining = base - spent + added;
      if (key === "genelHarcamalar") remaining -= zorunluTotal;
      result[key] = { base, remaining };
    });
    return result;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={handleOverlay}
    >
      <div className="w-full max-w-lg glass-strong rounded-t-[2rem] p-5 sm:p-6 animate-slide-up max-h-[85vh] overflow-y-auto safe-bottom">
        {/* Handle */}
        <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-5" />
        <h2 className="text-base sm:text-lg font-bold text-white/90 mb-6 text-center tracking-tight">
          📊 Geçmiş 3 Ay
        </h2>

        {!pastMonths || pastMonths.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-3xl block mb-3 opacity-30">📅</span>
            <p className="text-white/25 text-sm">
              Henüz geçmiş ay verisi bulunmuyor
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastMonths
              .slice()
              .reverse()
              .map((month, idx) => {
                const summary = computeSummary(month);
                return (
                  <div
                    key={idx}
                    className="glass rounded-2xl p-4 sm:p-5 animate-scale-in"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white/90 font-bold text-sm sm:text-base">
                        {month.monthName || MONTHS_TR[month.month]} {month.year}
                      </h3>
                      <span className="text-[11px] sm:text-xs text-white/30 font-medium glass rounded-lg px-2 py-1">
                        {formatCurrency(month.budget)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(CATEGORIES).map(([key, cat]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between glass rounded-xl px-3.5 py-2.5 sm:py-3"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-[10px]`}
                            >
                              {cat.icon}
                            </div>
                            <span className="text-xs sm:text-sm text-white/60 font-medium">
                              {cat.label}
                            </span>
                          </div>
                          <span
                            className={`font-bold text-xs sm:text-sm ${
                              (summary[key]?.remaining || 0) >= 0
                                ? cat.text
                                : "text-red-400"
                            }`}
                          >
                            {formatCurrency(summary[key]?.remaining || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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

export default PastMonthsModal;
