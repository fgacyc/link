import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext } from "react";

export default function RemoveGroup() {
  const { setTitle } = useContext(TitleContext);

  setTitle("Remove Group");

  return (
    <div>
      <h1>Remove Group</h1>
    </div>
  );
}
