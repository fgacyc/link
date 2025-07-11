import { ProfileIcon } from "./ProfileIcon";
import { Flag } from "@mui/icons-material";
import { useLatestCGAttendance } from "@/graphql/hooks/attendance";
import type { CGMemberUser } from "@/types/graphql";
import { usePastoralRole } from "@/graphql";
import { useUser } from "@/stores/useUser";
import ActivityIndicator from "./ActivityIndicator";
import { getLevelfromAttendanceDate } from "@/utils/index";
import { Link } from "react-router";
import { RoleTag } from "./RoleTag";

export const MemberListItem: React.FC<{
  member: CGMemberUser;
}> = ({ member }) => {
  const { user } = useUser();
  const { data } = useLatestCGAttendance(member.id);
  const { data: pastoralRole } = usePastoralRole(member.id);
  const pastoralRoleId =
    pastoralRole?.user_connect_groupCollection.edges[0]?.node.pastoral_role.id;

  if (!member) return null;

  const attendanceData = data?.latest_attendance.edges[0]?.node;
  const attendanceDate = attendanceData?.created_at;

  // Determine if this is a shadow user
  const isShadowUser = member.id.startsWith("shadow|");

  return (
    <Link to={`/cg/profile/${member.id}`} viewTransition>
      <div
        key={member.id}
        className="flex flex-row items-center justify-between py-2"
      >
        <div className="flex flex-row items-center gap-2">
          <ProfileIcon
            isVerified={!isShadowUser}
            imageUrl={
              member.avatar_url ??
              `https://placehold.co/40x40?text=${member.name?.replaceAll(" ", "+") ?? "User"}`
            }
            size="mini"
          />
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-1">
              <RoleTag pastoralRoleId={pastoralRoleId ?? ""} />
              <p className="text-sm font-semibold">
                {member.name}
                {member.id === user?.id ? (
                  <span className="text-dark-neon-green text-[12px] font-normal">
                    {" "}
                    (Me)
                  </span>
                ) : null}
              </p>
            </div>
            <p className="text-gray text-[10px]">
              Last attended date:{" "}
              {attendanceDate
                ? new Date(attendanceDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
        <ActivityIndicator
          level={getLevelfromAttendanceDate(attendanceDate ?? "")}
        />
      </div>
    </Link>
  );
};
