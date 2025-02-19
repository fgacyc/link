import { Route, Routes } from "react-router";
import App from "../App";
import CGDashboard from "../modules/Cg";
import Callback from "../modules/_callbacks";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AssignGroup from "../pages/assign-group/assign-group";
import BindAccount from "../pages/bind-account/bind-account";
import RemoveGroup from "../pages/remove-group/remove-group";
import PopupDemo from "../components/Popup/PopupDemo";
import DialogDemo from "../components/Dialog/DialogDemo";
import InputDemo from "../components/Input/InputDemo";
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
    path: "/assign-group",
    element: <AssignGroup />,
    protected: true,
  },
  {
    path: "/bind-account",
    element: <BindAccount />,
    protected: true,
  },
  {
    path: "/remove-group",
    element: <RemoveGroup />,
    protected: true,
  },
  {
    path: "/popup",
    element: <PopupDemo />,
    protected: false,
  },
  {
    path: "/dialog",
    element: <DialogDemo />,
    protected: false,
  },
  {
    path: "/input",
    element: <InputDemo />,
    protected: false,
  },
  {
    path: "/cg",
    element: <div>CG</div>,
    protected: true,
  },
  { path: "/cg/dashboard", element: <CGDashboard />, protected: true },
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
