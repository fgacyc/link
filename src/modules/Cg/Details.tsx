import {
  GroupAddRounded,
  InfoOutlined,
  ManageAccountsRounded,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext } from "react";
import { Icon } from "@/components/Icon";

import { MemberEngagementLevelDrawer } from "@/components/Drawer/MemberEngagementLevelDrawer";
import { AddMemberDrawer } from "@/components/Drawer/AddMemberDrawer";
import {
  useCGMembers,
  usePastoralRole,
  usePendingCGInvites,
} from "@/graphql/hooks/connect-group";
import { useUser } from "@/stores/useUser";
import { CgSpinner } from "react-icons/cg";
import { MemberListItem } from "@/components/MemberListItem";
import type { CGMemberUser } from "@/types/graphql";
import { CGHeader } from "./Header";
import { Link } from "react-router";
import { hasElevatedPermissions } from "@/utils";
import { PendingInvitesProvider } from "@/providers/PendingInvitesProvider";

const createFilters = (pendingUserIds: Set<string>) => [
  {
    label: "All",
    filter: (a: CGMemberUser) => a,
  },
  {
    label: "Pending",
    filter: (a: CGMemberUser) => pendingUserIds.has(a.id),
  },
  // {
  //   label: "New Friend",
  //   filter: (a: CGMemberUser) => a.role === "NF",
  // },
  {
    label: "Unverified",
    filter: (a: CGMemberUser) => a.id.startsWith("shadow|"),
  },
];

// Sort members by pastoral role weight
// Priority: weight 4 first, then ascending (1, 2, 3, 5, 6, 7, 8...)
const sortByRoleWeight = (a: { weight?: number }, b: { weight?: number }) => {
  const weightA = a.weight ?? 999;
  const weightB = b.weight ?? 999;

  // Both have weight 4 - maintain order
  if (weightA === 4 && weightB === 4) return 0;
  // A has weight 4 - A comes first
  if (weightA === 4) return -1;
  // B has weight 4 - B comes first
  if (weightB === 4) return 1;

  // Neither has weight 4 - sort ascending
  return weightA - weightB;
};

const Details = () => {
  const { setTitle, setRightIcon, setBg, setFixed, setWhite } =
    useContext(TitleContext);

  const [memberEngagementDrawerOpen, setMemberEngagementDrawerOpen] =
    useState(false);
  const [addMemberDrawerOpen, setAddMemberDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const searchRef = useRef<HTMLInputElement>(null);
  const { uid, user } = useUser();

  const { data } = useCGMembers(uid);

  // Get current CG ID
  const currentCgId =
    data?.user_connect_groupCollection.edges[0]?.node.connect_group.id ?? "";

  // Fetch pending invites TO this CG (incoming invites)
  const { data: incomingInvitesData } = usePendingCGInvites(currentCgId);

  const members = data?.user_connect_groupCollection.edges.flatMap((a) =>
    a.node.connect_group.user_connect_groupCollection.edges.map((b) => ({
      ...b.node.user,
      role: b.node.user_role,
      weight: b.node.pastoral_role?.weight,
    })),
  );

  // Get incoming pending members (people who want to join this CG)
  const incomingPendingMembers: Array<
    CGMemberUser & { weight?: number; isPendingIncoming?: boolean }
  > =
    incomingInvitesData?.connect_group_inviteCollection.edges.map((edge) => ({
      id: edge.node.user.id,
      name: edge.node.user.name ?? null,
      avatar_url: (edge.node.user.avatar_url ?? null) as string | null,
      deleted: edge.node.user.deleted as boolean,
      role: "Pending",
      weight: 999, // Low priority for sorting
      isPendingIncoming: true, // Flag to identify incoming pending members
    })) ?? [];

  // Create a map of user_id to pending invite from the nested data
  const pendingInvitesEntries =
    data?.user_connect_groupCollection.edges.flatMap((a) =>
      a.node.connect_group.user_connect_groupCollection.edges
        .filter(
          (b) => b.node.user.connect_group_inviteCollection.edges.length > 0,
        )
        .map((b) => {
          const invite =
            b.node.user.connect_group_inviteCollection.edges[0]?.node;
          if (!invite) return null;
          return [b.node.user.id, invite] as const;
        })
        .filter(
          (
            entry,
          ): entry is [
            string,
            {
              cg_id: string;
              status: string;
              created_at: string;
              connect_group: {
                id: string;
                name: string;
                satellite: { id: string; name: string };
              };
            },
          ] => entry !== null,
        ),
    ) ?? [];

  const pendingInvitesMap = new Map(pendingInvitesEntries);

  // Add incoming pending invites to the map
  incomingInvitesData?.connect_group_inviteCollection.edges.forEach((edge) => {
    pendingInvitesMap.set(edge.node.user.id, {
      cg_id: edge.node.cg_id,
      status: edge.node.status,
      created_at: edge.node.created_at,
      connect_group: edge.node.connect_group,
    });
  });

  // Create a set of user IDs with pending invites for filtering
  const pendingUserIds = new Set(pendingInvitesMap.keys());

  // Merge current members with incoming pending members
  const allMembers = [...(members ?? []), ...incomingPendingMembers];

  // Create filters with pending user IDs
  const filters = createFilters(pendingUserIds);

  useEffect(() => {
    setTitle("CG Details");
    setBg("#242424");
    setWhite(true);
    setFixed(true);
    setRightIcon(
      <Link to="/cg/manage" viewTransition>
        <ManageAccountsRounded className="text-dark-neon-green" />
      </Link>,
    );
  }, [setTitle, setRightIcon, setBg, setWhite, setFixed]);

  const { data: pastoralRole } = usePastoralRole(user?.id ?? "");
  const pastoralRoleWeight =
    pastoralRole?.user_connect_groupCollection.edges[0]?.node.pastoral_role
      .weight;
  const hasPermissions = hasElevatedPermissions(pastoralRoleWeight ?? 0);

  return (
    <PendingInvitesProvider pendingInvitesMap={pendingInvitesMap}>
      <MemberEngagementLevelDrawer
        open={memberEngagementDrawerOpen}
        setOpen={setMemberEngagementDrawerOpen}
      />
      <AddMemberDrawer
        open={addMemberDrawerOpen}
        setOpen={setAddMemberDrawerOpen}
      />

      <div className="h-full w-full">
        <CGHeader members={members ?? []} />
        <div className="flex w-full flex-col gap-3 px-4 pt-3">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex w-full flex-row items-center gap-1">
              <p className="text-base font-bold">My Members</p>
              <InfoOutlined
                role="button"
                onClick={() => {
                  setMemberEngagementDrawerOpen(true);
                }}
                sx={{
                  fontSize: 24,
                }}
              />
            </div>
            {hasPermissions && (
              <GroupAddRounded
                role="button"
                onClick={() => {
                  setAddMemberDrawerOpen(true);
                }}
                sx={{
                  fontSize: 24,
                }}
                className="text-dark-neon-green"
              />
            )}
          </div>
          <div className="flex flex-row items-center gap-2 rounded-sm border border-[rgba(0,0,0,0.13)] px-3 py-2.5">
            <input
              ref={searchRef}
              type="text"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              placeholder="Search member"
              className="placeholder:text-gray text-dark w-full text-sm"
            />
            <Icon
              onClick={() => {
                searchRef.current?.focus();
              }}
              iconName="search"
              type="outlined"
              size={20}
            />
          </div>
          <div className="flex flex-row items-center gap-2 overflow-x-auto">
            {filters.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  setSelectedFilter(a.label);
                }}
                className={`rounded-sm border px-2.75 py-1 text-sm ${selectedFilter === a.label ? "bg-dark border-dark text-white" : "text-gray border-gray"}`}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="flex h-full w-full flex-grow flex-col">
            {allMembers && allMembers?.length > 0 ? (
              allMembers
                .filter((a) => {
                  if (!selectedFilter) return a;
                  return filters
                    .find((b) => b.label === selectedFilter)
                    ?.filter(a);
                })
                .filter((a) =>
                  (a.name ?? "")
                    .toLowerCase()
                    .includes(searchText.toLowerCase()),
                )
                .sort(sortByRoleWeight)
                .map((member) => {
                  const pendingInvite = pendingInvitesMap.get(member.id);
                  return (
                    <MemberListItem
                      key={member.id}
                      member={member}
                      pendingInvite={pendingInvite}
                    />
                  );
                })
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
                <p className="text-center">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PendingInvitesProvider>
  );
};

export default Details;
