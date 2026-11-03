
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Reveal from "../components/common/Reveal";
import { useLocation } from "react-router-dom";


const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function Register() {
    const location = useLocation();
const destination = location.state?.from;
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!fullName || !email || !phone || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)) {
      setError(
        "Password must contain at least 8 characters, including a letter and a number."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await register({
        fullName,
        email,
        phone,
        password: form.password,
      });

     navigate("/login", {
  replace: true,
  state: {
    message: "Account created successfully. Please log in.",
    from: destination,
  },
});
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#EAE2D8] bg-[#FFFCF8] px-4 py-3.5 text-sm text-chocolate outline-none transition-colors placeholder:text-taupe/60 focus:border-gold focus:ring-2 focus:ring-gold/10";

  return (
    <section className="min-h-[80vh] bg-ivory px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-lg">
        <Reveal>
          <div className="mb-9 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-offwhite text-chocolate">
              <UserPlus size={24} strokeWidth={1.5} />
            </div>

            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-taupe">
              Threads & Tassels
            </p>

            <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
              Create Your Account
            </h1>

            <p className="mt-4 text-sm leading-6 text-taupe">
              Join us to discover beautiful fabrics and enjoy
              a seamless shopping experience.
            </p>
          </div>
        </Reveal>

        <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-6 shadow-[0_8px_35px_rgba(74,46,31,0.04)] sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="register-name"
                className="mb-2 block text-xs font-medium text-chocolate"
              >
                Full Name
              </label>

              <input
                id="register-name"
                name="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                maxLength={100}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-xs font-medium text-chocolate"
              >
                Email Address
              </label>

              <input
                id="register-email"
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

            <div>
              <label
                htmlFor="register-phone"
                className="mb-2 block text-xs font-medium text-chocolate"
              >
                Mobile Number
              </label>

              <input
                id="register-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-xs font-medium text-chocolate"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe transition-colors hover:text-chocolate"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-taupe">
                At least 8 characters, including a letter and a number.
              </p>
            </div>

            <div>
              <label
                htmlFor="register-confirm"
                className="mb-2 block text-xs font-medium text-chocolate"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="register-confirm"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
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
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe transition-colors hover:text-chocolate"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-chocolate px-5 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-[#EAE2D8] pt-6 text-center">
            <p className="text-sm text-taupe">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-chocolate underline decoration-gold underline-offset-4 transition-colors hover:text-gold"
              >
                Log In
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

export default Register;
