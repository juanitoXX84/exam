"use client";

import { EstablishmentType } from "@prisma/client";
import dynamic from "next/dynamic";
import type { MapMarker, MapViewConfig } from "@/lib/maps/types";

const DestinationMapPreviewCanvas = dynamic(
  () =>
    import("@/components/map/destination-map-preview-canvas").then(
      (mod) => mod.DestinationMapPreviewCanvas,
    ),
  {
    ssr: false,
    loading: () => <div className="nemi-place-map-skeleton" aria-hidden />,
  },
);

type Props = {
  name: string;
  latitude: number;
  longitude: number;
};

export function PlaceMiniMap({ name, latitude, longitude }: Props) {
  const markers: MapMarker[] = [
    {
      id: "place",
      title: name,
      latitude,
      longitude,
      type: EstablishmentType.RESTAURANT,
      category: "ATTRACTION",
      categoryLabel: "Lugar",
    },
  ];
  const config: MapViewConfig = {
    center: { latitude, longitude },
    zoom: 15,
  };

  return (
    <div className="nemi-place-mini-map">
      <DestinationMapPreviewCanvas markers={markers} config={config} />
    </div>
  );
}
