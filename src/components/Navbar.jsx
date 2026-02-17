const Navbar = () => (
  <nav className="sticky top-0 z-50 glass-strong">
    <div className="max-w-lg mx-auto px-5 py-4 sm:py-5">
      <h1 className="text-center text-lg sm:text-xl font-extrabold tracking-tight">
        <span className="gradient-text">Aylık Bütçe Kontrol</span>
      </h1>
    </div>
    {/* alt çizgi glow */}
    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
  </nav>
);

export default Navbar;
