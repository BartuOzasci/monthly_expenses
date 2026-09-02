import { getFormattedDate } from "../data/helpers";

const DateDisplay = () => (
  <div className="mb-5 sm:mb-6">
    <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 sm:px-5 sm:py-2.5">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-xs sm:text-sm font-medium text-white/60 tracking-wide">
        {getFormattedDate()}
      </span>
    </div>
  </div>
);

export default DateDisplay;
