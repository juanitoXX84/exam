"use client";

import dynamic from "next/dynamic";
import type { MapMarker, MapViewConfig } from "@/lib/maps/types";

const DestinationMapPreviewCanvas = dynamic(
  () =>
    import("@/components/map/destination-map-preview-canvas").then(
      (mod) => mod.DestinationMapPreviewCanvas,
    ),
  {
    ssr: false,
    loading: () => <div className="nemi-dest-map-skeleton" aria-hidden />,
  },
);

type Props = {
  markers: MapMarker[];
  config: MapViewConfig;
};

export function DestinationMapPreview({ markers, config }: Props) {
  return (
    <div className="nemi-dest-map-preview">
      <DestinationMapPreviewCanvas markers={markers} config={config} />
      <div className="nemi-dest-map-preview-veil" aria-hidden />
    </div>
  );
}
