import {
  CulturalNormKind,
  CulturalSignal,
  ImportanceLevel,
  VerificationStatus,
  type CulturalGuide,
} from "@prisma/client";
import {
  createCulturalGuideAction,
  deleteCulturalGuideAction,
  updateCulturalGuideAction,
} from "@/app/actions/admin-cultural";
import {
  CULTURAL_SIGNAL_LABELS,
  CULTURAL_NORM_LABELS,
  IMPORTANCE_LABELS,
  VERIFICATION_LABELS,
} from "@/lib/cultural/labels";

type Props = {
  destinationId: string;
  destinationSlug: string;
  guide?: CulturalGuide;
};

export function CulturalGuideForm({
  destinationId,
  destinationSlug,
  guide,
}: Props) {
  const action = guide ? updateCulturalGuideAction : createCulturalGuideAction;

  return (
    <form action={action} className="nemi-admin-form">
      <input type="hidden" name="destinationId" value={destinationId} />
      <input type="hidden" name="destinationSlug" value={destinationSlug} />
      {guide ? <input type="hidden" name="id" value={guide.id} /> : null}

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={guide?.title ?? ""}
          className="nemi-input"
        />
      </div>

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="summary">
          Resumen
        </label>
        <textarea
          id="summary"
          name="summary"
          defaultValue={guide?.summary ?? ""}
          className="nemi-input"
        />
      </div>

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          defaultValue={guide?.description ?? ""}
          className="nemi-input"
        />
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="signal">
            Señal
          </label>
          <select
            id="signal"
            name="signal"
            defaultValue={guide?.signal ?? CulturalSignal.CONSIDER}
            className="nemi-input"
          >
            {Object.values(CulturalSignal).map((value) => (
              <option key={value} value={value}>
                {CULTURAL_SIGNAL_LABELS[value].label}
              </option>
            ))}
          </select>
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="normKind">
            Tipo de norma
          </label>
          <select
            id="normKind"
            name="normKind"
            defaultValue={guide?.normKind ?? CulturalNormKind.CUSTOM}
            className="nemi-input"
          >
            {Object.values(CulturalNormKind).map((value) => (
              <option key={value} value={value}>
                {CULTURAL_NORM_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="importance">
            Importancia
          </label>
          <select
            id="importance"
            name="importance"
            defaultValue={guide?.importance ?? ImportanceLevel.MEDIUM}
            className="nemi-input"
          >
            {Object.values(ImportanceLevel).map((value) => (
              <option key={value} value={value}>
                {IMPORTANCE_LABELS[value]}
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
              guide?.verificationStatus ?? VerificationStatus.PENDING
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

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="context">
          Contexto
        </label>
        <textarea
          id="context"
          name="context"
          defaultValue={guide?.context ?? ""}
          className="nemi-input"
        />
      </div>

      <div className="nemi-admin-form-row nemi-admin-form-row--2">
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="whatToDo">
            Qué hacer
          </label>
          <textarea
            id="whatToDo"
            name="whatToDo"
            defaultValue={guide?.whatToDo ?? ""}
            className="nemi-input"
          />
        </div>
        <div className="nemi-admin-field">
          <label className="nemi-admin-label" htmlFor="whatToAvoid">
            Qué evitar
          </label>
          <textarea
            id="whatToAvoid"
            name="whatToAvoid"
            defaultValue={guide?.whatToAvoid ?? ""}
            className="nemi-input"
          />
        </div>
      </div>

      <div className="nemi-admin-field">
        <label className="nemi-admin-label" htmlFor="source">
          Fuente
        </label>
        <input
          id="source"
          name="source"
          defaultValue={guide?.source ?? ""}
          className="nemi-input"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={guide?.isPublished ?? false}
        />
        Publicada
      </label>

      <div className="nemi-admin-actions">
        <button type="submit" className="nemi-btn nemi-btn-primary">
          {guide ? "Guardar" : "Crear guía"}
        </button>
        {guide ? (
          <button
            formAction={deleteCulturalGuideAction}
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
