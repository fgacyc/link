import { TitleContext } from "@/providers/TitleContextProvider";
import React, { useContext, useState, useEffect } from "react";
import { ProfileIcon } from "@/components/ProfileIcon";

import ActivityIndicator from "@/components/ActivityIndicator";
import Input, { AutoCompleteInput, DateInput } from "@/components/Input";
import { ActionButton } from "@/components/Button";
import Dialog from "@/components/Dialog/Dialog";
import Popup from "@/components/Popup/Popup";
import { Formik, Form } from "formik";
import { useParams } from "react-router";
import { useUser } from "@/stores/useUser";
import {
  useLatestCGAttendance,
  useSinglePerson,
  getAllCGWithParams,
} from "@/graphql";
import { getLevelfromAttendanceDate } from "@/utils";
import * as Yup from "yup";

export default function AssignGroup() {
  const { setTitle, setBg, setHasUnsavedChanges, setWhite, setFixed } =
    useContext(TitleContext);

  const { id } = useParams();

  useEffect(() => {
    setTitle("Assign to Other Group");
    setFixed(false);
    setWhite(false);
    setBg("transparent");
  }, [setTitle, setFixed, setWhite, setBg]);

  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);

  const { data: member, isLoading } = useSinglePerson(id ?? "");
  const { data: attendance } = useLatestCGAttendance(member?.id ?? "");

  type AssignGroupForm = {
    cgName: string;
    // whenToAssign: string;
  };

  if (isLoading) return <div>Loading...</div>;

  if (!member) return <div>Member not found</div>;

  const cg = member.user_connect_groupCollection.edges[0]?.node.connect_group;
  return (
    <div className="flex h-full flex-grow flex-col gap-4 px-4">
      <div className="flex flex-col gap-3">
        <div
          className={
            "flex items-center justify-between rounded-sm bg-white p-2"
          }
        >
          <div className={"flex flex-row items-center gap-2"}>
            <ProfileIcon
              imageUrl={member?.avatar_url ?? ""}
              isVerified={!member.id.startsWith("shadow|")}
              size="small"
            />
            <div className={"flex flex-col"}>
              <p className={"text-sm font-semibold text-black"}>
                {member.name ?? "None"}
              </p>
              <p className={"text-dark text-[10px]"}>{cg?.name}</p>
              <p className={"text-gray text-[10px]"}>CG ID: {cg?.id}</p>
            </div>
          </div>
          <ActivityIndicator
            level={getLevelfromAttendanceDate(
              attendance?.latest_attendance.edges[0]?.node.created_at ?? "",
            )}
          />
        </div>
        <div className={"text-sm text-[#92969D]"}>
          Please search a CG name to assign this member to other group.
        </div>
      </div>
      <Formik<AssignGroupForm>
        initialValues={{
          cgName: "",
          // whenToAssign: "",
        }}
        validationSchema={Yup.object().shape({
          cgName: Yup.string().required("CG Name is required."),
          // whenToAssign: Yup.string().required("Date is required."),
        })}
        onSubmit={(values, actions) => {
          console.log(values);
        }}
      >
        <Form className="flex flex-col gap-5">
          <AutoCompleteInput
            label="CG Name"
            name="cgName"
            placeholder="Please enter CG name, etc: CYC 123"
            onSearch={async (query) => {
              try {
                // Call the API directly with the current query
                const searchResults = await getAllCGWithParams(`%${query}%`);

                // Transform the GraphQL response to match the expected format
                if (searchResults?.connect_groupCollection?.edges) {
                  return searchResults.connect_groupCollection.edges.map(
                    (edge) => ({
                      id: edge.node.id,
                      label: `${edge.node.name} (${edge.node.satellite.name})`,
                      value: edge.node.name,
                    }),
                  );
                }

                return [];
              } catch (error) {
                console.error("Error searching CGs:", error);
                return [];
              }
            }}
          />

          {/* <DateInput
            label="When to assign?"
            name="whenToAssign"
            placeholder="Please select a date"
          /> */}
        </Form>
      </Formik>

      <div className={"sticky flex w-full flex-col gap-2"}>
        <ActionButton
          label={"Assign Now"}
          onClick={() => {
            setIsDialogOpen(true);
          }}
        />
      </div>
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
        {/* <div className={"flex flex-col items-center"}>
          <ProfileIcon imageUrl={user?.avatar_url ?? "None"} size={"large"} />
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
        </div> */}
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
          <ProfileIcon imageUrl={user?.avatar_url ?? "None"} size={"large"} />
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
        {/* <div className={"flex flex-col items-center"}>
          <ProfileIcon imageUrl={user?.avatar_url ?? "None"} size={"large"} />
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
        </div> */}
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
