import { useUser } from "@/stores/useUser";
import { GraphQLClient } from "graphql-request";
import { useEffect, useState } from "react";

export const useGraphQL = () => {
  const [ready, setReady] = useState(false);
  const { token } = useUser();

  useEffect(() => {
    setReady(!!token);
  }, [token]);

  const client = new GraphQLClient(import.meta.env.VITE_GRAPHQL_URL as string);

  const query = (query: string, variables?: Record<string, unknown>) => {
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

  const mutate = (query: string, variables?: Record<string, unknown>) => {
    if (!token) throw new Error("No or Invalid token");
    console.table({ type: "mutate", query, variables, token });
    return client.request(query, variables, {
      Authorization: `Bearer ${token}`,
    });
  };

  return { query, mutate, ready };
};
