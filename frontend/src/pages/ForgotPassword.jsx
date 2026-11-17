
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import api from "../services/api";
import Reveal from "../components/common/Reveal";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/auth/forgot-password", {
        email: normalizedEmail,
      });

      setSuccess(
        response.data?.message ||
          "If an account exists with this email, a password reset link will be sent shortly."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send the reset link. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#EAE2D8] bg-[#FFFCF8] px-4 py-3.5 text-sm text-chocolate outline-none transition-colors placeholder:text-taupe/60 focus:border-gold focus:ring-2 focus:ring-gold/10";

  return (
    <section className="min-h-[80vh] bg-ivory px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-md">
        <Reveal>
          <div className="mb-9 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-offwhite text-chocolate">
              <Mail size={24} strokeWidth={1.5} />
            </div>

            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-taupe">
              Threads & Tassels
            </p>

            <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
              Forgot Password?
            </h1>

            <p className="mt-4 text-sm leading-6 text-taupe">
              Enter your registered email address and we'll send you
              a secure link to reset your password.
            </p>
          </div>
        </Reveal>

        <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-6 shadow-[0_8px_35px_rgba(74,46,31,0.04)] sm:p-9">
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-5">
              <div
                role="status"
                className="rounded-lg border border-sage/30 bg-sage/10 px-4 py-4 text-sm leading-6 text-chocolate"
              >
                {success}
              </div>

              <p className="text-center text-xs leading-5 text-taupe">
                Password reset links expire after 5 minutes.
                Check your inbox and spam folder.
              </p>

              <button
                type="button"
                onClick={() => setSuccess("")}
                className="w-full rounded-xl border border-[#EAE2D8] px-5 py-3 text-sm font-medium text-chocolate transition-colors hover:border-gold"
              >
                Try Another Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="mb-2 block text-xs font-medium text-chocolate"
                >
                  Email Address
                </label>

                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email address"
                  required
                  maxLength={254}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-chocolate px-5 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-7 border-t border-[#EAE2D8] pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-chocolate transition-colors hover:text-gold"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-taupe">
          Beautiful fabrics. Thoughtful shopping.
        </p>
      </div>
    </section>
  );
}

export default ForgotPassword;
