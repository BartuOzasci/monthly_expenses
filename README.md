# Aylık Bütçe Kontrol

Mobil kullanıma yönelik, React + Vite + Tailwind CSS ile geliştirilmiş kişisel bütçe takip uygulaması.

## Özellikler

- Aylık bütçeyi **%40 Genel Harcamalar**, **%25 Eğlence**, **%35 Yatırım** olarak otomatik bölme
- Zorunlu giderler takibi (Genel Harcamalar'dan düşülür)
- Borç takibi (Buse Borç)
- Değer girişi: herhangi bir kategoriye harcama veya para ekleme
- Detay görünümü: her kategorideki işlemleri görüntüleme, düzenleme ve silme
- Geçmiş 3 ay verisi görüntüleme
- Ay bitiminde otomatik kaydetme (borç hariç)
- localStorage ile kalıcı veri saklama

## Teknolojiler

- **React 19** — UI kütüphanesi
- **Vite 8** — Hızlı geliştirme sunucusu ve bundler
- **Tailwind CSS 4** — Utility-first CSS framework
- **JavaScript ES6+** — Modern JavaScript, JSX

## Proje Yapısı

```
src/
├── components/        # UI bileşenleri
│   ├── Navbar.jsx
│   ├── DateDisplay.jsx
│   ├── BudgetInput.jsx
│   ├── CategoryCard.jsx
│   ├── MandatoryExpenses.jsx
│   ├── Debts.jsx
│   ├── ActionButtons.jsx
│   ├── ValueEntryModal.jsx
│   ├── DetailModal.jsx
│   └── PastMonthsModal.jsx
├── context/           # React Context (global state)
│   └── BudgetContext.jsx
├── data/              # Sabitler ve yardımcı fonksiyonlar
│   ├── constants.js
│   └── helpers.js
├── hooks/             # Custom React hooks
│   └── useLocalStorage.js
├── App.jsx
├── main.jsx
└── index.css
public/
└── img/               # Fotoğraflar için klasör
```

## Başlangıç

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

## Build

```bash
npm run build
```
