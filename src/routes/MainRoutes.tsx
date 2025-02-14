import { Route, Routes } from "react-router";
import App from "../App";
import CGDashboard from "../modules/Cg";
import Callback from "../modules/_callbacks";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AssignGroup from "../pages/assign-group/assign-group.tsx";
import BindAccount from "../pages/bind-account/bind-account.tsx";
import RemoveGroup from "../pages/remove-group/remove-group.tsx";

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
    {
        path: "/users/:userId/assign-group",
        element: <AssignGroup/>,
        protected: true,
    },
    {
        path: "/users/:userId/bind-account",
        element: <BindAccount/>,
        protected: true,
    },
    {
        path: "/users/:userId/remove-group",
        element: <RemoveGroup/>,
        protected: true,
    }
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
