import  { useState } from "react";
import Popup from "./Popup";

const PopupDemo = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="h-screen flex items-center justify-center">
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Show Popup
            </button>

            <Popup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Approval Confirmed"
                buttonText="Okay"
                imageUrl="https://via.placeholder.com/150"
                showCheckmark={true}
            >
                <p>The member has been successfully added to <strong className="text-black">CYC123G</strong></p>
            </Popup>
        </div>
    );
};

export default PopupDemo;
