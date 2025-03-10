import { type AppState, Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { AuthDebugButton } from "../components/AuthDebugButton";

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  if (!(domain && clientId)) {
    return null;
  }

  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo ?? window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      useRefreshTokens
      authorizationParams={{
        redirect_uri: window.location.origin + "/callback",
        audience: "https://graphql.development.fgacyc.com/",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
      <AuthDebugButton />
    </Auth0Provider>
  );
};
