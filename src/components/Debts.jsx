import { useBudget } from "../context/BudgetContext";
import { getCurrentMonthName, formatCurrency } from "../data/helpers";

const Debts = () => {
  const { borcTotal, budget } = useBudget();
  const monthName = getCurrentMonthName();

  if (budget <= 0) return null;

  return (
    <div className="max-w-lg mx-auto px-5 mb-6">
      <div className="glass rounded-2xl p-5 sm:p-6 glow-rose">
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-lg shadow-lg">
            💳
          </div>
          <div>
            <h3 className="font-semibold text-white/90 text-sm sm:text-base">
              Borçlar
            </h3>
            <span className="text-[11px] text-white/30">Aylık borç takibi</span>
          </div>
        </div>

        {/* Borç detay */}
        <div className="bg-rose-500/8 rounded-xl p-4 border border-rose-500/10">
          <p className="text-xs sm:text-sm text-white/40 mb-1.5 font-medium">
            Buse Borç — {monthName} Ayı
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
            {formatCurrency(Math.abs(borcTotal))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Debts;
