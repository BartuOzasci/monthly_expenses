import { useYearlySummary } from "../hooks/useYearlySummary";
import { formatCurrencyShort } from "../data/helpers";
import BottomSheet from "./ui/BottomSheet";

/**
 * Yıllık özet — o yılın her ayı için "yatırım hariç" (genel harcamalar +
 * eğlence) sonucu. Artı bakiye yeşil, eksi bakiye kırmızı gösterilir.
 * Liste her yıl başında kendiliğinden sıfırlanır.
 */
const YearlySummaryModal = ({ isOpen, onClose }) => {
  const { year, months, totals } = useYearlySummary();

  const positive = totals.net >= 0;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${year} Yılı Özeti`}
      subtitle="Genel Harcamalar + Eğlence (yatırım hariç)"
      icon="📊"
    >
      {months.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-3xl block mb-3 opacity-30">📅</span>
          <p className="text-white/25 text-sm">
            {year} yılı için henüz veri bulunmuyor
          </p>
        </div>
      ) : (
        <>
          {/* Yıl toplamı */}
          <div
            className={`rounded-2xl p-5 mb-5 border ${
              positive
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/35 font-medium">
              {year} yıl toplamı
            </p>
            <p
              className={`text-3xl sm:text-4xl font-black tracking-tight mt-1.5 tabular-nums ${
                positive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {positive ? "+" : "−"}
              {formatCurrencyShort(Math.abs(totals.net))}
            </p>
            <p className="text-xs text-white/40 mt-2">
              {positive
                ? "Bu yıl toplamda paranızdan artırdınız."
                : "Bu yıl toplamda fazla harcama yaptınız."}
            </p>
          </div>

          {/* Ay ay sonuçlar */}
          <div className="space-y-2.5">
            {months
              .slice()
              .reverse()
              .map((m, idx) => (
                <MonthRow key={`${m.year}-${m.month}`} data={m} index={idx} />
              ))}
          </div>
        </>
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

const MonthRow = ({ data, index }) => {
  const positive = data.net >= 0;
  const pct = data.pool > 0 ? Math.min(100, (data.spent / data.pool) * 100) : 0;

  return (
    <div
      className={`rounded-2xl p-4 border animate-scale-in ${
        positive
          ? "bg-emerald-500/[0.06] border-emerald-500/15"
          : "bg-red-500/[0.06] border-red-500/15"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-white/90">
            {data.monthName} {data.year}
          </h3>
          {data.inProgress && (
            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/40 font-medium">
              devam ediyor
            </span>
          )}
        </div>
        <span
          className={`shrink-0 text-base sm:text-lg font-extrabold tabular-nums ${
            positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {positive ? "+" : "−"}
          {formatCurrencyShort(Math.abs(data.net))}
        </span>
      </div>

      <p className="text-[11px] sm:text-xs text-white/45 leading-relaxed">
        {positive ? (
          <>
            <span className="text-emerald-400/90 font-semibold">
              {formatCurrencyShort(data.net)}
            </span>{" "}
            paranızdan artırdınız.
          </>
        ) : (
          <>
            <span className="text-red-400/90 font-semibold">
              {formatCurrencyShort(Math.abs(data.net))}
            </span>{" "}
            fazla harcama yaptınız.
          </>
        )}
      </p>

      <div className="mt-3 flex items-center gap-2.5">
        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              positive
                ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] text-white/30 font-mono shrink-0">
          {formatCurrencyShort(data.spent)} / {formatCurrencyShort(data.pool)}
        </span>
      </div>
    </div>
  );
};

export default YearlySummaryModal;
