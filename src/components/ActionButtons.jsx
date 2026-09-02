const ActionButtons = ({ onValueEntry, onYearlySummary, year }) => (
  <section className="mb-5 sm:mb-6 safe-bottom">
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <button
        onClick={onValueEntry}
        className="group relative overflow-hidden py-5 sm:py-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white font-semibold text-sm sm:text-base btn-press shadow-xl shadow-violet-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative flex flex-col items-center gap-1.5">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">
            ✏️
          </span>
          <span className="tracking-wide">Değer Gir</span>
        </div>
      </button>

      <button
        onClick={onYearlySummary}
        className="group relative overflow-hidden py-5 sm:py-6 rounded-2xl glass text-white font-semibold text-sm sm:text-base btn-press hover:bg-white/5 transition-colors"
      >
        <div className="relative flex flex-col items-center gap-1.5">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">
            📊
          </span>
          <span className="tracking-wide text-white/70">{year} Özeti</span>
        </div>
      </button>
    </div>
  </section>
);

export default ActionButtons;
