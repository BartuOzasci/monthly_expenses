import { CATEGORIES } from "../data/constants";
import { formatCurrency } from "../data/helpers";
import { useBudget } from "../context/BudgetContext";

const CategoryCard = ({ categoryKey, onDetailClick, delay = "" }) => {
  const { categories, budget } = useBudget();
  const cat = CATEGORIES[categoryKey];
  const data = categories[categoryKey];

  if (!cat || !data || budget <= 0) return null;

  const pct =
    data.base > 0
      ? Math.max(0, Math.min(100, (data.remaining / data.base) * 100))
      : 0;
  const isLow = pct < 25;

  return (
    <div
      className={`glass rounded-2xl p-5 sm:p-6 ${cat.glow} animate-scale-in ${delay} transition-all hover:scale-[1.01]`}
    >
      {/* Üst kısım */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-lg shadow-lg`}
          >
            {cat.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white/90 text-sm sm:text-base">
              {cat.label}
            </h3>
            <span className="text-[11px] sm:text-xs text-white/30 font-medium">
              %{cat.percentage} pay
            </span>
          </div>
        </div>
        <div
          className={`text-[11px] sm:text-xs font-mono ${cat.text} bg-white/5 rounded-lg px-2 py-1`}
        >
          {Math.round(pct)}%
        </div>
      </div>

      {/* Tutar bölümü */}
      <div className="mb-4">
        <p
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLow ? "text-red-400" : "text-white/95"}`}
        >
          {formatCurrency(data.remaining)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] sm:text-xs text-white/25">
            Başlangıç
          </span>
          <span className="text-[11px] sm:text-xs text-white/40 font-medium">
            {formatCurrency(data.base)}
          </span>
        </div>
      </div>

      {/* İlerleme çubuğu */}
      <div className="w-full h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full bg-gradient-to-r ${cat.gradient} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Yatırım notu */}
      {categoryKey === "yatirim" && (
        <div className="flex items-center gap-2.5 bg-emerald-500/8 rounded-xl px-3.5 py-2.5 mb-4 border border-emerald-500/10">
          <span className="text-base animate-float">💰</span>
          <div>
            <p className="text-[10px] sm:text-[11px] text-emerald-400/60 font-medium uppercase tracking-wider">
              Yatırman gereken
            </p>
            <p className="text-sm sm:text-base text-emerald-400 font-bold">
              {formatCurrency(data.base)}
            </p>
          </div>
        </div>
      )}

      {/* Detay butonu */}
      <button
        onClick={() => onDetailClick(categoryKey)}
        className={`w-full py-5 sm:py-6 rounded-2xl bg-gradient-to-r ${cat.gradientBg} ${cat.text} text-lg sm:text-xl font-extrabold btn-press border ${cat.border} hover:brightness-125 transition-all tracking-wide shadow-lg`}
      >
        Detay Görüntüle
      </button>
    </div>
  );
};

export default CategoryCard;
