import { useBudget } from "../context/BudgetContext";
import { formatCurrencyShort, clamp } from "../data/helpers";
import Card from "./ui/Card";
import ProgressBar from "./ui/ProgressBar";

/**
 * Günlük harcama limiti (devreden bakiyeli).
 * Hesap mantığı src/data/budgetMath.js → computeDailyLimit içinde.
 */
const DailySpendingLimit = () => {
  const { dailyLimit: data, budget } = useBudget();

  if (!data || budget <= 0 || data.pool <= 0) return null;

  const usedPct = clamp(100 - data.todayPct);
  const isLow = data.todayPct < 25;
  const isMid = data.todayPct < 60;

  const tone = isLow
    ? {
        bar: "from-red-500 to-rose-600",
        text: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        glow: "glow-rose",
      }
    : isMid
      ? {
          bar: "from-amber-400 to-orange-500",
          text: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          glow: "glow-orange",
        }
      : {
          bar: "from-cyan-400 to-blue-500",
          text: "text-cyan-400",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
          glow: "glow-cyan",
        };

  return (
    <section className="mb-5 sm:mb-6">
      <Card glow={tone.glow} className="animate-scale-in delay-1">
        {/* Başlık */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-gradient-to-br ${tone.bar} flex items-center justify-center text-lg shadow-lg`}
              aria-hidden="true"
            >
              📅
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white/90 text-sm sm:text-base">
                Günlük Harcama Limiti
              </h3>
              <p className="text-[11px] sm:text-xs text-white/30 mt-0.5">
                {data.remainingDays} gün kaldı · {data.daysInMonth} günlük ay
              </p>
            </div>
          </div>

          <div
            className={`shrink-0 ${tone.bg} ${tone.border} border rounded-xl px-3 py-2 text-right`}
          >
            <p className={`text-[10px] font-medium ${tone.text} opacity-70`}>
              bugünün hakkı
            </p>
            <p className={`text-sm font-bold ${tone.text} font-mono`}>
              {formatCurrencyShort(data.todayLimit)}
            </p>
          </div>
        </div>

        {/* Bugün kalan */}
        <div className="mb-4">
          <div className="flex items-end gap-2 flex-wrap">
            <p
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${isLow ? "text-red-400" : "text-white/95"}`}
            >
              {formatCurrencyShort(data.todayRemaining)}
            </p>
            <p className="text-xs text-white/30 mb-1.5 font-medium">
              bugün kalan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {data.carriedOver > 0.5 && (
              <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                ↗ {formatCurrencyShort(data.carriedOver)} devretti
              </Badge>
            )}
            {data.isReduced && (
              <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-400">
                ⚠ Limit {formatCurrencyShort(data.baseDaily)} → düşürüldü
              </Badge>
            )}
            {data.todayUsed > 0 && (
              <Badge className="bg-white/5 border-white/10 text-white/45">
                Bugün harcanan {formatCurrencyShort(data.todayUsed)}
              </Badge>
            )}
          </div>
        </div>

        {/* Günlük kullanım */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-wider">
              Günlük kullanım
            </span>
            <span className={`text-[11px] font-bold ${tone.text} font-mono`}>
              {Math.round(usedPct)}%
            </span>
          </div>
          <ProgressBar value={data.todayPct} gradient={tone.bar} />
        </div>

        {/* Alt bilgi */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/5">
          <Mini label="Havuz" value={formatCurrencyShort(data.pool)} />
          <Mini
            label="Kalan"
            value={formatCurrencyShort(data.remainingPool)}
            accent="text-white/70"
          />
          <Mini
            label="Ortalama/gün"
            value={formatCurrencyShort(data.baseDaily)}
          />
        </div>

        <div className="mt-3">
          <ProgressBar
            value={data.poolPct}
            gradient="from-white/25 to-white/15"
            size="sm"
          />
        </div>
      </Card>
    </section>
  );
};

const Badge = ({ className = "", children }) => (
  <span
    className={`inline-flex items-center rounded-lg border px-2 py-1 text-[10px] sm:text-[11px] font-medium ${className}`}
  >
    {children}
  </span>
);

const Mini = ({ label, value, accent = "text-white/45" }) => (
  <div className="min-w-0">
    <p className="text-[10px] text-white/25 uppercase tracking-wider truncate">
      {label}
    </p>
    <p
      className={`text-[11px] sm:text-xs font-semibold font-mono mt-0.5 ${accent}`}
    >
      {value}
    </p>
  </div>
);

export default DailySpendingLimit;
