/** Kart başlığı: ikon rozeti + başlık + alt açıklama (+ sağ taraf içeriği). */
const SectionHeader = ({ icon, gradient, title, subtitle, right }) => (
  <div className="flex items-start justify-between gap-3 mb-4">
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg shadow-lg`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-white/90 text-sm sm:text-base truncate">
          {title}
        </h3>
        {subtitle && (
          <span className="text-[11px] sm:text-xs text-white/30 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </div>
    {right}
  </div>
);

export default SectionHeader;
