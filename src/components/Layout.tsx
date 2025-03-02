import { Outlet } from "react-router";
import { HeaderNav } from "./Header";
import {
  TitleContext,
  TitleContextProvider,
} from "@/providers/TitleContextProvider";
import { useContext } from "react";

const LayoutContent = () => {
  const { title } = useContext(TitleContext);
  return (
    <div className="relative flex h-screen flex-col">
      <HeaderNav title={title} showBack />
      <main className="relative flex h-full flex-grow flex-col px-6 pb-6">
        <Outlet />
      </main>
    </div>
  );
};

const Layout = () => {
  return (
    <TitleContextProvider>
      <LayoutContent />
    </TitleContextProvider>
  );
};

export default Layout;
