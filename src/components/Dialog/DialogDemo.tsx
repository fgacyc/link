import { useState } from "react";
import Dialog from "./Dialog";

const App = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="h-screen">
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
    </div>
  );
};

export default App;
