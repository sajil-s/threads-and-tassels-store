
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Reveal from "../components/common/Reveal";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const successMessage = location.state?.message;

  // Preserve the page the customer originally wanted.
  const destination = location.state?.from;

  const redirectTo =
    typeof destination === "string" &&
    destination.startsWith("/") &&
    !destination.startsWith("//") &&
    !destination.startsWith("/\\")
      ? destination
      : "/account";

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
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
              <LockKeyhole size={24} strokeWidth={1.5} />
            </div>

            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-taupe">
              Threads & Tassels
            </p>

            <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-4 text-sm leading-6 text-taupe">
              Log in to your account to continue your shopping journey.
            </p>
          </div>
        </Reveal>

        <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-6 shadow-[0_8px_35px_rgba(74,46,31,0.04)] sm:p-9">
          {successMessage && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-sage/30 bg-sage/10 px-4 py-3 text-sm text-chocolate"
            >
              {successMessage}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-xs font-medium text-chocolate"
              >
                Email Address
              </label>

              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-xs font-medium text-chocolate"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe transition-colors hover:text-chocolate"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-chocolate px-5 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                "Logging In..."
              ) : (
                <>
                  Log In
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-7 border-t border-[#EAE2D8] pt-6 text-center">
            <p className="text-sm text-taupe">
              Don't have an account?{" "}
              <Link
                to="/register"
                state={{ from: redirectTo }}
                className="font-medium text-chocolate underline decoration-gold underline-offset-4 transition-colors hover:text-gold"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-taupe">
          Beautiful fabrics. Thoughtful shopping.
        </p>
      </div>
    </section>
  );
}

export default Login;
