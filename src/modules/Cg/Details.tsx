import {
  ContentCopyRounded,
  Flag,
  GroupAddRounded,
  GroupRounded,
  InfoOutlined,
  ManageAccountsRounded,
} from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { TitleContext } from "@/providers/TitleContextProvider";
import { useContext } from "react";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import { ProfileIcon } from "@/components/ProfileIcon";
import ActivityIndicator, {
  type ActivityIndicatorProps,
} from "@/components/ActivityIndicator";

import { MemberEngagementLevelDrawer } from "@/components/Drawer/MemberEngagementLevelDrawer";
import { AddMemberDrawer } from "@/components/Drawer/AddMemberDrawer";
import { useGraphQL } from "@/hooks/useGraphQL";
import { getCGMembers, getShadowUserCG } from "@/graphql/declaration";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/stores/useUser";
import type { MaybeShadowUser, User } from "@/types";
import { CgSpinner } from "react-icons/cg";

const filters = [
  {
    label: "All",
    filter: (a: MaybeShadowUser) => a,
  },
  {
    label: "Pending",
    filter: (a: MaybeShadowUser) => a,
  },
  // {
  //   label: "New Friend",
  //   filter: (a: MaybeShadowUser) => a.role === "NF",
  // },
  {
    label: "Unverified",
    filter: (a: MaybeShadowUser) => a.shadow === true,
  },
];

// const members: MaybeShadowUser[] = [
//   {
//     name: "Jing Ling",
//     avatar_url: "https://placehold.co/40x40?text=Jing+Ling",
//     role: "CGL",
//     lastAttended: new Date("2025-12-12"),
//     id: "1",
//     activityLevel: "high",
//     shadow: false,
//   },
//   {
//     name: "Kenny L",
//     avatar_url: "https://placehold.co/40x40?text=Kenny+L",
//     role: "OM",
//     lastAttended: new Date("2025-11-25"),
//     id: "2",
//     activityLevel: "medium",
//     shadow: false,
//   },
//   {
//     name: "John",
//     avatar_url: "https://placehold.co/40x40?text=John",
//     role: "NB",
//     lastAttended: new Date("2024-11-23"),
//     id: "3",
//     activityLevel: "low",
//     shadow: false,
//   },
//   {
//     name: "Peter",
//     avatar_url: "https://placehold.co/40x40?text=Peter",
//     role: "NF",
//     lastAttended: new Date("2024-11-23"),
//     id: "4",
//     activityLevel: "low",
//     shadow: false,
//   },
//   {
//     name: "Sandra",
//     avatar_url: "https://placehold.co/40x40?text=Sandra",
//     role: "NF",
//     lastAttended: new Date("2025-11-25"),
//     id: "5",
//     activityLevel: "none",
//     shadow: false,
//   },
//   {
//     name: "Daniel",
//     avatar_url: "https://placehold.co/40x40?text=Daniel",
//     role: "OM",
//     lastAttended: new Date("2025-11-25"),
//     id: "6",
//     activityLevel: "high",
//     shadow: true,
//   },
//   {
//     name: "Jenny",
//     avatar_url: "https://placehold.co/40x40?text=Jenny",
//     role: "NF",
//     lastAttended: new Date("2025-11-25"),
//     id: "7",
//     activityLevel: "none",
//     shadow: true,
//   },
// ];

const Details = () => {
  const { setTitle, setRightIcon, setTransparent, setFixed, setWhite } =
    useContext(TitleContext);

  const [memberEngagementDrawerOpen, setMemberEngagementDrawerOpen] =
    useState(false);
  const [addMemberDrawerOpen, setAddMemberDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const searchRef = useRef<HTMLInputElement>(null);
  const { UID, setCG } = useUser();

  const { ready, query } = useGraphQL();

  const { data } = useQuery({
    queryKey: ["user_connect_group"],
    queryFn: async () => {
      const data = (await query(getCGMembers, { uid: UID })) as {
        user_connect_groupCollection: {
          edges: {
            node: {
              connect_group: {
                id: string;
                user_connect_groupCollection: {
                  edges: {
                    node: {
                      user: User;
                    };
                  }[];
                };
              };
            };
          }[];
        };
      };

      setCG(
        data.user_connect_groupCollection.edges[0]?.node.connect_group.id ?? "",
      );
      return data;
    },
    enabled: ready,
  });

  const cgid =
    data?.user_connect_groupCollection.edges[0]?.node.connect_group.id;

  const { data: shadowUserData } = useQuery({
    queryKey: ["shadow_user_connect_group"],
    queryFn: async () => {
      const data = (await query(getShadowUserCG, { cgid })) as {
        shadow_userCollection: {
          edges: {
            node: User & {
              nodeId: string;
              pastoral_status: string;
            };
          }[];
        };
      };
      return data;
    },
    enabled: ready && !!cgid,
  });

  const members: MaybeShadowUser[] =
    data?.user_connect_groupCollection.edges.flatMap((a) =>
      a.node.connect_group.user_connect_groupCollection.edges.map((b) => ({
        ...b.node.user,
        shadow: false,
        pastoral_status: null,
      })),
    ) ?? [];

  const shadowMembers: MaybeShadowUser[] =
    shadowUserData?.shadow_userCollection.edges.map((a) => ({
      ...a.node,
      id: a.node.nodeId,
      role: a.node.pastoral_status,
      shadow: true,
      pastoral_status: null,
    })) ?? [];

  const combinedMembers = useMemo(
    () => [...members, ...shadowMembers],
    [members, shadowMembers],
  );

  useEffect(() => {
    setTitle("CG Details");
    setTransparent(true);
    setWhite(true);
    setFixed(true);
    setRightIcon(<ManageAccountsRounded className="text-dark-neon-green" />);
  }, [setTitle, setRightIcon, setTransparent, setWhite]);

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
        <div className="header-bg flex w-full flex-col gap-3 rounded-b-[18px] px-4 pt-19 pb-5 text-white">
          <div className="flex w-full flex-col gap-5 pt-11">
            <p className="text-sm font-bold">Satellite: Kuchai</p>
            <img
              src="https://placehold.co/350x170?text=CG+Cover+Photo"
              alt="Cover"
              className="w-full rounded-sm object-cover"
            />
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-lg font-bold">JingLing's Group</p>
            <Button
              label="Numbers"
              onClick={() => {
                console.log("numbers");
              }}
            />
          </div>
          <div className="text-info-gray flex flex-col gap-1.5">
            <div className="flex flex-row items-center gap-1">
              <p className="text-sm">{combinedMembers.length ?? 0}</p>
              <GroupRounded
                sx={{
                  fontSize: 12,
                }}
              />
            </div>
            <div className="flex flex-row items-center gap-1">
              <p className="text-sm">CG Name: CYC123G</p>
              <ContentCopyRounded
                sx={{
                  fontSize: 14,
                }}
                role="button"
              />
            </div>
            <div className="flex flex-row items-center gap-1.5">
              <p className="text-sm">Kuchai</p>
              <div className="bg-info-gray h-[8px] w-[1px]" />
              <p className="text-sm">Daniel Seakny Team</p>
              <div className="bg-info-gray h-[8px] w-[1px]" />
              <p className="text-sm">M2 Junior</p>
            </div>
          </div>
          <p className="text-sm">
            This a a warm group, lorem Ipsum dasd as sa dsa fogksa dosa doas
          </p>
        </div>

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
              className="placeholder:text-gray w-full text-sm text-black"
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
            {combinedMembers.length > 0 ? (
              combinedMembers
                .filter((a) => {
                  if (!selectedFilter) return a;
                  return filters
                    .find((b) => b.label === selectedFilter)
                    ?.filter(a);
                })
                .filter((a) =>
                  a.name.toLowerCase().includes(searchText.toLowerCase()),
                )
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-row items-center justify-between py-2"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <ProfileIcon
                        isVerified={!member.shadow}
                        imageUrl={
                          member.avatar_url ??
                          `https://placehold.co/40x40?text=${member.name.replaceAll(" ", "+")}`
                        }
                        size="mini"
                      />
                      <div className="flex flex-col">
                        <div className="flex flex-row items-center gap-1">
                          {member.pastoral_status === "CGL" ? (
                            <Flag className="text-dark-neon-green size-[16px]" />
                          ) : null}
                          <p className="text-sm font-semibold">
                            {member.name}
                            {member.id === "1" ? (
                              <span className="text-dark-neon-green text-[12px] font-normal">
                                {" "}
                                (Me)
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <p className="text-gray text-[10px]">
                          Last attended date:{" "}
                          {/* {member.lastAttended.toLocaleDateString()} */}
                        </p>
                      </div>
                    </div>
                    {/* <ActivityIndicator level={member.activityLevel} /> */}
                  </div>
                ))
            ) : (
              <div className="justfiy-center flex flex-col items-center gap-2">
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
