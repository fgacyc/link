import { useQuery } from "@tanstack/react-query";
import { fetchAllPerson, fetchSinglePerson } from "../../graphql/declaration";
import { useGraphQL } from "../../hooks/useGraphQL";
import { HeaderNav } from "../../components/Header";
import { Button, ButtonProps } from "../../components/Button";
import { ButtonGroup } from "../../components/ButtonGroup";

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

  const btns: ButtonProps[] = [
    { label: "Refetch", onClick: () => refetch(), variant: "primary" },
    {
      label: "Secondary",
      onClick: () => console.log("secondary"),
      variant: "secondary",
    },
    {
      label: "Warning",
      onClick: () => console.log("warning"),
      variant: "warning",
    },
  ];

  return (
    <div className="relative flex h-screen flex-col">
      <HeaderNav showBack title="CGDashboard" />
      <div className="flex w-full max-w-2xl flex-col gap-2 rounded-lg p-6">
        <ButtonGroup btns={btns} />
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
