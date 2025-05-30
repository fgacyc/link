import { useUser } from "@/stores/useUser";
import { useState } from "react";

export const AuthDebugButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, token } = useUser();

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

          <div className="space-y-3">
            {user && (
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
