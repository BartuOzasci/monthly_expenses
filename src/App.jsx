import { useState } from "react";
import { BudgetProvider } from "./context/BudgetContext";
import Navbar from "./components/Navbar";
import DateDisplay from "./components/DateDisplay";
import BudgetInput from "./components/BudgetInput";
import CategoryCard from "./components/CategoryCard";
import MandatoryExpenses from "./components/MandatoryExpenses";
import Debts from "./components/Debts";
import ActionButtons from "./components/ActionButtons";
import ValueEntryModal from "./components/ValueEntryModal";
import DetailModal from "./components/DetailModal";
import PastMonthsModal from "./components/PastMonthsModal";

const AppContent = () => {
  const [showValueEntry, setShowValueEntry] = useState(false);
  const [showPastMonths, setShowPastMonths] = useState(false);
  const [detailCategory, setDetailCategory] = useState(null);

  return (
    <div className="min-h-dvh pb-6">
      <Navbar />

      <main className="pt-2">
        <DateDisplay />
        <BudgetInput />

        {/* Kategori kartları */}
        <div className="max-w-lg mx-auto px-5 space-y-4 mb-5">
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
      </main>

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
