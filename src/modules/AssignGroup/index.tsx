import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext } from "react";

export default function AssignGroup() {
  const { setTitle } = useContext(TitleContext);

  setTitle("Assign Group");

  return (
    <div>
      <h1>Assign Group</h1>
    </div>
  );
}
