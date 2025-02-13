import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";
import { CgSpinner } from "react-icons/cg";

const Callback = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center justfiy-center gap-2">
          <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <>Not Found</>;
};

export default Callback;
