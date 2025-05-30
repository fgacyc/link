import { Navigate } from "react-router";
import { CgSpinner } from "react-icons/cg";
import { useUser } from "@/stores/useUser";

const Callback = () => {
  const { isLoading, user } = useUser();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="justfiy-center flex flex-col items-center gap-2">
          <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }
  if (user) {
    return <Navigate to="/cg" />;
  }

  return <>Not Found</>;
};

export default Callback;
