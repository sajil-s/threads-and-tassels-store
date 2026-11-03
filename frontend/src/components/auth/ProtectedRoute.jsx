
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute() {
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

  if (!isAuthenticated) {
    const destination =
      location.pathname + location.search + location.hash;

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: destination }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
