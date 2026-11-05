"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import {
  changePasswordAction,
  removeAvatarAction,
  updateAvatarAction,
  updateProfileAction,
  type ProfileActionState,
} from "@/app/actions/profile";
import { AvatarCropModal } from "@/components/nemi/avatar-crop-modal";
import { IconCamera, IconChevron, IconLock, IconLogout, IconUser } from "@/components/nemi/me-icons";
import { PasswordInput } from "@/components/ui/password-input";
import { INPUT_LIMITS } from "@/lib/validators/limits";

const initialState: ProfileActionState = {};

type Feedback = {
  type: "success" | "error";
  message: string;
};

type Props = {
  name: string;
  email: string;
  image: string | null;
  initial: string;
  hasPassword: boolean;
};

export function EditProfileForm({
  name,
  email,
  image,
  initial,
  hasPassword,
}: Props) {
  const [showName, setShowName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(image);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoMenuRef = useRef<HTMLDivElement>(null);

  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePasswordAction,
    initialState,
  );
  const [avatarState, avatarAction, avatarPending] = useActionState(
    updateAvatarAction,
    initialState,
  );
  const [removeAvatarState, removeAvatarActionFn, removeAvatarPending] =
    useActionState(removeAvatarAction, initialState);

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (avatarState.success) {
      setFeedback({ type: "success", message: "Foto actualizada." });
    } else if (avatarState.error) {
      setFeedback({ type: "error", message: avatarState.error });
    }
  }, [avatarState]);

  useEffect(() => {
    if (removeAvatarState.success) {
      setFeedback({ type: "success", message: "Foto eliminada." });
    } else if (removeAvatarState.error) {
      setFeedback({ type: "error", message: removeAvatarState.error });
    }
  }, [removeAvatarState]);

  useEffect(() => {
    if (profileState.success) {
      setShowName(false);
      setFeedback({ type: "success", message: "Nombre actualizado." });
    } else if (profileState.error) {
      setFeedback({ type: "error", message: profileState.error });
    } else if (profileState.fieldErrors?.name?.[0]) {
      setFeedback({
        type: "error",
        message: profileState.fieldErrors.name[0],
      });
    }
  }, [profileState]);

  useEffect(() => {
    if (passwordState.success) {
      setFeedback({ type: "success", message: "Contraseña actualizada." });
    } else if (passwordState.error) {
      setFeedback({ type: "error", message: passwordState.error });
    } else if (passwordState.fieldErrors?.newPassword?.[0]) {
      setFeedback({
        type: "error",
        message: passwordState.fieldErrors.newPassword[0],
      });
    } else if (passwordState.fieldErrors?.confirmPassword?.[0]) {
      setFeedback({
        type: "error",
        message: passwordState.fieldErrors.confirmPassword[0],
      });
    }
  }, [passwordState]);

  useEffect(() => {
    if (avatarState.imageUrl !== undefined && avatarState.success) {
      setAvatarUrl(avatarState.imageUrl);
      setCropSource(null);
    }
  }, [avatarState]);

  useEffect(() => {
    if (removeAvatarState.success) {
      setAvatarUrl(null);
      setCropSource(null);
    }
  }, [removeAvatarState]);

  useEffect(() => {
    if (passwordState.success) {
      setShowPassword(false);
    }
  }, [passwordState.success]);

  useEffect(() => {
    return () => {
      if (cropSource) URL.revokeObjectURL(cropSource);
    };
  }, [cropSource]);

  useEffect(() => {
    if (!photoMenuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!photoMenuRef.current?.contains(event.target as Node)) {
        setPhotoMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPhotoMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [photoMenuOpen]);

  function openPhotoMenu() {
    setPhotoMenuOpen((current) => !current);
  }

  function onFileSelected(file: File | undefined) {
    if (!file) return;
    setPhotoMenuOpen(false);
    setCropSource((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function closeCropModal() {
    setCropSource((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  }

  function submitCroppedAvatar(blob: Blob) {
    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("avatar", file);
    avatarAction(formData);
  }

  return (
    <>
      <div className="nemi-me-profile-panel">
        <div className="nemi-me-avatar-block">
          <div className="nemi-me-avatar-menu-root" ref={photoMenuRef}>
            <button
              type="button"
              className="nemi-me-avatar-trigger"
              aria-label="Editar foto de perfil"
              aria-expanded={photoMenuOpen}
              aria-haspopup="menu"
              onClick={openPhotoMenu}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="nemi-me-avatar" />
              ) : (
                <span className="nemi-me-avatar-fallback" aria-hidden>
                  {initial}
                </span>
              )}
              <span className="nemi-me-avatar-camera" aria-hidden>
                <IconCamera />
              </span>
            </button>

            {photoMenuOpen ? (
              <div className="nemi-me-avatar-menu-panel" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="nemi-me-avatar-menu-item"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarUrl ? "Cambiar foto" : "Subir foto"}
                </button>
                {avatarUrl ? (
                  <button
                    type="button"
                    role="menuitem"
                    className="nemi-me-avatar-menu-item is-danger"
                    disabled={removeAvatarPending}
                    onClick={() => {
                      setPhotoMenuOpen(false);
                      const formData = new FormData();
                      removeAvatarActionFn(formData);
                    }}
                  >
                    {removeAvatarPending ? "Quitando…" : "Quitar foto"}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="nemi-me-avatar-actions">
            <p className="nemi-me-profile-name font-display">{name || "Viajero"}</p>
            <p className="nemi-me-profile-email">{email}</p>
            <button
              type="button"
              className="nemi-me-action"
              onClick={openPhotoMenu}
            >
              Editar foto
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => onFileSelected(event.target.files?.[0])}
        />

        <div className="nemi-me-profile-section">
          <p className="nemi-me-section-eyebrow">Datos</p>

          {showName ? (
            <form action={profileAction} className="nemi-me-profile-form">
              <label className="nemi-me-field">
                <span>Nombre</span>
                <input
                  name="name"
                  defaultValue={name}
                  required
                  minLength={2}
                  maxLength={INPUT_LIMITS.nameMax}
                  className="nemi-input"
                />
              </label>
              <div className="nemi-me-review-actions">
                <button
                  type="submit"
                  disabled={profilePending}
                  className="nemi-btn nemi-btn-primary"
                >
                  {profilePending ? "Guardando…" : "Guardar nombre"}
                </button>
                <button
                  type="button"
                  className="nemi-me-action"
                  onClick={() => setShowName(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="nemi-me-menu">
              <button
                type="button"
                className="nemi-me-menu-item"
                onClick={() => setShowName(true)}
              >
                <IconUser />
                Cambiar nombre
                <IconChevron />
              </button>
            </div>
          )}

          {hasPassword ? (
            showPassword ? (
              <form action={passwordAction} className="nemi-me-profile-form">
                <label className="nemi-me-field">
                  <span>Contraseña actual</span>
                  <PasswordInput
                    name="currentPassword"
                    autoComplete="current-password"
                    required
                    maxLength={INPUT_LIMITS.passwordMax}
                  />
                </label>
                <label className="nemi-me-field">
                  <span>Nueva contraseña</span>
                  <PasswordInput
                    name="newPassword"
                    autoComplete="new-password"
                    required
                    minLength={INPUT_LIMITS.passwordMin}
                    maxLength={INPUT_LIMITS.passwordMax}
                  />
                </label>
                <label className="nemi-me-field">
                  <span>Confirmar contraseña</span>
                  <PasswordInput
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    minLength={INPUT_LIMITS.passwordMin}
                    maxLength={INPUT_LIMITS.passwordMax}
                  />
                </label>
                <div className="nemi-me-review-actions">
                  <button
                    type="submit"
                    disabled={passwordPending}
                    className="nemi-btn nemi-btn-primary"
                  >
                    {passwordPending ? "Guardando…" : "Guardar contraseña"}
                  </button>
                  <button
                    type="button"
                    className="nemi-me-action"
                    onClick={() => setShowPassword(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="nemi-me-menu">
                <button
                  type="button"
                  className="nemi-me-menu-item"
                  onClick={() => setShowPassword(true)}
                >
                  <IconLock />
                  Cambiar contraseña
                  <IconChevron />
                </button>
              </div>
            )
          ) : null}
        </div>

        <div className="nemi-me-profile-section nemi-me-profile-section--danger">
          <p className="nemi-me-section-eyebrow">Sesión</p>
          <div className="nemi-me-menu">
            <form action={logoutAction}>
              <button type="submit" className="nemi-me-menu-item is-danger">
                <IconLogout />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>

        {feedback ? (
          <div
            className={`nemi-me-status-footer ${feedback.type === "error" ? "is-error" : "is-success"}`}
            role="status"
            aria-live="polite"
          >
            {feedback.message}
          </div>
        ) : null}
      </div>

      {cropSource ? (
        <AvatarCropModal
          imageSrc={cropSource}
          onCancel={closeCropModal}
          onConfirm={submitCroppedAvatar}
          pending={avatarPending}
        />
      ) : null}
    </>
  );
}
