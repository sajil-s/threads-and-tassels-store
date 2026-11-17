
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import api from "../services/api";
import Reveal from "../components/common/Reveal";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-[#EAE2D8] bg-[#FFFCF8] px-4 py-3.5 text-sm text-chocolate outline-none transition-colors placeholder:text-taupe/60 focus:border-gold focus:ring-2 focus:ring-gold/10";

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setError("");

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      setError("This password reset link is invalid.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      setError(
        "Password must be at least 8 characters and contain a letter and a number."
      );
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset your password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-[80vh] bg-ivory px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-md">
        <Reveal>
          <div className="mb-9 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-offwhite text-chocolate">
              {success ? (
                <CheckCircle2 size={24} strokeWidth={1.5} />
              ) : (
                <LockKeyhole size={24} strokeWidth={1.5} />
              )}
            </div>

            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-taupe">
              Threads & Tassels
            </p>

            <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
              {success ? "Password Updated" : "Reset Password"}
            </h1>

            <p className="mt-4 text-sm leading-6 text-taupe">
              {success
                ? "Your password has been changed successfully."
                : "Create a new password to securely access your account."}
            </p>
          </div>
        </Reveal>

        <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-6 shadow-[0_8px_35px_rgba(74,46,31,0.04)] sm:p-9">
          {success ? (
            <div className="space-y-6">
              <div
                role="status"
                className="rounded-lg border border-sage/30 bg-sage/10 px-4 py-4 text-center text-sm leading-6 text-chocolate"
              >
                Your password has been updated. Please log in using
                your new password.
              </div>

              <Link
                to="/login"
                replace="true"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-chocolate px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold"
              >
                Back to Login
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : !token || !/^[a-f0-9]{64}$/i.test(token) ? (
            <div className="space-y-5">
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
              >
                This password reset link is invalid. Please request a new one.
              </div>

              <Link
                to="/forgot-password"
                className="flex w-full items-center justify-center rounded-xl bg-chocolate px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold"
              >
                Request New Link
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="reset-password"
                    className="mb-2 block text-xs font-medium text-chocolate"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={8}
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-chocolate"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-xs font-medium text-chocolate"
                  >
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm new password"
                      required
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-chocolate"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs leading-5 text-taupe">
                  Use at least 8 characters, including a letter and
                  a number.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-chocolate px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    "Updating Password..."
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {!success && (
            <div className="mt-7 border-t border-[#EAE2D8] pt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-chocolate transition-colors hover:text-gold"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>

        <p className="mt-7 text-center text-xs text-taupe">
          Beautiful fabrics. Thoughtful shopping.
        </p>
      </div>
    </section>
  );
}

export default ResetPassword;
