/** Ortak cam kart kabuğu — tüm bölümler aynı yuvarlaklık/padding ritmini kullanır. */
const Card = ({ glow = "", className = "", children, ...rest }) => (
  <div
    className={`glass rounded-3xl p-5 sm:p-6 ${glow} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
