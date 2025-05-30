import { TitleContext } from "@/providers/TitleContextProvider";
import React, { useContext, useState, useEffect } from "react";
import { ProfileIcon } from "@/components/ProfileIcon";

import ActivityIndicator from "@/components/ActivityIndicator";
import Input from "@/components/Input";
import { ActionButton } from "@/components/Button";
import Dialog from "@/components/Dialog/Dialog";
import Popup from "@/components/Popup/Popup";
import { Formik } from "formik";
import { Form, useParams } from "react-router";
import { useUser } from "@/stores/useUser";

export default function AssignGroup() {
  const { setTitle } = useContext(TitleContext);

  const { cgName } = useParams();

  useEffect(() => {
    setTitle("Assign Group");
  }, [setTitle]);

  const { user } = useUser();
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

  type AssignGroupForm = {
    cgName: string;
    whenToAssign: string;
  };

  return (
    <div className="flex h-full flex-grow flex-col justify-between px-6">
      <Formik<AssignGroupForm>
        initialValues={{
          cgName: "",
          whenToAssign: "",
        }}
        onSubmit={(values, actions) => {
          console.log(values);
        }}
      >
        <div
          className={
            "flex items-center justify-between rounded-lg bg-white p-2"
          }
        >
          <div className={"flex items-center"}>
            <ProfileIcon
              imageUrl={
                user?.picture ?? `https://placehold.co/40?text=${user?.name}`
              }
              size={"small"}
            />
            <div className={"ml-1"}>
              <p className={"text-sm font-bold"}>{user?.name ?? "None"}</p>
              <p className={"text-xs"}>{config.cg_id}</p>
              <p className={"text-xs text-[#92969D]"}>{config.cg_name}</p>
            </div>
          </div>
          <ActivityIndicator level={"high"} />
        </div>
        <div className={"my-3 text-sm text-[#92969D]"}>
          Please search a CG name to assign this member to other group.
        </div>
        <Form className="relative flex h-full flex-grow flex-col">
          <Input
            label="CG Name"
            name="cgName"
            required
            placeholder="Please enter CG name, etc: CYC 123"
          />

          <Input
            label="When to assign"
            name="date"
            type="date"
            required
            placeholder="Please select a date"
          />
        </Form>

        {/*  Assign group */}
        {/* fix to bottom*/}
        <div className={"sticky bottom-0 flex w-full flex-col gap-2"}>
          <ActionButton
            label={"Assign Now"}
            onClick={() => {
              setIsDialogOpen(true);
            }}
          />
          <ActionButton
            label={"Cancel Assign"}
            onClick={() => {
              setIsCancelDialogOpen(true);
            }}
          />
        </div>
      </Formik>
      <Dialog
        isOpen={isDialogOpen}
        title="Confirmation to Assign"
        centerTitle
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
          <ProfileIcon imageUrl={user?.picture ?? "None"} size={"large"} />
          <div className={"text-center text-[#92969D]"}>
            Are you sure want to assign this member to
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
          <ProfileIcon imageUrl={user?.picture ?? "None"} size={"large"} />
          <div className={"text-center text-[#92969D]"}>
            Please wait. Now the member is still under approval from the new
            cell group.
          </div>
        </div>
      </Popup>
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
          <ProfileIcon imageUrl={user?.picture ?? "None"} size={"large"} />
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
          <img
            src="/Task_done_with_checkmark_and_thumbs_up.png"
            alt="cancel-done"
          />
          <h2 className="text-center text-lg font-bold">Cancelled to Assign</h2>
          <div className={"text-center text-[#92969D]"}>
            You have cancelled to assign <b className={"text-black"}>Kenny L</b>{" "}
            to <b className={"text-black"}>CYC456</b>
          </div>
        </div>
      </Popup>
    </div>
  );
}
