import { TitleContext } from "@/providers/TitleContextProvider";
import React, { useContext, useState } from "react";
import { IoInformationCircle, IoLink } from "react-icons/io5";
import { Button } from "@/components/Button";
import Dialog from "@/components/Dialog/Dialog";
import ProfileIcon from "@/components/ProfileIcon";
import Popup from "@/components/Popup/Popup";
import { useAuth0 } from "@auth0/auth0-react";

interface Member {
  id: string;
  name: string;
  avatar: string;
}

export default function BindAccount() {
  const { setTitle } = useContext(TitleContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { user } = useAuth0();

  setTitle("Bind Account");

  // const config = {
  //   cg_id: "CG 12345",
  //   cg_name: "Kuchai | Ps Melvin Team | Kris cg",
  //   leader_name: "Kris Mok",
  //   group_name: "Kris CG",
  // };

  const existing_member = {
    name: "John Doe",
    cg_id: "CG 12345",
  };

  const shadow_user = {
    name: "Daniel",
    cg_id: "CG 878212",
  };

  const members: Member[] = [
    {
      id: "CGA1122345",
      name: "Kenny L",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: "CGA1126789",
      name: "John D",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: "CGA1134567",
      name: "Peter S",
      avatar: "https://via.placeholder.com/40",
    },
  ];
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [shadowUser, setShadowUser] = useState<string | null>(null);

  return (
    <div>
      <div
        className={
          "flex items-center justify-between rounded-lg bg-[#FFFDE7] p-2"
        }
      >
        <IoInformationCircle
          size={22}
          color={"#DBAE0F"}
          className={"h-6 w-6"}
        />

        <div className={"ml-1 w-full text-[#DBAE0F]"}>
          After binding the account, the attendance and equipment training data
          will be merged.
        </div>
      </div>
      <div className={"my-2 text-[#92969D]"}>
        Please search for a shadow user to bind to this member.
      </div>

      <div>
        <label className="text-sm font-medium">Existing Member</label>
        <select
          className="mt-1 w-full rounded-md border p-2"
          onChange={(e) => {
            const member = members.find((m) => m.id === e.target.value) ?? null;
            setSelectedMember(member);
          }}
          value={selectedMember?.id ?? ""}
        >
          <option value="">Select a member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {`${member.name} (${member.id})`}
            </option>
          ))}
        </select>
        {/*{selectedMember && (*/}
        {/*    <div className="flex items-center mt-2">*/}
        {/*        <img src={selectedMember.avatar} alt={selectedMember.name}*/}
        {/*             className="w-8 h-8 rounded-full mr-2"/>*/}
        {/*        <span>{selectedMember.name} ({selectedMember.id})</span>*/}
        {/*    </div>*/}
        {/*)}*/}
      </div>

      <div className="mt-4 flex justify-center">
        <IoLink className={"h-6 w-6 rotate-90"} color={"#000"} />
      </div>

      <div>
        <label className="text-sm font-medium">Shadow User</label>
        <select
          className="mt-1 w-full rounded-md border p-2"
          onChange={(e) => setShadowUser(e.target.value)}
          value={shadowUser ?? ""}
        >
          <option value="">Search user name or CG ID</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {`${member.name} (${member.id})`}
            </option>
          ))}
        </select>
      </div>

      <div className={"fixed bottom-6 left-0 w-full px-6"}>
        <Button
          label={"Bind Now"}
          onClick={() => {
            setIsDialogOpen(true);
          }}
        />
      </div>

      <Dialog
        isOpen={isDialogOpen}
        title="Confirm Binding"
        cancelText="Cancel"
        confirmText="Confirm to Assign"
        onCancel={() => {
          setIsDialogOpen(false);
          console.log("On Cancel");
        }}
        onConfirm={() => {
          setIsDialogOpen(false);
          setIsPopupOpen(true);
          console.log("On Confirm");
        }}
        vertical={true}
      >
        <div className={"rounded-lg bg-[#F4F4F4] p-2 text-xs"}>
          <div>
            <div className={"text-[#92969D]"}>Existing Member:</div>
            <div className={"flex items-center"}>
              <ProfileIcon imageUrl={user?.picture ?? "None"} size={"small"} />
              <div className={"ml-1"}>
                <p className={"text-sm font-bold"}>
                  {existing_member.name || "None"}
                </p>
                <p className={"text-xs text-[#92969D]"}>
                  {existing_member.cg_id}
                </p>
              </div>
            </div>
          </div>
          <div className={"mt-2"}>
            <div className={"text-[#92969D]"}>Shadow User:</div>
            <div className={"flex items-center"}>
              <ProfileIcon imageUrl={"/vite.svg"} size={"small"} />
              <div className={"ml-1"}>
                <p className={"text-sm font-bold"}>
                  {shadow_user.name || "None"}
                </p>
                <p className={"text-xs text-[#92969D]"}>{shadow_user.cg_id}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={"my-2 text-center text-[#92969D]"}>
          Are you sure you want to bind these accounts? The data from both
          accounts will be merged.
        </div>
      </Dialog>
      <Popup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          console.log("Popup closed");
        }}
        title="Account Binding Successful"
        buttonText="Okay"
        imageUrl=""
      >
        <div className={"flex flex-col items-center"}>
          <div className={"flex w-full items-center justify-around"}>
            <ProfileIcon imageUrl={user?.picture ?? "None"} size={"medium"} />
            <IoLink className={"h-6 w-6"} color={"#000"} />
            <ProfileIcon imageUrl={"/vite.svg"} size={"medium"} />
          </div>
          <div className={"text-center text-[#92969D]"}>
            The data from both accounts has been successfully merged.
          </div>
        </div>
      </Popup>
    </div>
  );
}
