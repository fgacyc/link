import { Route, Routes } from "react-router";
import App from "../App";
import CGDashboard from "../modules/Cg";
import Callback from "../modules/_callbacks";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AssignGroup from "../modules/Profile/AssignGroup";
import BindAccount from "../modules/BindAccount";
import RemoveGroup from "../modules/RemoveGroup";
import PopupDemo from "../components/Popup/PopupDemo";
import DialogDemo from "../components/Dialog/DialogDemo";
import Layout from "@/components/Layout";
import Profile from "../modules/Profile";
import Details from "@/modules/Cg/Details";
import { AddShadowUser } from "@/modules/AddShadowUser";
import ManageCG from "@/modules/ManageCG";
import ManageCGName from "@/modules/ManageCG/Name";
import ManageCGImage from "@/modules/ManageCG/Image";
import ManageCGDescription from "@/modules/ManageCG/Description";

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
        <Route path="manage" element={<ManageCG />} />
        <Route path="manage/name" element={<ManageCGName />} />
        <Route path="manage/photo" element={<ManageCGImage />} />
        <Route path="manage/description" element={<ManageCGDescription />} />
        <Route index element={<Details />} />
        {/* <Route path="example" element={<CGDashboard />} />
        <Route path="bind-account" element={<BindAccount />} />
        <Route path="remove-group" element={<RemoveGroup />} />
        <Route path="popup" element={<PopupDemo />} />
        <Route path="dialog" element={<DialogDemo />} /> */}
        <Route path="profile/:id" element={<Profile />} />
        <Route path="profile/:id/assign" element={<AssignGroup />} />
      </Route>
    </Routes>
  );
};
