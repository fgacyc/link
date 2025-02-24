import { TitleContext } from "@/providers/TitleContextProvider";
import React, { useContext, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileIcon from "@/components/ProfileIcon";
// import ActivityIndicator from "@/components/ActivityIndicator";
import { Button } from "@/components/Button";
import Popup from "@/components/Popup/Popup";

export default function RemoveGroup() {
  const { setTitle } = useContext(TitleContext);
  const { user } = useAuth0();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const config = {
    cg_id: "CG 12345",
    cg_name: "Kuchai | Ps Melvin Team | Kris cg",
    leader_name: "Kris Mok",
    group_name: "Kris CG",
    date_of_joining: "2021-12-12",
    contact_no: "012-3456789",
    email: "123456@gamil.com",
    register_date: "2021-12-12",
  };
  setTitle("Remove Group");

  return (
    <div>
      <div
        className={"flex items-center justify-between rounded-lg bg-white p-2"}
      >
        <div className={"flex"}>
          <ProfileIcon imageUrl={user?.picture ?? "None"} size={"small"} />
          <div className={"ml-1"}>
            <p className={"text-sm font-bold"}>{user?.name ?? "None"}</p>
            <p className={"text-xs"}>{config.cg_id}</p>
            <p className={"text-xs text-[#92969D]"}>{config.cg_name}</p>
          </div>
        </div>
      </div>
      <div className={"my-4 rounded-lg bg-white p-2 text-xs"}>
        <div className={"mb-2 flex justify-between"}>
          <div>Date of birth:</div>
          <div className={"font-bold"}>{config.date_of_joining}</div>
        </div>
        <div className={"mb-2 flex justify-between"}>
          <div>Contact No:</div>
          <div className={"font-bold"}>{config.contact_no}</div>
        </div>
        <div className={"mb-2 flex justify-between"}>
          <div>Email:</div>
          <div className={"font-bold"}>{config.email}</div>
        </div>
        <div className={"mb-2 flex justify-between"}>
          <div>Register Date:</div>
          <div className={"font-bold"}>{config.register_date}</div>
        </div>
      </div>

      <div>
        Are you sure you want to remove this member from the group? This action
        cannot be undone.
      </div>

      <div className={"fixed bottom-6 left-0 w-full px-6"}>
        <Button
          label={"Remove"}
          onClick={() => {
            setIsPopupOpen(true);
          }}
        />
      </div>

      <Popup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          console.log("Popup closed");
        }}
        title="Member Removed successfully"
        buttonText="Okay"
        imageUrl=""
      >
        <div className={"flex flex-col items-center"}>
          <ProfileIcon imageUrl={user?.picture ?? "None"} size={"large"} />
          <div className={"text-center text-[#92969D]"}>
            The member is no longer part of your cell group.
          </div>
        </div>
      </Popup>
    </div>
  );
}
