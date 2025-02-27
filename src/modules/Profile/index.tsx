import React, { useState } from "react";
import Progress from "../Progress";
import Attendance from "../Attendace";

/**
 * Profile Component - Displays user attendance and progress information
 * 个人资料组件 - 显示用户出勤和进度信息
 */
type TabType = "progress" | "attendance";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("attendance");

  return (
    <div className="mx-auto max-w-3xl rounded-b-lg bg-white p-4">
      {/* Tab Navigation - 标签导航 */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex">
          <button
            className={`relative px-4 py-2 ${
              activeTab === "attendance" ? "font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("attendance")}
            aria-label="Show attendance information"
            title="出勤信息 | Attendance Information"
          >
            Attendance
            {activeTab === "attendance" && (
              <div className="absolute bottom-[-1px] left-1/2 w-6 -translate-x-1/2 border-b-2 border-black" />
            )}
          </button>
          <button
            className={`relative px-4 py-2 ${
              activeTab === "progress" ? "font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("progress")}
            aria-label="Show progress information"
            title="进度信息 | Progress Information"
          >
            Progress
            {activeTab === "progress" && (
              <div className="absolute bottom-[-1px] left-1/2 w-6 -translate-x-1/2 border-b-2 border-black" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content - 标签内容 */}
      <div className="mt-4">
        {activeTab === "progress" ? <Progress /> : <Attendance />}
      </div>
    </div>
  );
};

export default Profile;
