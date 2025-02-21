import { Route, Routes } from "react-router";
import App from "../App";
import CGDashboard from "../modules/Cg";
import Callback from "../modules/_callbacks";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AssignGroup from "../modules/AssignGroup";
import BindAccount from "../modules/BindAccount";
import RemoveGroup from "../modules/RemoveGroup";
import PopupDemo from "../components/Popup/PopupDemo";
import DialogDemo from "../components/Dialog/DialogDemo";
import InputDemo from "../components/Input/InputDemo";
import Layout from "@/components/Layout";

export const MainRoutes = () => {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="callback" element={<Callback />} />
      <Route
        path="cg"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CGDashboard />} />
        <Route path="assign-group" element={<AssignGroup />} />
        <Route path="bind-account" element={<BindAccount />} />
        <Route path="remove-group" element={<RemoveGroup />} />
        <Route path="popup" element={<PopupDemo />} />
        <Route path="dialog" element={<DialogDemo />} />
        <Route path="input" element={<InputDemo />} />
      </Route>
    </Routes>
  );
};
