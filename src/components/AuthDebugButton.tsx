import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export const AuthDebugButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, getAccessTokenSilently, isAuthenticated, logout } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <div className="fixed right-2 bottom-2 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg transition-colors hover:bg-gray-700"
      >
        🔑
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-14 max-h-[500px] w-80 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <h4 className="mb-3 text-lg font-semibold">Auth Debug Info</h4>

          <div className="mb-3 flex gap-2">
            <button
              onClick={fetchToken}
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Fetch Token
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h5 className="mb-1 font-medium">Authentication Status:</h5>
              <pre className="rounded bg-gray-100 p-2 text-sm">
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </pre>
            </div>

            {isAuthenticated && (
              <>
                <div>
                  <h5 className="mb-1 font-medium">User Info:</h5>
                  <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-sm">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>

                {token && (
                  <div>
                    <h5 className="mb-1 font-medium">Access Token:</h5>
                    <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-sm">
                      {token}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
