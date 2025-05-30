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
import Layout from "@/components/Layout";
import Profile from "../modules/Profile";
import Details from "@/modules/Cg/Details";
import { AddShadowUser } from "@/modules/AddShadowUser";

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
        <Route path="add-shadow-user" element={<AddShadowUser />} />

        <Route index element={<Details />} />
        <Route path="example" element={<CGDashboard />} />
        <Route path="assign-group" element={<AssignGroup />} />
        <Route path="bind-account" element={<BindAccount />} />
        <Route path="remove-group" element={<RemoveGroup />} />
        <Route path="popup" element={<PopupDemo />} />
        <Route path="dialog" element={<DialogDemo />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};
