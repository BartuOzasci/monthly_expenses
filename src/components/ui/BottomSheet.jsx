import { useEffect } from "react";

/**
 * Ortak alt-sayfa (bottom sheet) kabuğu.
 * Tüm modallar bunu kullanır: aynı animasyon, aynı kapatma davranışı,
 * ESC ile kapanma ve arka plan kaydırma kilidi tek yerde.
 */
const BottomSheet = ({ isOpen, onClose, title, subtitle, icon, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in p-0 sm:p-6"
      onClick={handleOverlay}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg glass-strong rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 animate-slide-up max-h-[88vh] sm:max-h-[85vh] overflow-y-auto safe-bottom">
        {/* Mobil tutamaç */}
        <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-5 sm:hidden" />

        {(title || icon) && (
          <div className="flex items-center justify-center gap-2.5 mb-5 sm:mb-6">
            {icon && (
              <span className="text-lg sm:text-xl" aria-hidden="true">
                {icon}
              </span>
            )}
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-bold text-white/90 tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-white/35 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
