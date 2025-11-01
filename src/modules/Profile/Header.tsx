import ActivityIndicator from "@/components/ActivityIndicator";
import { ProfileIcon } from "@/components/ProfileIcon";
import { RoleTag } from "@/components/RoleTag";
import {
  useLatestCGAttendance,
  usePastoralRole,
  useSatellite,
  useSinglePerson,
} from "@/graphql";
import {
  useCGLeader,
  useCancelCGInvite,
  useAcceptCGInvite,
} from "@/graphql/hooks/connect-group";
import { useUser } from "@/stores/useUser";
import { getLevelfromAttendanceDate, hasElevatedPermissions } from "@/utils";
import { Link, useNavigate, useParams } from "react-router";
import { useState } from "react";
import Dialog from "@/components/Dialog/Dialog";
import toast from "react-hot-toast";
import Popup from "@/components/Popup/Popup";

export const ProfileHeader: React.FC = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isCancelledPopupOpen, setIsCancelledPopupOpen] = useState(false);
  const [cancelledCGName, setCancelledCGName] = useState<string>("");
  const [wasIncomingRequest, setWasIncomingRequest] = useState(false);
  const [isAcceptPopupOpen, setIsAcceptPopupOpen] = useState(false);
  const [isAcceptedPopupOpen, setIsAcceptedPopupOpen] = useState(false);
  const [acceptedCGName, setAcceptedCGName] = useState<string>("");

  const navigate = useNavigate();

  const { data: selfPastoralRoleData } = usePastoralRole(user?.id ?? "");
  const selfPastoralRoleWeight =
    selfPastoralRoleData?.user_connect_groupCollection.edges[0]?.node
      .pastoral_role?.weight;
  const selfCGId = user?.cg;

  const { data: member } = useSinglePerson(id ?? "");

  const cgInfo =
    member?.user_connect_groupCollection?.edges[0]?.node?.connect_group;
  const pastoralRoleWeight =
    member?.user_connect_groupCollection?.edges[0]?.node?.pastoral_role?.weight;

  const { data: satellite } = useSatellite(cgInfo?.satellite_id ?? "");
  const { data: attendance } = useLatestCGAttendance(member?.id ?? "");
  const attendanceDate =
    attendance?.latest_attendance.edges[0]?.node.created_at;

  const metadata = (member?.metadata ? JSON.parse(member?.metadata) : {}) as {
    remarks: string;
    occupation: string;
    contact: string;
  };

  // Check if member has pending invite
  const hasPendingInvite =
    (member?.connect_group_inviteCollection?.edges?.length ?? 0) > 0;

  // Get pending invite details
  const pendingInvite = member?.connect_group_inviteCollection?.edges[0]?.node;
  const destinationCG = pendingInvite?.connect_group;

  // Determine if this is an incoming or outgoing request
  // Incoming: member wants to join MY CG (destinationCG matches my CG)
  // Outgoing: member is in MY CG and wants to leave to another CG
  const isIncomingRequest = destinationCG?.id === selfCGId;
  const isOutgoingRequest =
    cgInfo?.id === selfCGId && destinationCG?.id !== selfCGId;

  // Fetch leader of destination CG
  const { data: leaderData, isLoading: isLeaderLoading } = useCGLeader(
    destinationCG?.id ?? "",
  );
  const destinationLeader =
    leaderData?.user_connect_groupCollection.edges[0]?.node.user;

  // Cancel invite mutation
  const { mutateAsync: cancelInvite, isPending: isCancelling } =
    useCancelCGInvite();

  // Accept invite mutation
  const { mutateAsync: acceptInvite, isPending: isAccepting } =
    useAcceptCGInvite();

  return (
    <>
      <div className="header-bg flex w-full flex-col gap-3 rounded-b-[18px] px-4 pt-19 pb-5 text-white">
        <div className="flex flex-row items-center justify-between py-2">
          <div className="flex flex-row items-center gap-2">
            <ProfileIcon
              hideBorder
              imageUrl={member?.avatar_url ?? ""}
              isVerified={!member?.id.startsWith("shadow|")}
              hasPendingInvite={hasPendingInvite}
            />
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-1">
                <RoleTag
                  flagSize={"small"}
                  borderColor="#fff"
                  pastoralRoleWeight={pastoralRoleWeight}
                />
                <p className="font-semibold">{member?.name}</p>
                {id === user?.id ? (
                  <span className="text-dark-neon-green text-[12px] font-normal">
                    {" "}
                    (Me)
                  </span>
                ) : null}
              </div>
              <p className="text-[10px] text-white/60">
                Last Attended Date:{" "}
                {attendanceDate
                  ? new Date(attendanceDate).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
              <p className="text-[10px] text-white/60">
                CG ID:{" "}
                {
                  member?.user_connect_groupCollection.edges[0]?.node
                    .connect_group.id
                }
              </p>
            </div>
          </div>
          <ActivityIndicator
            level={getLevelfromAttendanceDate(attendanceDate ?? "")}
          />
        </div>
        <div className="flex w-full flex-col gap-1 rounded-xl bg-white/[0.04] p-2">
          <p className="text-xs font-light text-white">
            Satellite:{" "}
            {satellite?.satelliteCollection.edges[0]?.node.name ?? "N/A"}
          </p>
          <p className="font-bold text-white">{cgInfo?.name}</p>
          {hasElevatedPermissions(selfPastoralRoleWeight) &&
            hasPendingInvite &&
            isOutgoingRequest && (
              <div className="flex w-full flex-row items-center justify-between rounded-xl border border-white/[0.1] bg-white/[0.04] px-2">
                <p className="text-xs">
                  Assigning to{" "}
                  <span className="font-bold">
                    {destinationCG?.name ?? "N/A"}
                  </span>
                </p>
                <button
                  onClick={() => {
                    console.log("Cancel");
                    // Store data when dialog opens
                    setWasIncomingRequest(isIncomingRequest);
                    setCancelledCGName(destinationCG?.name ?? "N/A");
                    setIsCancelPopupOpen(true);
                  }}
                  className="px-2.5 py-1 text-sm font-semibold text-[#F16767]"
                >
                  Cancel
                </button>
              </div>
            )}
          {hasElevatedPermissions(selfPastoralRoleWeight) &&
            hasPendingInvite &&
            isIncomingRequest && (
              <div className="flex w-full flex-row items-center justify-between rounded-xl border border-white/[0.1] bg-white/[0.04] px-2">
                <div className="flex flex-col gap-1 py-2">
                  <p className="text-xs">Incoming request to join your group</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      console.log("Decline");
                      // Store data when dialog opens
                      setWasIncomingRequest(isIncomingRequest);
                      setCancelledCGName(destinationCG?.name ?? "N/A");
                      setIsCancelPopupOpen(true);
                    }}
                    className="px-2.5 py-1 text-sm font-semibold text-[#F16767]"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      console.log("Accept");
                      // Store data when dialog opens
                      setAcceptedCGName(destinationCG?.name ?? "N/A");
                      setIsAcceptPopupOpen(true);
                    }}
                    className="px-2.5 py-1 text-sm font-semibold text-[#22c55e]"
                  >
                    Accept
                  </button>
                </div>
              </div>
            )}
        </div>
        <div className="flex w-full flex-col gap-1 rounded-xl bg-white/[0.04] p-2">
          <p className="font-bold text-white">Personal Info</p>
          <div className="flex w-full flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <p className="max-w-[85px] min-w-[85px] text-xs text-white/80">
                Date of birth:
              </p>
              <p className="w-full text-xs font-semibold text-white">
                {member?.date_of_birth
                  ? `${new Date(member.date_of_birth).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )} (${new Date().getFullYear() - new Date(member.date_of_birth).getFullYear()} Y.O.)`
                  : "N/A"}
              </p>
            </div>
            {(() => {
              const phoneNumber =
                member?.phone_number && member.phone_number.trim() !== ""
                  ? member.phone_number
                  : metadata.contact && metadata.contact.trim() !== ""
                    ? metadata.contact
                    : null;
              return phoneNumber ? (
                <div className="flex flex-row items-center gap-1">
                  <p className="max-w-[85px] min-w-[85px] text-xs text-white/80">
                    Contact No:
                  </p>
                  <Link to={`tel:${phoneNumber}`}>
                    <p className="text-neon-green w-full text-xs font-semibold underline">
                      {phoneNumber}
                    </p>
                  </Link>
                </div>
              ) : null;
            })()}
            {member?.email ? (
              <div className="flex flex-row items-center gap-1">
                <p className="max-w-[85px] min-w-[85px] text-xs text-white/80">
                  Email:
                </p>
                <Link to={`mailto:${member?.email}`}>
                  <p className="text-neon-green w-full text-xs font-semibold underline">
                    {member?.email ?? "N/A"}
                  </p>
                </Link>
              </div>
            ) : null}
            <div className="flex flex-row items-center gap-1">
              <p className="max-w-[85px] min-w-[85px] text-xs text-white/80">
                Register Date:
              </p>
              <p className="w-full text-xs font-semibold">
                {member?.created_at
                  ? new Date(member.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {hasElevatedPermissions(selfPastoralRoleWeight) &&
          (metadata.remarks || metadata.occupation) && (
            <div className="flex w-full flex-col gap-1 rounded-xl bg-white/[0.04] p-2">
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-row items-center gap-1">
                  <p className="max-w-[85px] min-w-[85px] text-xs text-white/80">
                    Remarks:
                  </p>
                  <p className="w-full text-xs font-semibold">
                    {metadata.remarks ?? "N/A"}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <p className="max-w-[85px] min-w-[85px] text-xs text-white/80">
                    Occupation:
                  </p>
                  <p className="w-full text-xs font-semibold">
                    {metadata.occupation ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
      <Dialog
        isOpen={isCancelPopupOpen}
        vertical
        centerTitle
        confirmText={
          isCancelling
            ? wasIncomingRequest
              ? "Declining..."
              : "Cancelling..."
            : wasIncomingRequest
              ? "Decline Request"
              : "Cancel to Assign"
        }
        cancelText="Discard"
        title={
          wasIncomingRequest
            ? "Decline Incoming Request"
            : "Cancel to Assign Group"
        }
        onCancel={() => {
          if (isCancelling) return; // Prevent closing during mutation
          setIsCancelPopupOpen(false);
        }}
        onConfirm={async () => {
          if (!member?.id) {
            toast.error("User ID not found");
            return;
          }

          try {
            await cancelInvite({ user_id: member.id });
            setIsCancelledPopupOpen(true);
            setIsCancelPopupOpen(false);
          } catch (error) {
            setIsCancelledPopupOpen(false);
            setIsCancelPopupOpen(false);
            console.error("Error cancelling invite:", error);
            toast.error(
              `Failed to ${wasIncomingRequest ? "decline" : "cancel"} invite. Please try again.`,
            );
          }
        }}
      >
        <div className="flex flex-col items-center gap-5 pt-2">
          <ProfileIcon
            imageUrl={member?.avatar_url ?? ""}
            size="xlarge"
            isVerified={!member?.id.startsWith("shadow|")}
          />
          <p className="text-gray text-center text-sm">
            {wasIncomingRequest
              ? `Are you sure you want to decline ${member?.name ?? "this member"}'s request to join `
              : "Are you sure you want to cancel assigning this member to "}
            <span className="font-bold text-black">{cancelledCGName}</span>?
          </p>
          <div className="flex w-full flex-col gap-2.5 rounded-lg bg-[#f4f4f4] p-3 text-sm">
            <div className="flex flex-row items-center justify-between gap-2">
              <p className="text-gray max-w-[95px] min-w-[95px] text-xs">
                {wasIncomingRequest ? "Current CG:" : "Leader Name:"}
              </p>
              <p className="w-full text-right text-xs">
                {wasIncomingRequest
                  ? (cgInfo?.name ?? "N/A")
                  : isLeaderLoading
                    ? "Loading..."
                    : (destinationLeader?.name ?? "N/A")}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-gray max-w-[95px] min-w-[95px] text-xs">
                {wasIncomingRequest ? "Requested CG:" : "Group Name:"}
              </p>
              <p className="w-full text-right text-xs">{cancelledCGName}</p>
            </div>
          </div>
        </div>
      </Dialog>

      <Popup
        isOpen={isCancelledPopupOpen}
        onClose={() => {
          setIsCancelledPopupOpen(false);
          if (wasIncomingRequest) {
            navigate(`/cg`);
          }
        }}
        title=""
        buttonText="Okay"
      >
        <div className="flex flex-col items-center gap-5">
          <img
            src="/task_done.png"
            alt="Cancelled"
            className="w-[200px] object-contain"
          />
          <div className="flex w-full flex-col items-center gap-1">
            <p className="text-xl font-bold text-black">
              {wasIncomingRequest ? "Request Declined" : "Cancelled to Assign"}
            </p>
            <p className="text-gray text-sm">
              {wasIncomingRequest ? (
                <>
                  You have declined{" "}
                  <span className="font-bold text-black">
                    {member?.name ?? "N/A"}
                  </span>
                  's request to join{" "}
                  <span className="font-bold text-black">
                    {cancelledCGName}
                  </span>
                </>
              ) : (
                <>
                  You have cancelled to assign{" "}
                  <span className="font-bold text-black">
                    {member?.name ?? "N/A"}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-black">
                    {cancelledCGName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </Popup>

      <Dialog
        isOpen={isAcceptPopupOpen}
        vertical
        centerTitle
        confirmText={isAccepting ? "Accepting..." : "Accept Request"}
        cancelText="Cancel"
        title="Accept Incoming Request"
        onCancel={() => {
          if (isAccepting) return; // Prevent closing during mutation
          setIsAcceptPopupOpen(false);
        }}
        onConfirm={async () => {
          if (!member?.id || !destinationCG?.id) {
            toast.error("Missing required information");
            return;
          }

          try {
            await acceptInvite({
              user_id: member.id,
              connect_group_id: destinationCG.id,
            });
            setIsAcceptedPopupOpen(true);
            setIsAcceptPopupOpen(false);
            toast.success("Request accepted successfully!");
          } catch (error) {
            setIsAcceptedPopupOpen(false);
            setIsAcceptPopupOpen(false);
            console.error("Error accepting invite:", error);
            toast.error("Failed to accept request. Please try again.");
          }
        }}
      >
        <div className="flex flex-col items-center gap-5 pt-2">
          <ProfileIcon
            imageUrl={member?.avatar_url ?? ""}
            size="xlarge"
            isVerified={!member?.id.startsWith("shadow|")}
          />
          <p className="text-gray text-center text-sm">
            Are you sure you want to accept{" "}
            <span className="font-bold text-black">
              {member?.name ?? "this member"}
            </span>
            's request to join{" "}
            <span className="font-bold text-black">{acceptedCGName}</span>?
          </p>
          <div className="flex w-full flex-col gap-2.5 rounded-lg bg-[#f4f4f4] p-3 text-sm">
            <div className="flex flex-row items-center justify-between gap-2">
              <p className="text-gray max-w-[95px] min-w-[95px] text-xs">
                Current CG:
              </p>
              <p className="w-full text-right text-xs">
                {cgInfo?.name ?? "N/A"}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              <p className="text-gray max-w-[95px] min-w-[95px] text-xs">
                Requested CG:
              </p>
              <p className="w-full text-right text-xs">{acceptedCGName}</p>
            </div>
          </div>
        </div>
      </Dialog>

      <Popup
        isOpen={isAcceptedPopupOpen}
        onClose={() => {
          setIsAcceptedPopupOpen(false);
        }}
        title=""
        buttonText="Okay"
      >
        <div className="flex flex-col items-center gap-5">
          <img
            src="/task_done.png"
            alt="Accepted"
            className="w-[200px] object-contain"
          />
          <div className="flex w-full flex-col items-center gap-1">
            <p className="text-xl font-bold text-black">Request Accepted</p>
            <p className="text-gray text-sm">
              You have accepted{" "}
              <span className="font-bold text-black">
                {member?.name ?? "N/A"}
              </span>
              's request to join{" "}
              <span className="font-bold text-black">{acceptedCGName}</span>
            </p>
          </div>
        </div>
      </Popup>
    </>
  );
};
