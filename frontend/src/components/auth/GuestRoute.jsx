
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-ivory">
        <p className="text-sm text-taupe">
          Checking your session...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    const destination = location.state?.from;

    const redirectTo =
      typeof destination === "string" &&
      destination.startsWith("/") &&
      !destination.startsWith("//") &&
      !destination.startsWith("/\\") &&
      destination !== "/login" &&
      destination !== "/register"
        ? destination
        : "/account";

    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;

