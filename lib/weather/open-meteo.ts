export type DestinationWeather = {
  temperatureC: number;
  label: string;
  isDay: boolean;
};

const WMO_LABELS_ES: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla",
  51: "Llovizna",
  53: "Llovizna",
  55: "Llovizna",
  61: "Lluvia",
  63: "Lluvia",
  65: "Lluvia",
  71: "Nieve",
  73: "Nieve",
  75: "Nieve",
  80: "Chubascos",
  81: "Chubascos",
  82: "Chubascos",
  95: "Tormenta",
  96: "Tormenta",
  99: "Tormenta",
};

function labelForCode(code: number): string {
  return WMO_LABELS_ES[code] ?? "Condiciones locales";
}

/**
 * Clima actual vía Open-Meteo (sin API key).
 * Falla en silencio si la red no responde.
 */
export async function getDestinationWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<DestinationWeather | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("timezone", timezone);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        weather_code?: number;
        is_day?: number;
      };
    };

    const temp = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (typeof temp !== "number" || typeof code !== "number") return null;

    return {
      temperatureC: Math.round(temp),
      label: labelForCode(code),
      isDay: data.current?.is_day === 1,
    };
  } catch {
    return null;
  }
}
