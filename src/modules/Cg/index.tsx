import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchSinglePerson,
  updateSinglePerson,
} from "../../graphql/declaration";
import { useGraphQL } from "../../hooks/useGraphQL";
import { type ActionButtonProps } from "../../components/Button";
import { ButtonGroup } from "../../components/ButtonGroup";
import { useNavigate } from "react-router";
import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext, useEffect } from "react";

export default function CG() {
  const navigate = useNavigate();
  const { setTitle } = useContext(TitleContext);

  const navigationBtns: ActionButtonProps[] = [
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

  // Get the mutate function here
  const { query, mutate, ready } = useGraphQL();

  // Pass the mutate function to the useMutation hook from react-query
  const { mutate: updatePerson, data: updatedPersonData } = useMutation({
    mutationFn: ({ name, email }: { name: string; email: string }) => {
      return mutate(updateSinglePerson, {
        name,
        email: email,
      });
    },
  });

  // Call the mutate function to update the person
  const handleClick = () => {
    updatePerson({
      name: "FGA Technology.",
      email: "fga.tech@gmail.com",
    });
  };

  const { data, refetch } = useQuery({
    queryKey: ["person"],
    queryFn: async () => {
      const data = await query(fetchSinglePerson, {
        email: "fga.tech@gmail.com",
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

  const btns: ActionButtonProps[] = [
    { label: "Refetch", onClick: () => refetch(), variant: "primary" },
    { label: "Mutation", onClick: handleClick, variant: "primary" },
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
    <div className="flex w-full max-w-2xl flex-col gap-2 rounded-lg px-6 pt-19">
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
