import { useBudget } from "../context/BudgetContext";
import { getCurrentMonthName, formatCurrencyShort } from "../data/helpers";
import { SPENDING_KEYS } from "../data/constants";

const Navbar = () => {
  const { budget, categories } = useBudget();

  const remaining = SPENDING_KEYS.reduce(
    (sum, key) => sum + (categories[key]?.remaining ?? 0),
    0,
  );

  return (
    <nav className="sticky top-0 z-40 glass-strong">
      <div className="max-w-lg lg:max-w-5xl mx-auto px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3">
        <h1 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight truncate">
          <span className="gradient-text">Aylık Bütçe Kontrol</span>
        </h1>

        {budget > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium">
              {getCurrentMonthName()} kalan
            </p>
            <p
              className={`text-xs sm:text-sm font-bold font-mono ${remaining < 0 ? "text-red-400" : "text-white/80"}`}
            >
              {formatCurrencyShort(remaining)}
            </p>
          </div>
        )}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
    </nav>
  );
};

export default Navbar;
