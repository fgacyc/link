import React, { useState } from "react";
import Progress from "../Progress";
import Attendance from "../Attendace";

type TabType = "progress" | "attendance";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("attendance");

  return (
    <div className="mx-auto max-w-3xl rounded-b-lg bg-white p-4">
      {/* Tab Navigation */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex">
          <button
            className={`relative px-4 py-2 ${
              activeTab === "attendance" ? "font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("attendance")}
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
          >
            Progress
            {activeTab === "progress" && (
              <div className="absolute bottom-[-1px] left-1/2 w-6 -translate-x-1/2 border-b-2 border-black" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "progress" ? <Progress /> : <Attendance />}
      </div>
    </div>
  );
};

export default Profile;
