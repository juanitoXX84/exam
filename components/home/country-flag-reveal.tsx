type Props = {
  country?: "mexico";
};

const FLAGS = {
  mexico: {
    src: "/flags/mexico.svg",
    name: "México",
    // Bandera oficial (proporción 4:7). Fuente: Wikimedia Commons.
    // https://commons.wikimedia.org/wiki/File:Flag_of_Mexico.svg
  },
} as const;

/**
 * Revelación del país seleccionado con bandera oficial.
 */
export function CountryFlagReveal({ country = "mexico" }: Props) {
  const flag = FLAGS[country];
  if (!flag) return null;

  return (
    <div className="nemi-flag-reveal">
      <div className="nemi-flag-reveal-glow" aria-hidden />

      <div className="nemi-flag nemi-flag--mx">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={flag.src}
          alt={`Bandera de ${flag.name}`}
          className="nemi-flag-img"
          width={280}
          height={160}
          draggable={false}
        />
        <span className="nemi-flag-sheen" aria-hidden />
      </div>

      <p className="nemi-flag-reveal-name">{flag.name}</p>
    </div>
  );
}
