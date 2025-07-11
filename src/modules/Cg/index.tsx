import { useSinglePerson, useUpdateSinglePerson } from "@/graphql/hooks/user";
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
      onClick: () => navigate("/cg", { viewTransition: true }),
      variant: "primary",
    },
    {
      label: "Assign Group",
      onClick: () => navigate("/cg/assign-group", { viewTransition: true }),
      variant: "primary",
    },
    {
      label: "Bind Account",
      onClick: () => navigate("/cg/bind-account", { viewTransition: true }),
      variant: "primary",
    },
    {
      label: "Remove Group",
      onClick: () => navigate("/cg/remove-group", { viewTransition: true }),
      variant: "primary",
    },
    {
      label: "Popup",
      onClick: () => navigate("/cg/popup", { viewTransition: true }),
      variant: "primary",
    },
    {
      label: "Dialog",
      onClick: () => navigate("/cg/dialog", { viewTransition: true }),
      variant: "primary",
    },
    {
      label: "Input",
      onClick: () => navigate("/cg/input", { viewTransition: true }),
      variant: "primary",
    },
  ];

  const { data, refetch } = useSinglePerson("fga.tech@gmail.com");
  const updatePerson = useUpdateSinglePerson();

  // Call the mutate function to update the person
  const handleClick = () => {
    updatePerson.mutate({
      uid: "fga.tech@gmail.com",
      name: "FGA Technology.",
    });
  };

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
