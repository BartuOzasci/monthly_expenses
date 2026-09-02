import { useState } from "react";
import { BudgetProvider, useBudget } from "./context/BudgetContext";
import { SPENDING_KEYS } from "./data/constants";

import Navbar from "./components/Navbar";
import DateDisplay from "./components/DateDisplay";
import BudgetInput from "./components/BudgetInput";
import FixedExpenses from "./components/FixedExpenses";
import DailySpendingLimit from "./components/DailySpendingLimit";
import CategoryCard from "./components/CategoryCard";
import InvestmentCard from "./components/InvestmentCard";
import ActionButtons from "./components/ActionButtons";
import ValueEntryModal from "./components/ValueEntryModal";
import DetailModal from "./components/DetailModal";
import YearlySummaryModal from "./components/YearlySummaryModal";

const AppContent = () => {
  const { budget, currentYear } = useBudget();
  const [showValueEntry, setShowValueEntry] = useState(false);
  const [showYearly, setShowYearly] = useState(false);
  const [detailCategory, setDetailCategory] = useState(null);

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-lg lg:max-w-5xl mx-auto px-4 sm:px-5 pt-5 sm:pt-6">
        <DateDisplay />

        {/* Mobilde tek sütun, geniş ekranda iki sütun */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-6 lg:items-start">
          {/* Sol sütun — bütçe ve günlük plan */}
          <div className="lg:col-span-1">
            <BudgetInput />
            <FixedExpenses />
            <DailySpendingLimit />
          </div>

          {/* Sağ sütun — kategoriler */}
          <div className="lg:col-span-1">
            {budget > 0 &&
              SPENDING_KEYS.map((key, i) => (
                <section key={key} className="mb-5 sm:mb-6">
                  <CategoryCard
                    categoryKey={key}
                    onDetailClick={setDetailCategory}
                    delay={`delay-${i + 2}`}
                  />
                </section>
              ))}

            <InvestmentCard />

            <ActionButtons
              year={currentYear}
              onValueEntry={() => setShowValueEntry(true)}
              onYearlySummary={() => setShowYearly(true)}
            />
          </div>
        </div>
      </main>

      <footer className="text-center py-8 sm:py-10 mt-10 border-t border-white/5">
        <p className="text-[11px] sm:text-xs text-white/25 font-medium tracking-[0.2em] uppercase">
          Bartu Özaşçı
        </p>
      </footer>

      {/* Modallar */}
      <ValueEntryModal
        isOpen={showValueEntry}
        onClose={() => setShowValueEntry(false)}
      />
      <DetailModal
        isOpen={!!detailCategory}
        onClose={() => setDetailCategory(null)}
        categoryKey={detailCategory}
      />
      <YearlySummaryModal
        isOpen={showYearly}
        onClose={() => setShowYearly(false)}
      />
    </div>
  );
};

const App = () => (
  <BudgetProvider>
    <AppContent />
  </BudgetProvider>
);

export default App;
