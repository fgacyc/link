import { TitleContext } from "@/providers/TitleContextProvider";
import React, { useContext } from "react";
import ProfileIcon from "@/components/ProfileIcon";
import {useAuth0} from "@auth0/auth0-react";
import ActivityIndicator from "@/components/ActivityIndicator";
import Input from "@/components/Input";
import {Button} from "@/components/Button";

export default function AssignGroup() {
  const { setTitle } = useContext(TitleContext);

    const { user, getAccessTokenSilently, isAuthenticated, logout } = useAuth0();

  setTitle("Assign Group");

  const config ={
      cg_id : "CG 12345",
      cg_name : "Kuchai | Ps Melvin Team | Kris cg",
  }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        console.log(name, value)
    };

  return (
    <div>
        <div className={"bg-white rounded-lg p-2 flex justify-between items-center"}>
         <div className={"flex"}>
             <ProfileIcon imageUrl={user?.picture || "None" } size={"small"} />
             <div className={"ml-1"}>
                    <p className={"font-bold text-sm"}>{user?.name || "None"}</p>
                    <p className={"text-xs"}>{config.cg_id}</p>
                    <p className={"text-xs text-[#92969D]"}>{config.cg_name}</p>
             </div>
         </div>
            <ActivityIndicator level={"high"} />
        </div>
        <div className={"my-3 text-sm text-[#92969D]"}>Please search a CG name to assign this member to other group.</div>
        <Input
            label="CG Name"
            name="name"
            value={""}
            onChange={handleChange}
            required
            placeholder="Please enter CG name, etc: CYC 123"
        />

        <Input
            label="When to assign"
            name="name"
            type={"date"}
            value={""}
            onChange={handleChange}
            required
            placeholder="Please select a date"
        />

        {/* fix to bottom*/}
        <div className={"fixed bottom-6 left-0 px-6 w-full"}>
            <Button label={"Assign Now"} onClick={()=>{}}  />
        </div>
    </div>
  );
}
