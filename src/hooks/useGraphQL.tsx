import { useAuth0 } from "@auth0/auth0-react";
import { GraphQLClient } from "graphql-request";
import { useEffect, useState } from "react";

export const useGraphQL = () => {
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const client = new GraphQLClient(import.meta.env.VITE_GRAPHQL_URL);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setToken(token);
        setReady(true);
      } catch (error) {
        console.error("Failed to get token:", error);
        setReady(false);
      }
    };
    getToken();
  }, [getAccessTokenSilently]);

  const query = (query: string, variables?: Record<string, any>) => {
    if (!token) throw new Error("No or Invalid token");
    console.table({
      type: "query",
      query,
      variables,
      token,
    });
    return client.request(query, variables, {
      Authorization: `Bearer ${token}`,
    });
  };

  const mutate = (query: string, variables?: Record<string, any>) => {
    if (!token) throw new Error("No or Invalid token");
    console.table({ type: "mutate", query, variables, token });
    return client.request(query, variables, {
      Authorization: `Bearer ${token}`,
    });
  };

  return { query, mutate, ready };
};
