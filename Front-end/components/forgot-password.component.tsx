"use client"

import React, { useState, FormEvent } from "react";
import { KeyRound } from "lucide-react";

interface ForgotPasswordComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

function ForgotPasswordComponent({ isOpen, onClose, onSubmit }: ForgotPasswordComponentProps) {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es obligatorio.';
    if (!emailRegex.test(email)) return 'El formato del email no es válido.';
    return '';
  };

  const resetForm = () => {
    setEmail('');
    setEmailError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const emailValidationMessage = validateEmail(email);
    setEmailError(emailValidationMessage);

    if (emailValidationMessage) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(email);
      resetForm();
    } catch {
      // El manejo de error lo hace el componente padre
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white px-6 py-10"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <section
        className="relative mx-auto w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} data-testid="form-forgot-password">
          <div className="flex flex-col items-center rounded-xl border-2 border-rafam-yellow bg-card px-8 py-12 sm:px-12">
            <span
              className="flex h-40 w-40 items-center justify-center rounded-3xl bg-[oklch(0.7_0.19_50)] text-primary-foreground"
              aria-hidden="true"
            >
              <KeyRound className="h-24 w-24" strokeWidth={2.25} stroke="var(--card)" />
            </span>

            <h1 className="mt-8 text-center text-3xl font-extrabold text-foreground sm:text-4xl">
              Recuperar Contraseña
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-foreground sm:text-xl">
              Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <div className="mt-8 w-full max-w-xl">
              <div className="mb-2 flex flex-col gap-2">
                <label htmlFor="forgotEmail" className="text-xl font-bold text-rafam-blue">
                  Email
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${emailError ? 'border-red-500' : ''}`}
                  placeholder="nombre@mail.com"
                  required
                />
                {emailError && <p className="text-sm italic text-red-500">{emailError}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg bg-muted px-10 py-4 text-xl font-bold text-foreground transition-colors hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-rafam-blue/40 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-rafam-blue px-16 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ForgotPasswordComponent;
