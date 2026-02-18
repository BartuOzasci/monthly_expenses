import { useState } from "react";
import { BudgetProvider } from "./context/BudgetContext";
import Navbar from "./components/Navbar";
import DateDisplay from "./components/DateDisplay";
import BudgetInput from "./components/BudgetInput";
import CategoryCard from "./components/CategoryCard";
import MandatoryExpenses from "./components/MandatoryExpenses";
import Debts from "./components/Debts";
import ActionButtons from "./components/ActionButtons";
import DailySpendingLimit from "./components/DailySpendingLimit";
import ValueEntryModal from "./components/ValueEntryModal";
import DetailModal from "./components/DetailModal";
import PastMonthsModal from "./components/PastMonthsModal";

const AppContent = () => {
  const [showValueEntry, setShowValueEntry] = useState(false);
  const [showPastMonths, setShowPastMonths] = useState(false);
  const [detailCategory, setDetailCategory] = useState(null);

  return (
    <div className="min-h-dvh pb-6 flex flex-col">
      <Navbar />

      <main className="pt-2 flex-1">
        <DateDisplay />
        <BudgetInput />

        {/* Kategori kartları */}
        <div className="max-w-lg mx-auto px-4 sm:px-5 space-y-10 sm:space-y-14 mb-14 sm:mb-16">
          {["genelHarcamalar", "eglence", "yatirim"].map((key, i) => (
            <CategoryCard
              key={key}
              categoryKey={key}
              onDetailClick={setDetailCategory}
              delay={`delay-${i + 1}`}
            />
          ))}
        </div>

        <MandatoryExpenses />
        <Debts />

        <ActionButtons
          onValueEntry={() => setShowValueEntry(true)}
          onPastMonths={() => setShowPastMonths(true)}
        />

        <DailySpendingLimit />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 sm:py-10 mt-20 sm:mt-24 border-t border-white/5">
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
      <PastMonthsModal
        isOpen={showPastMonths}
        onClose={() => setShowPastMonths(false)}
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
