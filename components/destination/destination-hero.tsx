import Link from "next/link";
import { DestinationLocalClock } from "@/components/destination/destination-local-clock";
import type { DestinationWeather } from "@/lib/weather/open-meteo";

type Props = {
  name: string;
  region: string | null;
  country: string | null;
  description: string | null;
  coverImage: string | null;
  timezone: string;
  weather: DestinationWeather | null;
  destinationSlug: string;
};

/**
 * Hero hospitality: foto full-bleed + marca del destino.
 */
export function DestinationHero({
  name,
  region,
  country,
  description,
  coverImage,
  timezone,
  weather,
  destinationSlug,
}: Props) {
  const locationLine = [region, country].filter(Boolean).join(" · ");
  const mapHref = `/destinos/${destinationSlug}/mapa`;

  return (
    <section className="nemi-dest-hero" id="resumen">
      <div className="nemi-dest-hero-media" aria-hidden>
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt=""
            className="nemi-dest-hero-photo"
            draggable={false}
          />
        ) : (
          <div className="nemi-dest-hero-atmosphere" />
        )}
        <div className="nemi-dest-hero-veil" />
      </div>

      <div className="nemi-dest-hero-content">
        <h1 className="nemi-dest-hero-title font-display">{name}</h1>

        {locationLine ? (
          <p className="nemi-dest-hero-location">{locationLine}</p>
        ) : null}

        {description?.trim() ? (
          <p className="nemi-dest-hero-desc">{description.trim()}</p>
        ) : null}

        <div className="nemi-dest-hero-live" aria-label="Hora y clima local">
          <div className="nemi-dest-hero-live-item">
            <span className="nemi-dest-hero-live-label">Hora local</span>
            <span className="nemi-dest-hero-live-value font-display">
              <DestinationLocalClock timezone={timezone} />
            </span>
          </div>
          {weather ? (
            <div className="nemi-dest-hero-live-item">
              <span className="nemi-dest-hero-live-label">Clima</span>
              <span className="nemi-dest-hero-live-value font-display">
                <WeatherIcon isDay={weather.isDay} />
                <span className="nemi-dest-hero-temp">{weather.temperatureC}°</span>
                <span className="nemi-dest-hero-weather-label">{weather.label}</span>
              </span>
            </div>
          ) : null}
        </div>

        <div className="nemi-dest-hero-cta">
          <Link href={mapHref} className="nemi-btn nemi-btn-primary">
            Abrir mapa
          </Link>
          <a href="#explorar-lugares" className="nemi-btn nemi-btn-ghost">
            Explorar lugares
          </a>
        </div>
      </div>
    </section>
  );
}

function WeatherIcon({ isDay }: { isDay: boolean }) {
  if (isDay) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="nemi-dest-hero-weather-icon" aria-hidden>
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 3.5v1.5M12 19v1.5M3.5 12H5M19 12h1.5M5.8 5.8l1.1 1.1M17.1 17.1l1.1 1.1M18.2 5.8l-1.1 1.1M6.9 17.1l-1.1 1.1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="nemi-dest-hero-weather-icon" aria-hidden>
      <path
        d="M16.5 14.5A5.5 5.5 0 1 1 12 6.2 4.5 4.5 0 1 0 16.5 14.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
