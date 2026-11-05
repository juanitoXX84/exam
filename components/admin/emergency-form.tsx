import { EstablishmentType, type EmergencyService } from "@prisma/client";
import {
  createEmergencyAction,
  deleteEmergencyAction,
  updateEmergencyAction,
} from "@/app/actions/admin-emergency";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishments/labels";

type Props = {
  destinationId: string;
  destinationSlug: string;
  emergency?: EmergencyService;
};

export function EmergencyForm({
  destinationId,
  destinationSlug,
  emergency,
}: Props) {
  const action = emergency ? updateEmergencyAction : createEmergencyAction;

  return (
    <form action={action} className="nemi-admin-form">
      <input type="hidden" name="destinationId" value={destinationId} />
      <input type="hidden" name="destinationSlug" value={destinationSlug} />
      {emergency ? <input type="hidden" name="id" value={emergency.id} /> : null}

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={emergency?.name ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="type">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            defaultValue={emergency?.type ?? EstablishmentType.HOSPITAL}
            className="nemi-input"
          >
            {[
              EstablishmentType.HOSPITAL,
              EstablishmentType.CLINIC,
              EstablishmentType.PHARMACY,
              EstablishmentType.OTHER_SERVICE,
            ].map((type) => (
              <option key={type} value={type}>
                {ESTABLISHMENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="phone">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={emergency?.phone ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="address">
            Dirección
          </label>
          <input
            id="address"
            name="address"
            defaultValue={emergency?.address ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="notes">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={emergency?.notes ?? ""}
          className="nemi-input"
        />
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
            defaultValue={emergency?.latitude ?? ""}
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
            defaultValue={emergency?.longitude ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="sourceNote">
          Fuente
        </label>
        <input
          id="sourceNote"
          name="sourceNote"
          defaultValue={emergency?.sourceNote ?? ""}
          className="nemi-input"
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isOfficial"
            defaultChecked={emergency?.isOfficial ?? false}
          />
          Fuente oficial
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={emergency?.isActive ?? true}
          />
          Activo
        </label>
      </div>

      <div className="nemi-admin-actions">
        <button type="submit" className="nemi-btn nemi-btn-primary">
          {emergency ? "Guardar" : "Crear contacto"}
        </button>
        {emergency ? (
          <button
            formAction={deleteEmergencyAction}
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
