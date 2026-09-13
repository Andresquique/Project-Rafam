"use client"

import React, { useState, FormEvent } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { RegisterDto } from "@/types/auth.types";

interface SignInComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegisterDto) => Promise<void>;
}

function SignInComponent({ isOpen, onClose, onSubmit }: SignInComponentProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es obligatorio.';
    if (!emailRegex.test(email)) return 'El formato del email no es válido.';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'La contraseña es obligatoria.';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return '';
  };

  const validateConfirmPassword = (password: string, confirm: string): string => {
    if (!confirm) return 'Confirmar contraseña es obligatorio.';
    if (password !== confirm) return 'Las contraseñas no coinciden.';
    return '';
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const emailValidationMessage = validateEmail(email);
    const passwordValidationMessage = validatePassword(password);
    const confirmPasswordValidationMessage = validateConfirmPassword(password, confirmPassword);

    setEmailError(emailValidationMessage);
    setPasswordError(passwordValidationMessage);
    setConfirmPasswordError(confirmPasswordValidationMessage);

    if (emailValidationMessage || passwordValidationMessage || confirmPasswordValidationMessage) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ email, password });
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
        <form onSubmit={handleSubmit} data-testid="form-signin">
          <div className="flex flex-col items-center rounded-xl border-2 border-rafam-yellow bg-card px-8 py-12 sm:px-12">
            <span
              className="flex h-40 w-40 items-center justify-center rounded-3xl bg-[oklch(0.7_0.19_50)] text-primary-foreground"
              aria-hidden="true"
            >
              <UserPlus className="h-24 w-24" strokeWidth={2.25} stroke="var(--card)" />
            </span>

            <h1 className="mt-8 text-center text-3xl font-extrabold text-foreground sm:text-4xl">
              Crear Cuenta
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-foreground sm:text-xl">
              Completá tus datos para registrarte en la aplicación.
            </p>

            <div className="mt-8 w-full max-w-xl">
              <div className="mb-4 flex flex-col gap-2">
                <label htmlFor="email" className="text-xl font-bold text-rafam-blue">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
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

              <div className="mb-4 flex flex-col gap-2">
                <label htmlFor="password" className="text-xl font-bold text-rafam-blue">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                      setConfirmPasswordError(validateConfirmPassword(e.target.value, confirmPassword));
                    }}
                    className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 pr-12 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${passwordError ? 'border-red-500' : ''}`}
                    placeholder="********"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-rafam-blue/60 hover:text-rafam-blue"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-sm italic text-red-500">{passwordError}</p>}
              </div>

              <div className="mb-2 flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-xl font-bold text-rafam-blue">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
                    className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 pr-12 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${confirmPasswordError ? 'border-red-500' : ''}`}
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-rafam-blue/60 hover:text-rafam-blue"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPasswordError && <p className="text-sm italic text-red-500">{confirmPasswordError}</p>}
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
              {isSubmitting ? "Procesando..." : "Continuar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SignInComponent;