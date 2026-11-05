import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationHero } from "@/components/destination/destination-hero";
import { DestinationOverview } from "@/components/destination/destination-overview";
import { DestinationSectionNav } from "@/components/destination/destination-section-nav";
import { RecordDestinationVisit } from "@/components/destination/record-destination-visit";
import { getDestinationWeather } from "@/lib/weather/open-meteo";
import { getCulturalHubPreview } from "@/services/cultural.service";
import { getPublishedDestinationBySlug } from "@/services/destination.service";
import {
  getRestaurantHubPreview,
  getLodgingHubPreview,
  getAttractionHubPreview,
} from "@/services/establishment.service";
import { getMapHubPreview } from "@/services/map.service";
import { getServicesHubPreview } from "@/services/services.service";
import { getEmergenciesHubPreview } from "@/services/emergency.service";

/** Fallback coords / TZ for SLRC when the destination row has none. */
const SLRC_COORDS = { latitude: 32.4762, longitude: -114.7638 };
const DEFAULT_TZ = "America/Hermosillo";

export const revalidate = 300;

type Props = {
  params: Promise<{ destinationSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    return { title: "Destino no encontrado" };
  }

  return { title: destination.name };
}

export default async function DestinationPage({ params }: Props) {
  const { destinationSlug } = await params;
  const destination = await getPublishedDestinationBySlug(destinationSlug);

  if (!destination) {
    notFound();
  }

  const timezone = destination.timezone?.trim() || DEFAULT_TZ;
  const latitude = destination.latitude ?? SLRC_COORDS.latitude;
  const longitude = destination.longitude ?? SLRC_COORDS.longitude;

  const [
    cultural,
    restaurants,
    lodging,
    services,
    attractions,
    emergencies,
    map,
    weather,
  ] = await Promise.all([
    getCulturalHubPreview(destination.id),
    getRestaurantHubPreview(destination.id),
    getLodgingHubPreview(destination.id),
    getServicesHubPreview(destination.id),
    getAttractionHubPreview(destination.id),
    getEmergenciesHubPreview(destination.id),
    getMapHubPreview(destination.id, destination.slug),
    getDestinationWeather(latitude, longitude, timezone),
  ]);

  return (
    <div className="nemi-dest-page pb-16">
      <RecordDestinationVisit destinationId={destination.id} />
      <DestinationHero
        name={destination.name}
        region={destination.region}
        country={destination.country}
        description={destination.description}
        coverImage={
          destination.coverImage ??
          (destination.slug === "san-luis-rio-colorado"
            ? "/destinations/slrc/cover.jpg"
            : null)
        }
        timezone={timezone}
        weather={weather}
        destinationSlug={destination.slug}
      />

      <DestinationSectionNav />

      <DestinationOverview
        destinationSlug={destination.slug}
        destinationName={destination.name}
        cultural={cultural}
        restaurants={restaurants}
        lodging={lodging}
        services={services}
        attractions={attractions}
        emergencies={emergencies}
        map={map}
      />
    </div>
  );
}
