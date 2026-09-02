import { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { formatCurrency } from "../data/helpers";
import Card from "./ui/Card";
import SectionHeader from "./ui/SectionHeader";

/**
 * Zorunlu (sabit) giderler — salt okunur liste.
 * Veriler src/data/fixedExpenses.js dosyasından gelir; uygulama içinden
 * düzenlenemez, her ay bütçeden otomatik düşülür.
 */
const FixedExpenses = () => {
  const { fixedExpenses, fixedExpensesTotal, budget } = useBudget();
  const [open, setOpen] = useState(true);

  if (budget <= 0) return null;

  return (
    <section className="mb-5 sm:mb-6">
      <Card glow="glow-orange" className="overflow-hidden">
        <SectionHeader
          icon="📋"
          gradient="from-amber-400 to-orange-500"
          title="Zorunlu Giderler"
          subtitle="Bütçeden otomatik düşülür"
          right={
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="shrink-0 glass rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-white/45 hover:text-white/70 transition-colors btn-press"
            >
              {open ? "Gizle ▲" : "Göster ▼"}
            </button>
          }
        />

        {open && (
          <ul className="space-y-1.5 mb-4">
            {fixedExpenses.map((item, i) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.02] border border-white/5 px-3.5 py-2.5 animate-scale-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="text-xs sm:text-sm text-white/60 font-medium truncate">
                    {item.label}
                  </span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white/80 font-mono shrink-0">
                  {formatCurrency(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Toplam */}
        <div className="flex items-center justify-between bg-orange-500/10 rounded-2xl px-4 py-3.5 border border-orange-500/15">
          <div>
            <p className="text-xs sm:text-sm text-white/45 font-medium">
              Aylık toplam
            </p>
            <p className="text-[10px] text-white/25 mt-0.5">
              {fixedExpenses.length} sabit gider
            </p>
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-orange-400 tracking-tight">
            {formatCurrency(fixedExpensesTotal)}
          </span>
        </div>
      </Card>
    </section>
  );
};

export default FixedExpenses;
