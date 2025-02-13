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
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
        🔑
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 max-h-[500px] overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h4 className="text-lg font-semibold mb-3">Auth Debug Info</h4>

          <div className="flex gap-2 mb-3">
            <button
              onClick={fetchToken}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Fetch Token
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h5 className="font-medium mb-1">Authentication Status:</h5>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </pre>
            </div>

            {isAuthenticated && (
              <>
                <div>
                  <h5 className="font-medium mb-1">User Info:</h5>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>

                {token && (
                  <div>
                    <h5 className="font-medium mb-1">Access Token:</h5>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
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
