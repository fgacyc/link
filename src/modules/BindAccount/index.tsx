import { TitleContext } from "@/providers/TitleContextProvider";
import React, { useContext, useState, useEffect } from "react";
import { IoInformationCircle, IoLink } from "react-icons/io5";
import { ActionButton } from "@/components/Button";
import Dialog from "@/components/Dialog/Dialog";
import { ProfileIcon } from "@/components/ProfileIcon";
import Popup from "@/components/Popup/Popup";
import MemberDropdown from "@/modules/BindAccount/MemberDropdown";
import { useBindShadowUser, useCGMembers } from "@/graphql";
import { type GetCGMembersResponse } from "@/types/graphql";
import { useParams } from "react-router";
import { CgSpinner } from "react-icons/cg";

export default function BindAccount() {
  const { setTitle, setFixed, setWhite, setBg } = useContext(TitleContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { id } = useParams();
  const { data: members, isLoading: isLoadingMembers } = useCGMembers(id ?? "");

  const [selectedMember, setSelectedMember] = useState<
    | GetCGMembersResponse["user_connect_groupCollection"]["edges"][number]["node"]["connect_group"]["user_connect_groupCollection"]["edges"][number]["node"]["user"]
    | null
  >(null);
  const [selectedShadowMember, setSelectedShadowMember] = useState<
    | GetCGMembersResponse["user_connect_groupCollection"]["edges"][number]["node"]["connect_group"]["user_connect_groupCollection"]["edges"][number]["node"]["user"]
    | null
  >(null);

  const {
    mutateAsync: bindShadowUser,
    isPending: isBinding,
    isError: isErrorBinding,
  } = useBindShadowUser();

  useEffect(() => {
    setTitle("Bind Account");
    setFixed(false);
    setWhite(false);
    setBg("transparent");
  }, [setTitle, setFixed, setWhite, setBg]);

  const handleSelectExist = (
    member: GetCGMembersResponse["user_connect_groupCollection"]["edges"][number]["node"]["connect_group"]["user_connect_groupCollection"]["edges"][number]["node"]["user"],
  ) => {
    setSelectedMember(member);
  };

  const handleSelectShadow = (
    member: GetCGMembersResponse["user_connect_groupCollection"]["edges"][number]["node"]["connect_group"]["user_connect_groupCollection"]["edges"][number]["node"]["user"],
  ) => {
    setSelectedShadowMember(member);
  };

  useEffect(() => {
    if (!isLoadingMembers && id) {
      const foundUser =
        members?.user_connect_groupCollection.edges[0]?.node.connect_group.user_connect_groupCollection.edges.find(
          (a) => a.node.user.id === id,
        )?.node.user ?? null;

      if (foundUser) {
        if (foundUser.id.startsWith("shadow|")) {
          setSelectedShadowMember(foundUser);
          setSelectedMember(null);
        } else {
          setSelectedMember(foundUser);
          setSelectedShadowMember(null);
        }
      }
    }
  }, [isLoadingMembers, id, members]);

  return (
    <>
      {isBinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-6">
            <CgSpinner className="animate-spin" color="#41FAD3" size={40} />
            <p className="text-center font-semibold">Binding Account...</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-5 px-4 pt-3">
        <div
          className={
            "flex flex-row items-center justify-between gap-2 rounded-lg bg-[#FFFDE7] p-2"
          }
        >
          <IoInformationCircle
            size={22}
            color={"#DBAE0F"}
            className={"h-6 w-6"}
          />

          <div className={"w-full text-sm text-[#DBAE0F]"}>
            After binding the account, the attendance and equipment training
            data will be merged.
          </div>
        </div>
        <div className={"text-sm text-[#92969D]"}>
          Please search for a shadow user to bind to this member.
        </div>

        <div className={"rounded-xl bg-white p-3"}>
          <div>
            <label className="text-sm">Existing Member</label>
            <MemberDropdown
              disabled={isLoadingMembers}
              members={members?.user_connect_groupCollection.edges ?? []}
              onSelect={handleSelectExist}
              selectedMember={selectedMember ?? undefined}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <IoLink className={"h-6 w-6 rotate-90"} color={"#000"} />
          </div>

          <div>
            <label className="text-sm">Shadow User</label>
            <MemberDropdown
              disabled={isLoadingMembers}
              shadowSelections
              members={members?.user_connect_groupCollection.edges ?? []}
              onSelect={handleSelectShadow}
              selectedMember={selectedShadowMember ?? undefined}
            />
          </div>
        </div>

        <div className={"fixed bottom-6 left-0 w-full px-6"}>
          <ActionButton
            label={"Bind Now"}
            extendedPaddingY
            onClick={() => {
              setIsDialogOpen(true);
            }}
            disabled={!selectedMember || !selectedShadowMember}
          />
        </div>

        <Dialog
          isOpen={isDialogOpen}
          title="Confirm Binding"
          centerTitle
          cancelText="Cancel"
          confirmText="Bind Account"
          onCancel={() => {
            setIsDialogOpen(false);
          }}
          onConfirm={async () => {
            if (!selectedMember || !selectedShadowMember) return;
            setIsDialogOpen(false);
            try {
              await bindShadowUser({
                shadowUserId: selectedShadowMember.id,
                targetUserId: selectedMember.id,
              });
              setIsPopupOpen(true);
            } catch (error) {
              console.error("Failed to bind accounts:", error);
              setIsPopupOpen(true);
            }
          }}
          vertical={true}
        >
          <div
            className={"mt-1 flex flex-col gap-2 rounded-lg bg-[#F4F4F4] p-3"}
          >
            <div className={"flex flex-col gap-1"}>
              <div className={"text-xs text-[#92969D]"}>Existing Member:</div>
              <div className={"flex items-center gap-2 overflow-hidden"}>
                <div className="min-h-10 min-w-10">
                  <ProfileIcon
                    isVerified={!selectedMember?.id.startsWith("shadow|")}
                    imageUrl={selectedMember?.avatar_url ?? "None"}
                    size={"mini"}
                  />
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-sm font-bold"}>
                    {selectedMember?.name ?? "None"}
                  </p>
                  <p className={"truncate text-[10px] text-[#92969D]"}>
                    {selectedMember?.id}
                  </p>
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-1"}>
              <div className={"text-xs text-[#92969D]"}>Shadow User:</div>
              <div className={"flex items-center gap-2 overflow-hidden"}>
                <div className="min-h-10 min-w-10">
                  <ProfileIcon
                    isVerified={!selectedShadowMember?.id.startsWith("shadow|")}
                    imageUrl={selectedShadowMember?.avatar_url ?? "None"}
                    size={"mini"}
                  />
                </div>
                <div className={"flex flex-col"}>
                  <p className={"text-sm font-bold"}>
                    {selectedShadowMember?.name ?? "None"}
                  </p>
                  <p className={"truncate text-[10px] text-[#92969D]"}>
                    {selectedShadowMember?.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={"mt-5 text-center text-sm text-[#92969D]"}>
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
          isError={isErrorBinding}
          errorText="Failed to bind account. Please try again."
          loadingText="Binding Account..."
          title="Account Successfully Bound"
          buttonText="Okay"
          customSubtitle="The data from both accounts has been successfully merged."
          customImage={
            <div className={"flex w-full flex-col items-center"}>
              <div className={"flex w-full items-center justify-around"}>
                <ProfileIcon
                  isVerified={!selectedMember?.id.startsWith("shadow|")}
                  imageUrl={selectedMember?.avatar_url ?? "None"}
                  size={"medium"}
                />
                <IoLink className={"h-6 w-6"} color={"#000"} />
                <ProfileIcon
                  isVerified={!selectedShadowMember?.id.startsWith("shadow|")}
                  imageUrl={selectedShadowMember?.avatar_url ?? "None"}
                  size={"medium"}
                />
              </div>
            </div>
          }
          loading={false}
        ></Popup>
      </div>
    </>
  );
}
