import React, { useContext, useEffect, useState } from "react";
import Attendance from "../Attendance";
import { TitleContext } from "@/providers/TitleContextProvider";
import { ProfileHeader } from "./Header";
import { MoreHoriz } from "@mui/icons-material";
import { EditMemberProfileDrawer } from "@/components/Drawer/EditMemberProfile";

type TabType = "progress" | "attendance";

const tabs: {
  label: string;
  value: TabType;
}[] = [
  {
    label: "Attendance",
    value: "attendance",
  },
  // {
  //   label: "Progress",
  //   value: "progress",
  // },
];

const Profile: React.FC = () => {
  const { setTitle, setFixed, setRightIcon, setBg, setWhite } =
    useContext(TitleContext);

  const [editMemberProfileDrawerOpen, setEditMemberProfileDrawerOpen] =
    useState(false);

  useEffect(() => {
    setTitle("Member Profile");
    setFixed(true);
    setRightIcon(null);
    setBg("#242424");
    setWhite(true);
    setRightIcon(
      <MoreHoriz
        className="text-dark-neon-green"
        onClick={() => setEditMemberProfileDrawerOpen(true)}
      />,
    );

    return () => {
      setRightIcon(null);
    };
  }, [
    setRightIcon,
    setEditMemberProfileDrawerOpen,
    setTitle,
    setFixed,
    setBg,
    setWhite,
  ]);

  const [activeTab, setActiveTab] = useState<TabType>("attendance");

  return (
    <>
      <EditMemberProfileDrawer
        open={editMemberProfileDrawerOpen}
        setOpen={setEditMemberProfileDrawerOpen}
      />
      <ProfileHeader />
      <div className="mb-px flex flex-col pt-5">
        {/* Tab Navigation - 标签导航 */}
        <div className="flex flex-row gap-4 bg-white px-4 pt-3">
          {tabs.map((tab) => {
            const active = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                className={`relative pb-2 text-sm ${active ? "text-dark" : "text-gray"} font-bold`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
                {tab.value === activeTab && (
                  <div className="border-dark absolute -bottom-[2px] left-1/2 w-5 -translate-x-1/2 rounded-full border-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* {activeTab === "progress" ? <Progress /> : <Attendance />} */}
      <Attendance />
    </>
  );
};

export default Profile;
