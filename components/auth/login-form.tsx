"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  loginAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
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
          autoComplete="current-password"
          required
        />
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
        {pending ? "Ingresando…" : "Iniciar sesión"}
      </button>

      <p className="text-sm text-[var(--muted)]">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-[var(--accent)] hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
