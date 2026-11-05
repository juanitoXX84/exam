import { DestinationStatus } from "@prisma/client";
import {
  createDestinationAction,
  updateDestinationAction,
} from "@/app/actions/admin-destination";
import type { Destination } from "@prisma/client";

type Props = {
  destination?: Destination;
};

export function DestinationForm({ destination }: Props) {
  const action = destination ? updateDestinationAction : createDestinationAction;

  return (
    <form action={action} className="nemi-admin-form">
      {destination ? (
        <input type="hidden" name="id" value={destination.id} />
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
            defaultValue={destination?.name ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="slug">
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9-]+"
            defaultValue={destination?.slug ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="country">
            País
          </label>
          <input
            id="country"
            name="country"
            required
            defaultValue={destination?.country ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="countryCode">
            Código país
          </label>
          <input
            id="countryCode"
            name="countryCode"
            required
            maxLength={2}
            defaultValue={destination?.countryCode ?? "MX"}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="region">
            Región / estado
          </label>
          <input
            id="region"
            name="region"
            defaultValue={destination?.region ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="timezone">
            Zona horaria
          </label>
          <input
            id="timezone"
            name="timezone"
            placeholder="America/Hermosillo"
            defaultValue={destination?.timezone ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={destination?.description ?? ""}
          className="nemi-input"
        />
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="coverImage">
            Imagen de portada (ruta)
          </label>
          <input
            id="coverImage"
            name="coverImage"
            defaultValue={destination?.coverImage ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="status">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={destination?.status ?? DestinationStatus.DRAFT}
            className="nemi-input"
          >
            {Object.values(DestinationStatus).map((status) => (
              <option key={status} value={status}>
                {status}
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
            defaultValue={destination?.latitude ?? ""}
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
            defaultValue={destination?.longitude ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-actions">
        <button type="submit" className="nemi-btn nemi-btn-primary">
          {destination ? "Guardar destino" : "Crear destino"}
        </button>
      </div>
    </form>
  );
}
