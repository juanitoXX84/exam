import {
  EstablishmentType,
  PriceRange,
  VerificationStatus,
  type Category,
  type Establishment,
} from "@prisma/client";
import {
  createEstablishmentAction,
  deleteEstablishmentAction,
  updateEstablishmentAction,
} from "@/app/actions/admin-establishment";
import {
  ESTABLISHMENT_TYPE_LABELS,
  PRICE_RANGE_LABELS,
} from "@/lib/establishments/labels";
import { VERIFICATION_LABELS } from "@/lib/cultural/labels";

type EstablishmentWithCategories = Establishment & {
  categories: Array<{ category: Category }>;
};

type Props = {
  destinationId: string;
  destinationSlug: string;
  sectionKey: string;
  allowedTypes: EstablishmentType[];
  categories: Category[];
  establishment?: EstablishmentWithCategories;
};

export function EstablishmentForm({
  destinationId,
  destinationSlug,
  sectionKey,
  allowedTypes,
  categories,
  establishment,
}: Props) {
  const action = establishment
    ? updateEstablishmentAction
    : createEstablishmentAction;
  const defaultType =
    establishment?.type ?? allowedTypes[0] ?? EstablishmentType.RESTAURANT;
  const selectedCategoryIds = new Set(
    establishment?.categories.map((item) => item.category.id) ?? [],
  );

  return (
    <form action={action} className="nemi-admin-form">
      <input type="hidden" name="destinationId" value={destinationId} />
      <input type="hidden" name="destinationSlug" value={destinationSlug} />
      <input type="hidden" name="sectionKey" value={sectionKey} />
      {establishment ? (
        <input type="hidden" name="id" value={establishment.id} />
      ) : null}

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={establishment?.name ?? ""}
            className="nemi-input"
          />
        </div>
        {allowedTypes.length > 1 ? (
          <div className="nemi-admin-field">
            <label className="nemi-admin-label" htmlFor="type">
              Tipo
            </label>
            <select
              id="type"
              name="type"
              defaultValue={defaultType}
              className="nemi-input"
            >
              {allowedTypes.map((type) => (
                <option key={type} value={type}>
                  {ESTABLISHMENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <input type="hidden" name="type" value={defaultType} />
        )}
      </div>

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={establishment?.description ?? ""}
          className="nemi-input"
        />
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="address">
            Dirección
          </label>
          <input
            id="address"
            name="address"
            defaultValue={establishment?.address ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="phone">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={establishment?.phone ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={establishment?.email ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="website">
            Sitio web
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={establishment?.website ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="priceRange">
            Precio
          </label>
          <select
            id="priceRange"
            name="priceRange"
            defaultValue={establishment?.priceRange ?? ""}
            className="nemi-input"
          >
            <option value="">Sin indicar</option>
            {Object.values(PriceRange).map((value) => (
              <option key={value} value={value}>
                {PRICE_RANGE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="verificationStatus">
            Verificación
          </label>
          <select
            id="verificationStatus"
            name="verificationStatus"
            defaultValue={
              establishment?.verificationStatus ?? VerificationStatus.PENDING
            }
            className="nemi-input"
          >
            {Object.values(VerificationStatus).map((value) => (
              <option key={value} value={value}>
                {VERIFICATION_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="latitude">
            Latitud
          </label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={establishment?.latitude ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="longitude">
            Longitud
          </label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={establishment?.longitude ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="sourceNote">
          Fuente / nota
        </label>
        <input
          id="sourceNote"
          name="sourceNote"
          defaultValue={establishment?.sourceNote ?? ""}
          className="nemi-input"
        />
      </div>

      {categories.length > 0 ? (
        <fieldset className="nemi-admin-field">
          <legend className="nemi-admin-label mb-2">Categorías</legend>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={category.id}
                  defaultChecked={selectedCategoryIds.has(category.id)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={establishment?.isActive ?? true}
          />
          Activo (visible en listados)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="acceptsReservations"
            defaultChecked={establishment?.acceptsReservations ?? false}
          />
          Acepta reservas
        </label>
      </div>

      <div className="nemi-admin-actions">
        <button type="submit" className="nemi-btn nemi-btn-primary">
          {establishment ? "Guardar" : "Crear"}
        </button>
        {establishment ? (
          <button
            formAction={deleteEstablishmentAction}
            type="submit"
            className="nemi-btn nemi-btn-glass nemi-admin-btn-danger"
          >
            Eliminar
          </button>
        ) : null}
      </div>
    </form>
  );
}
