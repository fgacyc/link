import { useQuery } from "@tanstack/react-query";
import { fetchSinglePerson } from "../../graphql/declaration";
import { useGraphQL } from "../../hooks/useGraphQL";
import { type ButtonProps } from "../../components/Button";
import { ButtonGroup } from "../../components/ButtonGroup";
import { useNavigate } from "react-router";
import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext, useEffect } from "react";

export default function CG() {
  const navigate = useNavigate();
  const { setTitle } = useContext(TitleContext);

  const navigationBtns: ButtonProps[] = [
    { label: "Home", onClick: () => navigate("/"), variant: "primary" },
    {
      label: "Dashboard",
      onClick: () => navigate("/cg"),
      variant: "primary",
    },
    {
      label: "Assign Group",
      onClick: () => navigate("/cg/assign-group"),
      variant: "primary",
    },
    {
      label: "Bind Account",
      onClick: () => navigate("/cg/bind-account"),
      variant: "primary",
    },
    {
      label: "Remove Group",
      onClick: () => navigate("/cg/remove-group"),
      variant: "primary",
    },
    {
      label: "Popup",
      onClick: () => navigate("/cg/popup"),
      variant: "primary",
    },
    {
      label: "Dialog",
      onClick: () => navigate("/cg/dialog"),
      variant: "primary",
    },
    {
      label: "Input",
      onClick: () => navigate("/cg/input"),
      variant: "primary",
    },
  ];

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

  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 rounded-lg">
      <ButtonGroup btns={btns} />
      {data ? (
        <pre className="max-h-[600px] overflow-auto rounded-md bg-gray-50 p-4">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <>Loading...</>
      )}
      <ButtonGroup btns={navigationBtns} />
    </div>
  );
}
