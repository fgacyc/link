import { useNavigate, useParams } from "react-router";
import { ProfileIcon } from "../ProfileIcon";
import PopupBase from "./PopupBase";
import Popup from "./Popup";
import { useRemoveMemberFromCG, useSinglePerson } from "@/graphql";
import { ButtonGroup } from "../ButtonGroup";
import { useState } from "react";

interface RemoveMemberPopupProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const RemoveMemberPopup = ({
  isOpen,
  setOpen,
}: RemoveMemberPopupProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: member } = useSinglePerson(id ?? "");
  const isVerified = !member?.id.startsWith("shadow|");
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);

  const { mutate: removeMember, isPending } = useRemoveMemberFromCG();

  return (
    <>
      <Popup
        isOpen={successPopupOpen}
        title="Successfully Removed"
        onClose={() => {
          setSuccessPopupOpen(false);
          navigate(-1);
        }}
        customImage={
          <img
            src="/task_done.png"
            className="w-[200px] object-contain"
            alt="Success"
          />
        }
        buttonText="Okay"
      >
        <p className="text-gray">
          The member has been successfully removed from the group.
        </p>
      </Popup>
      <PopupBase open={isOpen} setOpen={setOpen} title="Remove from Group">
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full flex-col gap-3">
            <div className="flex flex-row items-center gap-2 p-2">
              <ProfileIcon
                imageUrl={member?.avatar_url ?? ""}
                size="small"
                isVerified={isVerified}
              />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-black">
                  {member?.name}
                </p>
                <p className="text-dark text-[10px]">
                  CG ID:{" "}
                  {
                    member?.user_connect_groupCollection.edges[0]?.node
                      .connect_group.id
                  }
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-1 rounded-lg bg-[#f4f4f4] p-3">
              {member?.date_of_birth && (
                <div className="flex w-full flex-row justify-between">
                  <p className="text-dark text-xs opacity-80">Date of birth:</p>
                  <p className="text-dark text-xs">
                    {`${new Date(member.date_of_birth).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )} (${new Date().getFullYear() - new Date(member.date_of_birth).getFullYear()} Y.O.)`}
                  </p>
                </div>
              )}
              {member?.phone_number && (
                <div className="flex w-full flex-row justify-between">
                  <p className="text-dark text-xs opacity-80">Contact No:</p>
                  <p className="text-dark text-xs">{member.phone_number}</p>
                </div>
              )}
              {member?.email && (
                <div className="flex w-full flex-row justify-between">
                  <p className="text-dark text-xs opacity-80">Email:</p>
                  <p className="text-dark text-xs">{member.email}</p>
                </div>
              )}
              {member?.created_at && (
                <div className="flex w-full flex-row justify-between">
                  <p className="text-dark text-xs opacity-80">Register Date:</p>
                  <p className="text-dark text-xs">
                    {new Date(member.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray w-full text-center text-sm">
            Are you sure you want to remove this member from the group? This
            action cannot be undone.
          </p>

          <ButtonGroup
            btns={[
              {
                extendedClassName: "font-bold",
                extendedPaddingY: true,
                label: "Remove",
                variant: "primary",
                loading: isPending,
                onClick: () => {
                  removeMember(
                    { id: member?.id ?? "" },
                    {
                      onSuccess: () => {
                        setOpen(false);
                        setSuccessPopupOpen(true);
                      },
                    },
                  );
                },
              },
              {
                extendedClassName: "font-bold",
                extendedPaddingY: true,
                label: "Cancel",
                variant: "secondary",
                onClick: () => setOpen(false),
              },
            ]}
          />
        </div>
      </PopupBase>
    </>
  );
};
