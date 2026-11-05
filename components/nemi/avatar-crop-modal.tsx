"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImageBlob } from "@/lib/profile/crop-image";

type Props = {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
  pending?: boolean;
};

export function AvatarCropModal({
  imageSrc,
  onCancel,
  onConfirm,
  pending = false,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedArea || pending || saving) return;

    setSaving(true);
    setError(null);

    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedArea);
      onConfirm(blob);
    } catch {
      setError("No se pudo procesar la imagen. Intenta otra.");
    } finally {
      setSaving(false);
    }
  }

  const busy = pending || saving;

  return (
    <div className="nemi-avatar-crop-backdrop" role="presentation">
      <div
        className="nemi-avatar-crop-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-crop-title"
      >
        <div className="nemi-avatar-crop-head">
          <h2 id="avatar-crop-title" className="nemi-avatar-crop-title">
            Encuadrar foto
          </h2>
          <p className="nemi-avatar-crop-lead">
            Arrastra y usa el zoom para acomodar tu foto de perfil.
          </p>
        </div>

        <div className="nemi-avatar-crop-stage">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <label className="nemi-avatar-crop-zoom">
          <span>Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            disabled={busy}
          />
        </label>

        {error ? (
          <p className="nemi-avatar-crop-error">{error}</p>
        ) : null}

        <div className="nemi-avatar-crop-actions">
          <button
            type="button"
            className="nemi-me-action"
            onClick={onCancel}
            disabled={busy}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="nemi-btn nemi-btn-primary !px-4 !py-2 text-sm"
            onClick={handleConfirm}
            disabled={busy || !croppedArea}
          >
            {busy ? "Guardando…" : "Guardar foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
