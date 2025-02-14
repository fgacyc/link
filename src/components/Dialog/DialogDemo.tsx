import { useState } from "react";
import Dialog from "./Dialog";

const App = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="h-screen flex items-center justify-center">
            <button
                onClick={() => setIsDialogOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Open Dialog
            </button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Unsaved Field"
                cancelText="Cancel"
                confirmText="Discard"
                onCancel={() => setIsDialogOpen(false)}
                onConfirm={() => {
                    console.log("Changes discarded");
                    setIsDialogOpen(false);
                }}
            >
                <p>You have unsaved field. Do you want to discard?</p>
            </Dialog>
        </div>
    );
};

export default App;
