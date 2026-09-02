import { CATEGORIES } from "../data/constants";
import { formatCurrency, clamp } from "../data/helpers";
import { useBudget } from "../context/BudgetContext";
import Card from "./ui/Card";
import SectionHeader from "./ui/SectionHeader";
import ProgressBar from "./ui/ProgressBar";

/** Harcama yapılabilen kategori kartı (Genel Harcamalar / Eğlence). */
const CategoryCard = ({ categoryKey, onDetailClick, delay = "" }) => {
  const { categories, budget } = useBudget();
  const cat = CATEGORIES[categoryKey];
  const data = categories[categoryKey];

  if (!cat || !data || budget <= 0) return null;

  const pct = data.base > 0 ? clamp((data.remaining / data.base) * 100) : 0;
  const isLow = pct < 25;
  const isOver = data.remaining < 0;

  return (
    <Card glow={cat.glow} className={`animate-scale-in ${delay}`}>
      <SectionHeader
        icon={cat.icon}
        gradient={cat.gradient}
        title={cat.label}
        subtitle={`%${cat.percentage} pay`}
        right={
          <span
            className={`shrink-0 text-[11px] sm:text-xs font-mono font-semibold ${isOver ? "text-red-400" : cat.text} bg-white/5 rounded-lg px-2 py-1`}
          >
            {Math.round(pct)}%
          </span>
        }
      />

      {/* Kalan tutar */}
      <div className="mb-3.5">
        <p
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isOver || isLow ? "text-red-400" : "text-white/95"}`}
        >
          {formatCurrency(data.remaining)}
        </p>
        <p className="text-[11px] sm:text-xs text-white/25 mt-1">
          Başlangıç{" "}
          <span className="text-white/40 font-medium">
            {formatCurrency(data.base)}
          </span>
        </p>
      </div>

      <div className="mb-4">
        <ProgressBar value={pct} gradient={cat.gradient} />
      </div>

      {/* Harcama / ekleme özeti */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <Stat label="Harcanan" value={data.spent} tone="text-red-400/90" />
        <Stat label="Eklenen" value={data.added} tone="text-emerald-400/90" />
      </div>

      <button
        onClick={() => onDetailClick(categoryKey)}
        className={`w-full py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r ${cat.gradientBg} ${cat.text} text-base sm:text-lg font-bold btn-press border ${cat.border} hover:brightness-125 transition-all tracking-wide`}
      >
        Detay Görüntüle
      </button>
    </Card>
  );
};

const Stat = ({ label, value, tone }) => (
  <div className="rounded-xl bg-white/[0.02] border border-white/5 px-3 py-2">
    <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium">
      {label}
    </p>
    <p className={`text-xs sm:text-sm font-semibold font-mono mt-0.5 ${tone}`}>
      {formatCurrency(value)}
    </p>
  </div>
);

export default CategoryCard;
