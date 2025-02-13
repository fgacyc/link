import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect } = useAuth0();

  return (
    <main className="flex justify-center items-center h-screen bg-gray-100">
      <button
        className="px-4 bg-blue-500 text-white py-1 rounded-md"
        onClick={() => loginWithRedirect()}
      >
        Login
      </button>
    </main>
  );
}

export default App;
