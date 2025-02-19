import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext } from "react";

export default function BindAccount() {
  const { setTitle } = useContext(TitleContext);

  setTitle("Bind Account");

  return (
    <div>
      <h1>Bind Account</h1>
    </div>
  );
}
