import { useState } from "react";
import Popup from "./Popup";
import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext } from "react";

const PopupDemo = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { setTitle } = useContext(TitleContext);

  setTitle("Popup Demo");

  return (
    <>
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
    </>
  );
};

export default PopupDemo;
