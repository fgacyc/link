import { useNavigate } from "react-router";
import { useUser } from "./stores/useUser";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";

function App() {
  const { initUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    initUser().then((authed) => {
      if (authed) {
        navigate("/cg", { viewTransition: true });
      }
    });
  }, [initUser]);

  return (
    <main className="flex h-screen items-center justify-center bg-gray-100">
      <div className="justfiy-center flex flex-col items-center gap-2">
        <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
        <p className="text-center">Loading...</p>
      </div>
    </main>
  );
}

export default App;
