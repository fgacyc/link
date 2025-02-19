import { useState } from "react";
import Popup from "./Popup";

const PopupDemo = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-screen">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white"
      >
        Show Popup
      </button>

      <Popup
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          console.log("Popup closed");
        }}
        title="Approval Confirmed"
        buttonText="Okay"
        imageUrl="https://utoolsfigurebed.oss-cn-hangzhou.aliyuncs.com/google.png"
      >
        <p>
          The member has been successfully added to{" "}
          <strong className="text-black">CYC123G</strong>
        </p>
      </Popup>
    </div>
  );
};

export default PopupDemo;
