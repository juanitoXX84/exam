import type { DestinationWeather } from "@/lib/weather/open-meteo";

type Props = {
  destinationName: string;
  region: string | null;
  country: string | null;
  coverImage: string | null;
  weather: DestinationWeather | null;
};

/**
 * Hero editorial de Cultura: foto real del destino + resumen con datos reales.
 */
export function CulturePageHero({
  destinationName,
  region,
  country,
  coverImage,
  weather,
}: Props) {
  const location = [region, country].filter(Boolean).join(", ");

  return (
    <section className="nemi-culture-hero">
      <div className="nemi-culture-hero-media">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt=""
            className="nemi-culture-hero-photo"
            draggable={false}
          />
        ) : (
          <div className="nemi-culture-hero-fallback" aria-hidden />
        )}
        <div className="nemi-culture-hero-shade" />
      </div>

      <div className="nemi-container nemi-culture-hero-content">
        <div className="nemi-culture-hero-copy">
          <p className="nemi-culture-hero-eyebrow">Módulo principal</p>
          <h1 className="nemi-culture-hero-title font-display">
            Cultura y reglas
          </h1>
          <p className="nemi-culture-hero-desc">
            Orientación para entender costumbres, normas y comportamientos
            útiles antes y durante tu visita. Cada guía indica si es ley, norma
            social, costumbre o seguridad.
          </p>

          <div className="nemi-culture-hero-chips">
            {location ? (
              <span className="nemi-culture-chip">{location}</span>
            ) : null}
            <span className="nemi-culture-chip">Frontera noroeste</span>
            <span className="nemi-culture-chip">Ciudad fronteriza</span>
          </div>
        </div>

        <aside className="nemi-culture-summary">
          <p className="nemi-culture-summary-kicker">{destinationName}</p>
          {location ? (
            <p className="nemi-culture-summary-loc">{location}</p>
          ) : null}

          <dl className="nemi-culture-summary-list">
            {region ? (
              <div>
                <dt>Región</dt>
                <dd>{region}</dd>
              </div>
            ) : null}
            {country ? (
              <div>
                <dt>País</dt>
                <dd>{country}</dd>
              </div>
            ) : null}
            <div>
              <dt>Moneda</dt>
              <dd>Peso mexicano (MXN)</dd>
            </div>
            {weather ? (
              <div>
                <dt>Clima ahora</dt>
                <dd>
                  {weather.temperatureC}° · {weather.label}
                </dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </div>
    </section>
  );
}
