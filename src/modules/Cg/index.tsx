import { useQuery } from "@tanstack/react-query";
import { fetchAllPerson, fetchSinglePerson } from "../../graphql/declaration";
import { useGraphQL } from "../../hooks/useGraphQL";

export default function CGDashboard() {
  const { query, ready } = useGraphQL();
  const { data, refetch } = useQuery({
    queryKey: ["person"],
    queryFn: async () => {
      const data = await query(fetchSinglePerson, {
        name: "fga.tech@gmail.com",
      });
      return data;
    },
    enabled: ready,
  });

  // const { data, refetch } = useQuery({
  //   queryKey: ["person"],
  //   queryFn: async () => {
  //     return query(fetchSinglePerson, {
  //       name: "fga.tech@gmail.com",
  //     });
  //   },
  // });

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-2xl flex-col rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">CGDashboard</h1>
        <button
          className="mb-1 rounded-md bg-blue-500 px-2 py-1 text-white"
          onClick={() => refetch()}
        >
          Refetch
        </button>
        {data ? (
          <pre className="max-h-[600px] overflow-auto rounded-md bg-gray-50 p-4">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <>Loading...</>
        )}
      </div>
    </div>
  );
}
