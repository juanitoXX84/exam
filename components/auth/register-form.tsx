"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  registerAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { INPUT_LIMITS } from "@/lib/validators/limits";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm text-[var(--muted)]">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={INPUT_LIMITS.nameMax}
          className="nemi-input"
        />
        {state.fieldErrors?.name?.[0] ? (
          <p className="text-sm text-[var(--danger)]">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-[var(--muted)]">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="nemi-input"
        />
        {state.fieldErrors?.email?.[0] ? (
          <p className="text-sm text-[var(--danger)]">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-[var(--muted)]">
          Contraseña
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={INPUT_LIMITS.passwordMin}
          maxLength={INPUT_LIMITS.passwordMax}
        />
        <p className="text-xs text-[var(--muted)]">
          Entre {INPUT_LIMITS.passwordMin} y {INPUT_LIMITS.passwordMax} caracteres,
          con al menos una letra y un número.
        </p>
        {state.fieldErrors?.password?.[0] ? (
          <p className="text-sm text-[var(--danger)]">
            {state.fieldErrors.password[0]}
          </p>
        ) : null}
      </div>

      {state.error ? (
        <p className="rounded-[10px] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="nemi-btn nemi-btn-primary mt-1 w-full"
      >
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <p className="text-sm text-[var(--muted)]">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/iniciar-sesion"
          className="text-[var(--accent)] hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
