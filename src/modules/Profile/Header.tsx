import ActivityIndicator from "@/components/ActivityIndicator";
import { ProfileIcon } from "@/components/ProfileIcon";
import { RoleTag } from "@/components/RoleTag";
import {
  useLatestCGAttendance,
  usePastoralRole,
  useSatellite,
  useSinglePerson,
} from "@/graphql";
import { useUser } from "@/stores/useUser";
import { getLevelfromAttendanceDate } from "@/utils";
import { Link, useParams } from "react-router";

export const ProfileHeader: React.FC = () => {
  const { id } = useParams();
  const { user } = useUser();

  const { data: selfPastoralRoleData } = usePastoralRole(user?.id ?? "");
  const selfPastoralRole =
    selfPastoralRoleData?.user_connect_groupCollection.edges[0]?.node
      .pastoral_role.id;

  const { data: member } = useSinglePerson(id ?? "");

  const cgInfo =
    member?.user_connect_groupCollection.edges[0]?.node.connect_group;
  const pastoralRoleId =
    member?.user_connect_groupCollection.edges[0]?.node.pastoral_role.id;

  const { data: satellite } = useSatellite(cgInfo?.satellite_id ?? "");
  const { data: attendance } = useLatestCGAttendance(member?.id ?? "");
  const attendanceDate =
    attendance?.latest_attendance.edges[0]?.node.created_at;

  const metadata = (member?.metadata ? JSON.parse(member?.metadata) : {}) as {
    remark: string;
  };

  return (
    <div className="header-bg flex w-full flex-col gap-3 rounded-b-[18px] px-4 pt-19 pb-5 text-white">
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex flex-row items-center gap-2">
          <ProfileIcon
            hideBorder
            imageUrl={member?.avatar_url ?? ""}
            isVerified={!member?.id.startsWith("shadow|")}
          />
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-1">
              <RoleTag
                flagSize={"small"}
                borderColor="#fff"
                pastoralRoleId={pastoralRoleId ?? ""}
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
          {member?.phone_number ? (
            <div className="flex flex-row items-center gap-1">
              <p className="max-w-[85px] min-w-[85px] text-xs text-white/80">
                Contact No:
              </p>
              <Link to={`tel:${member?.phone_number}`}>
                <p className="text-neon-green w-full text-xs font-semibold underline">
                  {member?.phone_number}
                </p>
              </Link>
            </div>
          ) : null}
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
      <div className="flex w-full flex-col gap-1 rounded-xl bg-white/[0.04] p-2">
        <p className="font-bold text-white">{cgInfo?.name}</p>
        <div className="flex w-full flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <p className="max-w-[85px] min-w-[85px] text-xs text-white/80">
              Satellite:
            </p>
            <p className="w-full text-xs font-semibold">
              {satellite?.satelliteCollection.edges[0]?.node.name ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
      {selfPastoralRole === "rol_fd249a3111bb4dceb57f" && metadata.remark && (
        <div className="flex w-full flex-col gap-1 rounded-xl bg-white/[0.04] p-2">
          <div className="flex w-full flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <p className="w-full text-xs">{metadata.remark}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
