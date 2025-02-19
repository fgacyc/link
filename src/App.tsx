import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect } = useAuth0();

  return (
    <main className="flex h-screen items-center justify-center bg-gray-100">
      <button
        className="rounded-md bg-blue-500 px-4 py-1 text-white"
        onClick={() => loginWithRedirect()}
      >
        Login
      </button>
    </main>
  );
}

export default App;
