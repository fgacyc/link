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
import { useCGMembers } from "@/graphql/hooks/connect-group";
import { useUser } from "@/stores/useUser";
import { CgSpinner } from "react-icons/cg";
import { MemberListItem } from "@/components/MemberListItem";
import type { CGMemberUser } from "@/types/graphql";
import { CGHeader } from "./Header";
import { Link } from "react-router";

const filters = [
  {
    label: "All",
    filter: (a: CGMemberUser) => a,
  },
  {
    label: "Pending",
    filter: (a: CGMemberUser) => a,
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

// Role priority mapping for sorting (lower number = higher priority)
const rolePriority: Record<string, number> = {
  rol_fd249a3111bb4dceb57f: 1, // Connect Group Leader

  rol_930865293a64447e91ea: 2, // Pastor (highest priority if present)
  rol_482a585b8f764e19a90a: 3, // Team Leader
  rol_3646e05f277b4e218d00: 4, // Coach
  rol_77a177d4e38b4fbea80d: 5, // Small Group Leader
  rol_95fbb421e5054e3d8f2f: 6, // Ordinary Member
  rol_3de137627bc145d7b411: 7, // New Believer
  rol_1ecba215831345f48abf: 8, // New Friend
  pastoral_rol_9a0d9968: 9, // test11 (fallback)
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
  const { uid } = useUser();

  const { data } = useCGMembers(uid);

  const members = data?.user_connect_groupCollection.edges.flatMap((a) =>
    a.node.connect_group.user_connect_groupCollection.edges.map((b) => ({
      ...b.node.user,
      role: b.node.user_role,
    })),
  );

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

  return (
    <>
      <MemberEngagementLevelDrawer
        open={memberEngagementDrawerOpen}
        setOpen={setMemberEngagementDrawerOpen}
      />
      <AddMemberDrawer
        open={addMemberDrawerOpen}
        setOpen={setAddMemberDrawerOpen}
      />

      {/* <Drawer
        open={addMemberDrawerOpen}
        setOpen={setAddMemberDrawerOpen}
        title="Add Member"
        icon={<GroupAddRounded />}
      /> */}
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
            {members && members?.length > 0 ? (
              members
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
                .sort((a, b) => {
                  const priorityA = rolePriority[a.role] ?? 999;
                  const priorityB = rolePriority[b.role] ?? 999;
                  return priorityA - priorityB;
                })
                .map((member) => (
                  <MemberListItem key={member.id} member={member} />
                ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
                <p className="text-center">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
