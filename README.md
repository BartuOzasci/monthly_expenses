# Aylık Bütçe Kontrol

Mobil öncelikli, React + Vite + Tailwind CSS ile geliştirilmiş kişisel bütçe
takip uygulaması (PWA).

## Özellikler

- Aylık bütçeyi **%45 Genel Harcamalar**, **%30 Eğlence**, **%25 Yatırım**
  olarak otomatik bölme
- **Zorunlu (sabit) giderler** — `src/data/fixedExpenses.js` dosyasından gelir,
  uygulama içinde salt okunur listelenir ve her ay bütçeden otomatik düşülür
- **Yatırım bilgi kartı** — sadece yüzde ve tutar gösterir; veri girişi yoktur
- **Günlük harcama limiti** — devreden bakiyeli hesap (aşağıda)
- Harcama / para ekleme girişi, kategori detayında düzenleme ve silme
- **Yıllık özet** — o yılın her ayı için "yatırım hariç" artı/eksi sonucu
- Ay bitiminde otomatik arşivleme, `localStorage` ile kalıcı saklama

## Günlük harcama limiti nasıl hesaplanır?

Havuz = yatırım hariç ayrılan tutar (Genel Harcamalar + Eğlence).

1. `günlük pay = havuz / ayın gün sayısı` (28/29/30/31'e göre)
2. `devreden hak = günlük pay × bugünün günü − bugünden önce harcanan`
   → harcamadığın gün bir sonraki güne eklenir
   (1. gün 1.000 ₺ harcamadıysan 2. gün 2.000 ₺; 2. gün 1.500 ₺ harcadıysan 3. gün 1.000 + 500 = 1.500 ₺)
3. `tempo hakkı = kalan havuz / kalan gün`
   → limiti aştıysan günlük hak buraya düşer
   (10 gün kala 9.000 ₺ kaldıysa günlük 900 ₺)
4. Bugünün hakkı bu ikisinin **büyüğüdür**: normalde devreden mantık işler,
   aşım olduğunda limit düşer, tekrar biriktikçe devreden mantık kaldığı
   yerden devam eder.

Kod: `src/data/budgetMath.js` → `computeDailyLimit`.

## Zorunlu giderleri değiştirme

Tek dosya: [`src/data/fixedExpenses.js`](src/data/fixedExpenses.js)

```js
export const FIXED_EXPENSES = [
  { id: "claude", label: "Claude", amount: 1100, icon: "🤖" },
  { id: "berber", label: "Berber", amount: 400, icon: "💈" },
  // ...
];
```

Satır ekle / çıkar veya `amount` değerini güncelle; toplam ve bütçe dağılımı
otomatik güncellenir.

## Proje Yapısı

```
src/
├── components/
│   ├── ui/                    # Paylaşılan arayüz parçaları
│   │   ├── BottomSheet.jsx    # Ortak modal kabuğu (ESC, scroll kilidi)
│   │   ├── Card.jsx
│   │   ├── ProgressBar.jsx
│   │   └── SectionHeader.jsx
│   ├── Navbar.jsx
│   ├── DateDisplay.jsx
│   ├── BudgetInput.jsx        # Bütçe girişi + dağılım özeti
│   ├── FixedExpenses.jsx      # Zorunlu giderler (salt okunur)
│   ├── DailySpendingLimit.jsx # Devreden bakiyeli günlük limit
│   ├── CategoryCard.jsx       # Genel Harcamalar / Eğlence
│   ├── InvestmentCard.jsx     # Yatırım — sadece bilgi kartı
│   ├── ActionButtons.jsx
│   ├── ValueEntryModal.jsx
│   ├── DetailModal.jsx
│   └── YearlySummaryModal.jsx
├── context/
│   └── BudgetContext.jsx      # Global state + şema göçü (migration)
├── data/
│   ├── constants.js           # Kategoriler, anahtarlar, şema sürümü
│   ├── fixedExpenses.js       # ⚙️ Sabit giderler (düzenlenebilir)
│   ├── budgetMath.js          # Tüm hesaplama mantığı
│   └── helpers.js             # Biçimlendirme / tarih yardımcıları
├── hooks/
│   ├── useLocalStorage.js
│   └── useYearlySummary.js
├── App.jsx
├── main.jsx
└── index.css
```

## Başlangıç

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

## Diğer komutlar

```bash
npm run build     # Üretim derlemesi
npm run preview   # Derlemeyi yerelde önizle
npm run lint      # ESLint
```
