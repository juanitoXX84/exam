"use client";

import { useActionState, useState, type FocusEvent } from "react";
import Link from "next/link";
import {
  loginAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { NemiLogo } from "@/components/brand/nemi-logo";
import { PasswordInput } from "@/components/ui/password-input";
import {
  LoginBoardingPass,
  type LoginMood,
} from "@/components/auth/login-boarding-pass";

const initialState: AuthActionState = {};

export function LoginPanel() {
  const [mood, setMood] = useState<LoginMood>("idle");
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  function handleFocus(event: FocusEvent<HTMLFormElement>) {
    const el = event.target;
    if (!(el instanceof HTMLElement)) return;
    if (el.id === "email") setMood("explore");
    if (el.id === "password") setMood("private");
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setMood("idle");
  }

  return (
    <div className="nemi-login-board mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      <div className="order-2 flex flex-col items-center lg:order-1">
        <LoginBoardingPass mood={mood} />
        <p className="nemi-board-caption mt-5 text-center text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase sm:text-xs">
          {mood === "explore"
            ? "El mundo te espera"
            : mood === "private"
              ? "Tu viaje, en privado"
              : "Orientación para cualquier destino"}
        </p>
      </div>

      <div className="nemi-glass order-1 w-full rounded-[1.25rem] p-6 sm:p-8 lg:order-2">
        <div className="mb-6">
          <NemiLogo href="/" size={36} showText animated={false} />
        </div>
        <p className="text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
          Acceso
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight">
          Iniciar sesión
        </h1>
        <p className="mt-2 mb-8 text-sm text-[var(--muted)]">
          Accede a tu cuenta de NEMI.
        </p>

        <form
          action={formAction}
          className="flex w-full flex-col gap-4"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
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
              <p className="text-sm text-[var(--danger)]">
                {state.fieldErrors.email[0]}
              </p>
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
      </div>
    </div>
  );
}
