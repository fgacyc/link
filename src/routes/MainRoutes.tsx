import { Route, Routes } from "react-router";
import App from "../App";
import CGDashboard from "../modules/Cg";
import Callback from "../modules/_callbacks";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AssignGroup from "../pages/assign-group/assign-group.tsx";
import BindAccount from "../pages/bind-account/bind-account.tsx";
import RemoveGroup from "../pages/remove-group/remove-group.tsx";
import PopupDemo from "../components/Popup/PopupDemo.tsx";
import DialogDemo from "../components/Dialog/DialogDemo.tsx";

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
        element: <AssignGroup/>,
        protected: true,
    },
    {
        path: "/bind-account",
        element: <BindAccount/>,
        protected: true,
    },
    {
        path: "/remove-group",
        element: <RemoveGroup/>,
        protected: true,
    },
    {
        path: "/popup",
        element: <PopupDemo/>,
        protected: false,
    },
    {
        path: "/dialog",
        element: <DialogDemo/>,
        protected: false,
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
