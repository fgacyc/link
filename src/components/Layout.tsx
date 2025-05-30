import { Outlet } from "react-router";
import { HeaderNav } from "./Header";
import {
  TitleContext,
  TitleContextProvider,
} from "@/providers/TitleContextProvider";
import { useContext } from "react";

const LayoutContent = () => {
  const { title, rightIcon, transparent, fixed, white } =
    useContext(TitleContext);
  return (
    <div className="relative flex h-screen flex-col">
      <HeaderNav
        title={title}
        showBack
        rightIcon={rightIcon}
        transparent={transparent}
        white={white}
        fixed={fixed}
      />
      <main className="relative flex h-full flex-grow flex-col pb-6">
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
