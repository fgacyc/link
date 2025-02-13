import { Route, Routes } from "react-router";
import App from "../App";
import CGDashboard from "../modules/Cg";
import Callback from "../modules/_callbacks";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const routes = [
  {
    path: "/",
    element: <App />,
    protected: false,
  },
  {
    path: "/dashboard",
    element: <CGDashboard />,
    protected: true,
  },
  {
    path: "/callback",
    element: <Callback />,
    protected: false,
  },
];

export const MainRoutes = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.protected ? (
              <ProtectedRoute>{route.element}</ProtectedRoute>
            ) : (
              route.element
            )
          }
        />
      ))}
    </Routes>
  );
};
