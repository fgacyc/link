import { useState } from "react";
import Dialog from "./Dialog";
import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext } from "react";

const App = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setTitle } = useContext(TitleContext);

  setTitle("Dialog Demo");

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white"
      >
        Open Dialog
      </button>

      <Dialog
        isOpen={isDialogOpen}
        title="Unsaved Field"
        cancelText="Cancel"
        confirmText="Confirm"
        onCancel={() => {
          setIsDialogOpen(false);
          console.log("On Cancel");
        }}
        onConfirm={() => {
          setIsDialogOpen(false);
          console.log("On Confirm");
        }}
      >
        <p>You have unsaved field. Do you want to discard?</p>
      </Dialog>
    </>
  );
};

export default App;
