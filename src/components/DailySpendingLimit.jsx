import { useMemo } from "react";
import { useBudget } from "../context/BudgetContext";
import { formatCurrency } from "../data/helpers";

const DailySpendingLimit = () => {
  const { categories, transactions, budget } = useBudget();

  const data = useMemo(() => {
    if (!budget || budget <= 0) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    // Bu ayki toplam gün sayısı
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Bugün dahil kalan gün sayısı
    const remainingDays = daysInMonth - today + 1;

    // Eğlence + Genel Harcamalar kalan bakiyesi
    const spendablePool =
      (categories.genelHarcamalar?.remaining ?? 0) +
      (categories.eglence?.remaining ?? 0);

    if (spendablePool <= 0) {
      return {
        dailyLimit: 0,
        todayUsed: 0,
        todayRemaining: 0,
        spendablePool: 0,
        remainingDays,
        pct: 100,
        todayPct: 100,
      };
    }

    // Günlük limit
    const dailyLimit = spendablePool / remainingDays;

    // Bugün yapılan harcamalar (eglence + genelHarcamalar, sadece harcama tipi)
    const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(today).padStart(2, "0")}`;
    const todayUsed = transactions
      .filter((t) => {
        if (t.type !== "harcama") return false;
        if (t.category !== "eglence" && t.category !== "genelHarcamalar")
          return false;
        const txDate = new Date(t.date);
        const txStr = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}-${String(txDate.getDate()).padStart(2, "0")}`;
        return txStr === todayStr;
      })
      .reduce((s, t) => s + t.amount, 0);

    const todayRemaining = Math.max(0, dailyLimit - todayUsed);

    // Havuz tüketim yüzdesi (bakiyeye göre)
    const poolOriginal =
      (categories.genelHarcamalar?.base ?? 0) + (categories.eglence?.base ?? 0);
    const poolPct =
      poolOriginal > 0
        ? Math.max(0, Math.min(100, (spendablePool / poolOriginal) * 100))
        : 0;

    // Bugünkü limit tüketim yüzdesi
    const todayPct =
      dailyLimit > 0
        ? Math.max(0, Math.min(100, (todayRemaining / dailyLimit) * 100))
        : 0;

    return {
      dailyLimit,
      todayUsed,
      todayRemaining,
      spendablePool,
      remainingDays,
      poolPct,
      todayPct,
    };
  }, [categories, transactions, budget]);

  if (!data) return null;

  const isLow = data.todayPct < 25;
  const isMid = data.todayPct < 60;

  const barColor = isLow
    ? "from-red-500 to-rose-600"
    : isMid
      ? "from-amber-400 to-orange-500"
      : "from-cyan-400 to-blue-500";

  const glowColor = isLow
    ? "shadow-red-500/15"
    : isMid
      ? "shadow-amber-500/15"
      : "shadow-cyan-500/15";

  const textAccent = isLow
    ? "text-red-400"
    : isMid
      ? "text-amber-400"
      : "text-cyan-400";

  const bgAccent = isLow
    ? "bg-red-500/10"
    : isMid
      ? "bg-amber-500/10"
      : "bg-cyan-500/10";

  const borderAccent = isLow
    ? "border-red-500/20"
    : isMid
      ? "border-amber-500/20"
      : "border-cyan-500/20";

  return (
    <div className="max-w-lg mx-auto px-5 mb-8">
      <div
        className={`glass rounded-3xl p-5 shadow-2xl ${glowColor} animate-scale-in delay-4`}
      >
        {/* Başlık satırı */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${barColor} flex items-center justify-center text-base shadow-md`}
            >
              📅
            </div>
            <div>
              <h3 className="font-semibold text-white/90 text-sm tracking-wide">
                Günlük Harcama Limiti
              </h3>
              <p className="text-[11px] text-white/30 mt-0.5">
                {data.remainingDays} gün kaldı · bugünlük
              </p>
            </div>
          </div>

          <div
            className={`${bgAccent} ${borderAccent} border rounded-xl px-2.5 py-1.5 text-right`}
          >
            <p className={`text-[10px] font-medium ${textAccent} opacity-70`}>
              günlük limit
            </p>
            <p className={`text-sm font-bold ${textAccent} font-mono`}>
              {formatCurrency(Math.round(data.dailyLimit))}
            </p>
          </div>
        </div>

        {/* Ana rakam */}
        <div className="mb-4">
          <div className="flex items-end gap-2">
            <p
              className={`text-3xl font-extrabold tracking-tight ${isLow ? "text-red-400" : "text-white/95"}`}
            >
              {formatCurrency(Math.round(data.todayRemaining))}
            </p>
            <p className="text-xs text-white/30 mb-1.5 font-medium">
              bugün kalan
            </p>
          </div>
          {data.todayUsed > 0 && (
            <p className="text-[11px] text-white/30 mt-1">
              Bugün harcanan:{" "}
              <span className="text-white/50 font-medium">
                {formatCurrency(data.todayUsed)}
              </span>
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-wider">
              Günlük kullanım
            </span>
            <span className={`text-[11px] font-bold ${textAccent} font-mono`}>
              {Math.round(100 - data.todayPct)}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            {/* Kullanılan kısım dolacak şekilde ilerleme */}
            <div
              className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${data.todayPct}%` }}
            />
          </div>
        </div>

        {/* Alt bilgi */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/25 uppercase tracking-wider">
              Havuz
            </span>
            <span className="text-[11px] text-white/45 font-semibold font-mono">
              {formatCurrency(Math.round(data.spendablePool))}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/20 rounded-full transition-all duration-700"
                style={{ width: `${data.poolPct}%` }}
              />
            </div>
            <span className="text-[10px] text-white/25 font-mono">
              {Math.round(data.poolPct)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySpendingLimit;
