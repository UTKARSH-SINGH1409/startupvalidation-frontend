import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component ensures that only authenticated users
 * (those with a JWT token stored in localStorage) can access child routes.
 * Otherwise, it redirects them to the login page.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
