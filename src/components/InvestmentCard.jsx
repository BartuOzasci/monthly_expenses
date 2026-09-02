import { CATEGORIES, INVESTMENT_KEY } from "../data/constants";
import { formatCurrencyShort } from "../data/helpers";
import { useBudget } from "../context/BudgetContext";

/**
 * Yatırım bilgi kartı — SALT GÖRSEL.
 * Veri girişi, işlem geçmişi ve detay ekranı yoktur; sadece bu ay
 * yatırım için ayrılması gereken yüzde ve tutarı gösterir.
 */
const InvestmentCard = () => {
  const { categories, budget } = useBudget();
  const cat = CATEGORIES[INVESTMENT_KEY];
  const data = categories[INVESTMENT_KEY];

  if (!cat || !data || budget <= 0) return null;

  return (
    <section className="mb-5 sm:mb-6">
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-emerald-400/40 via-teal-400/15 to-transparent animate-scale-in delay-3">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#08120f]/85 backdrop-blur-xl px-5 py-6 sm:px-7 sm:py-7">
          {/* Arka plan efektleri */}
          <div
            className="pointer-events-none absolute -top-16 -right-10 w-52 h-52 rounded-full bg-emerald-500/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(135deg,#fff_0_1px,transparent_1px_14px)]"
            aria-hidden="true"
          />

          <div className="relative">
            {/* Üst satır */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-lg animate-float" aria-hidden="true">
                  {cat.icon}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-emerald-100/90 tracking-wide">
                  {cat.label}
                </h3>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-300/70">
                🔒 Bilgi
              </span>
            </div>

            {/* Yüzde + tutar */}
            <div className="flex items-baseline gap-3 sm:gap-4">
              <span className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-br from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                %{cat.percentage}
              </span>
              <span className="h-8 w-px bg-emerald-400/20" aria-hidden="true" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white/95 tracking-tight tabular-nums">
                {formatCurrencyShort(data.base)}
              </span>
            </div>

            {/* Açıklama */}
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-emerald-100/45">
              Bu ay yatırım için ayırman gereken miktar.
            </p>
            <p className="mt-1.5 text-[10px] sm:text-[11px] text-emerald-100/25 tracking-wide">
              Bu kart yalnızca bilgi amaçlıdır — harcama veya para girişi
              yapılamaz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentCard;
