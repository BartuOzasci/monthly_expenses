import { clamp } from "../../data/helpers";

/** Tekrar kullanılabilir ilerleme çubuğu. */
const ProgressBar = ({
  value = 0,
  gradient = "from-indigo-400 to-violet-500",
  size = "md",
}) => {
  const height =
    size === "sm" ? "h-1" : size === "lg" ? "h-2.5" : "h-1.5 sm:h-2";

  return (
    <div className={`w-full ${height} bg-white/5 rounded-full overflow-hidden`}>
      <div
        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${clamp(value)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
