/**
 * ZORUNLU (SABİT) GİDERLER
 * ------------------------------------------------------------------
 * Her ay bütçeden otomatik olarak düşülen sabit harcamalar.
 * Değiştirmek için SADECE bu listeyi düzenlemen yeterli:
 *   - Yeni gider eklemek için diziye yeni bir satır ekle.
 *   - Tutarı değiştirmek için `amount` alanını güncelle.
 *   - Kaldırmak için satırı sil.
 * Uygulama içinden düzenlenemez; burası tek doğruluk kaynağıdır.
 */
export const FIXED_EXPENSES = [
  { id: "claude", label: "Claude", amount: 1100, icon: "🤖" },
  { id: "berber", label: "Berber", amount: 400, icon: "💈" },
  { id: "telefon", label: "Telefon", amount: 375, icon: "📱" },
  { id: "netflix", label: "Netflix", amount: 190, icon: "🎬" },
  { id: "youtube-premium", label: "YouTube Premium", amount: 230, icon: "▶️" },
];

/** Sabit giderlerin aylık toplamı. */
export const FIXED_EXPENSES_TOTAL = FIXED_EXPENSES.reduce(
  (sum, item) => sum + (Number(item.amount) || 0),
  0,
);
