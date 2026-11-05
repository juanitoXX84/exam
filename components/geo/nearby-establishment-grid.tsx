import type { EstablishmentListItem } from "@/lib/establishments/listing-types";
import { EstablishmentCard } from "@/components/establishments/establishment-card";

type Props = {
  establishments: EstablishmentListItem[];
  hrefPrefix: string;
};

export function NearbyEstablishmentGrid({
  establishments,
  hrefPrefix,
}: Props) {
  return (
    <div className="nemi-listing-grid">
      {establishments.map((establishment) => (
        <EstablishmentCard
          key={establishment.id}
          establishment={establishment}
          href={`${hrefPrefix}${establishment.slug}`}
        />
      ))}
    </div>
  );
}
