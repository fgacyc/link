import { TitleContext } from "@/providers/TitleContextProvider";
import React, { useContext, useState } from "react";
import ProfileIcon from "@/components/ProfileIcon";
import { useAuth0 } from "@auth0/auth0-react";
import ActivityIndicator from "@/components/ActivityIndicator";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import Dialog from "@/components/Dialog/Dialog";
import Popup from "@/components/Popup/Popup";

export default function AssignGroup() {
  const { setTitle } = useContext(TitleContext);
    setTitle("Assign Group");


    const { user } = useAuth0();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);


  const config = {
    cg_id: "CG 12345",
    cg_name: "Kuchai | Ps Melvin Team | Kris cg",
    leader_name: "Kris Mok",
    group_name: "Kris CG",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
  };

  return (
      <div>
          <div
              className={"flex items-center justify-between rounded-lg bg-white p-2"}
          >
              <div className={"flex"}>
                  <ProfileIcon imageUrl={user?.picture ?? "None"} size={"small"}/>
                  <div className={"ml-1"}>
                      <p className={"text-sm font-bold"}>{user?.name ?? "None"}</p>
                      <p className={"text-xs"}>{config.cg_id}</p>
                      <p className={"text-xs text-[#92969D]"}>{config.cg_name}</p>
                  </div>
              </div>
              <ActivityIndicator level={"high"}/>
          </div>
          <div className={"my-3 text-sm text-[#92969D]"}>
              Please search a CG name to assign this member to other group.
          </div>
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

          {/*  Assign group */}
          {/* fix to bottom*/}
          <div className={"fixed bottom-6 left-0 w-full px-6"}>
              <Button
                  label={"Assign Now"}
                  onClick={() => {
                      setIsDialogOpen(true);
                  }}
              />
          </div>

          <Dialog
              isOpen={isDialogOpen}
              title="Confirmation to Assign"
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
              <div className={"flex flex-col items-center"}>
                  <ProfileIcon imageUrl={user?.picture ?? "None"} size={"large"}/>
                  <div className={"text-center text-[#92969D]"}>
                      Are you sure want to assign this memeber to
                      <b className={"ml-2 text-black"}>{config.cg_id}</b>?
                  </div>
              </div>
              <div className={"mt-4 rounded-lg bg-[#F4F4F4] p-2 text-sm"}>
                  <div className={"mb-2 flex justify-between"}>
                      <div>Leader Name:</div>
                      <div className={"font-bold"}>{config.leader_name}</div>
                  </div>
                  <div className={"flex justify-between"}>
                      <div>Group Name:</div>
                      <div className={"font-bold"}>{config.group_name}</div>
                  </div>
              </div>
          </Dialog>
          <Popup
              isOpen={isPopupOpen}
              onClose={() => {
                  setIsPopupOpen(false);
                  console.log("Popup closed");
              }}
              title="Submitted to Assign"
              buttonText="Okay"
              imageUrl=""
          >
              <div className={"flex flex-col items-center"}>
                  <ProfileIcon imageUrl={user?.picture ?? "None"} size={"large"}/>
                  <div className={"text-center text-[#92969D]"}>
                      Please wait. Now the member is still under approval from the new
                      cell group.
                  </div>
              </div>
          </Popup>

          {/*    cancel assign group */}
          <div className={"fixed bottom-15 left-0 w-full px-6"}>
              <Button
                  label={"Cancel Assign"}
                  onClick={() => {
                      setIsCancelDialogOpen(true);
                  }}
              />
          </div>

          <Dialog
              isOpen={isCancelDialogOpen}
              title="Cancel to Assign Group"
              cancelText="Cancel"
              confirmText="Cancel to Assign"
              onCancel={() => {
                  setIsCancelDialogOpen(false);
                  console.log("On Cancel");
              }}
              onConfirm={() => {
                  setIsCancelDialogOpen(false);
                  setIsCancelPopupOpen(true);
                  console.log("On Confirm");
              }}
              vertical={true}
          >
              <div className={"flex flex-col items-center"}>
                  <ProfileIcon imageUrl={user?.picture ?? "None"} size={"large"}/>
                  <div className={"text-center text-[#92969D]"}>
                      Are you sure want to cancel assign this memeber to
                      <b className={"ml-2 text-black"}>{config.cg_id}</b>?
                  </div>
              </div>
              <div className={"mt-4 rounded-lg bg-[#F4F4F4] p-2 text-sm"}>
                  <div className={"mb-2 flex justify-between"}>
                      <div>Leader Name:</div>
                      <div className={"font-bold"}>{config.leader_name}</div>
                  </div>
                  <div className={"flex justify-between"}>
                      <div>Group Name:</div>
                      <div className={"font-bold"}>{config.group_name}</div>
                  </div>
              </div>
          </Dialog>

          <Popup
              isOpen={isCancelPopupOpen}
              onClose={() => {
                  setIsCancelPopupOpen(false);
                  console.log("Popup closed");
              }}
              title=""
              buttonText="Okay"
              imageUrl=""
          >
              <div className={"flex flex-col items-center"}>
                  <img src="/Task_done_with_checkmark_and_thumbs_up.png" alt="cancel-done"/>
                  <h2 className="text-lg font-bold text-center">Cancelled to Assign</h2>
                  <div className={"text-center text-[#92969D]"}>
                      You have cancelled to assign
                      <b className={"ml-2 text-black"}>Kenny L</b>
                      to
                      <b className={"ml-2 text-black"}>CYC456</b>
                  </div>
              </div>
          </Popup>
      </div>
  );
}
