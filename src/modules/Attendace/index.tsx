import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

interface AttendanceEvent {
  date: string;
  day: string;
  event: string;
  status: "Attended" | "Absent";
  reason?: string;
  time?: string;
}

interface AttendanceMonth {
  month: string;
  year: string;
  events: AttendanceEvent[];
}

const attendanceData: AttendanceMonth[] = [
  {
    month: "Jan",
    year: "2025",
    events: [
      {
        date: "25 Jan",
        day: "Sat",
        event: "Service",
        status: "Attended",
      },
      {
        date: "24 Jan",
        day: "Fri",
        event: "CG Gathering",
        status: "Attended",
      },
      {
        date: "18 Jan",
        day: "Sat",
        event: "Service",
        status: "Attended",
      },
      {
        date: "17 Jan",
        day: "Fri",
        event: "CG Gathering",
        status: "Attended",
      },
      {
        time: "5:30PM",
        date: "11 Jan",
        day: "Sat",
        event: "Service",
        status: "Attended",
      },
      {
        date: "10 Jan",
        day: "Fri",
        event: "CG Gathering",
        status: "Attended",
      },
      {
        date: "04 Jan",
        day: "Sat",
        event: "Service",
        status: "Absent",
        reason: "Sick",
      },
      {
        date: "03 Jan",
        day: "Fri",
        event: "CG Gathering",
        status: "Absent",
        reason: "Sick",
      },
    ],
  },
  {
    month: "Dec",
    year: "2024",
    events: [
      {
        date: "24 Dec",
        day: "Tue",
        event: "Service",
        status: "Attended",
      },
      {
        date: "17 Dec",
        day: "Tue",
        event: "CG Gathering",
        status: "Absent",
        reason: "Sick",
      },
      {
        date: "10 Dec",
        day: "Tue",
        event: "Service",
        status: "Attended",
      },
      {
        date: "3 Dec",
        day: "Tue",
        event: "CG Gathering",
        status: "Attended",
      },
    ],
  },
  {
    month: "Nov",
    year: "2024",
    events: [
      {
        date: "26 Nov",
        day: "Sat",
        event: "Service",
        status: "Attended",
      },
      {
        date: "19 Nov",
        day: "Sat",
        event: "CG Gathering",
        status: "Absent",
        reason: "Out of town",
      },
      {
        date: "12 Nov",
        day: "Sat",
        event: "Service",
        status: "Attended",
      },
      {
        date: "5 Nov",
        day: "Sat",
        event: "CG Gathering",
        status: "Attended",
      },
    ],
  },
  {
    month: "Oct",
    year: "2024",
    events: [
      {
        date: "31 Oct",
        day: "Sat",
        event: "Service",
        status: "Attended",
      },
      {
        date: "24 Oct",
        day: "Sat",
        event: "CG Gathering",
        status: "Attended",
      },
      {
        date: "17 Oct",
        day: "Sat",
        event: "Service",
        status: "Absent",
        reason: "Family emergency",
      },
      {
        date: "10 Oct",
        day: "Sat",
        event: "CG Gathering",
        status: "Attended",
      },
      {
        date: "3 Oct",
        day: "Sat",
        event: "Service",
        status: "Attended",
      },
    ],
  },
];

const Attendance = () => {
  const [expandedMonths, setExpandedMonths] = useState<string[]>(["Jan 2025"]);
  const [activeTab, setActiveTab] = useState<"attendance" | "progress">(
    "attendance",
  );

  const toggleMonth = (monthYear: string) => {
    setExpandedMonths((prev) =>
      prev.includes(monthYear)
        ? prev.filter((m) => m !== monthYear)
        : [...prev, monthYear],
    );
  };

  const getAttendanceCount = (events: AttendanceEvent[]) => {
    const attended = events.filter(
      (event) => event.status === "Attended",
    ).length;
    return `(${attended}/${events.length})`;
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex border-b border-gray-200">
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
            <div className="absolute bottom-[-1px] left-1/2 w-12 -translate-x-1/2 border-b-2 border-black" />
          )}
        </button>
      </div>

      {activeTab === "attendance" && (
        <div className="space-y-4">
          {attendanceData.map((monthData) => {
            const monthYear = `${monthData.month} ${monthData.year}`;
            const isExpanded = expandedMonths.includes(monthYear);

            return (
              <div
                key={monthYear}
                className="rounded-lg border border-gray-200 shadow-md"
              >
                <button
                  onClick={() => toggleMonth(monthYear)}
                  className="flex w-full items-center justify-between p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{monthYear}</span>
                    <span className="text-gray-500">
                      {getAttendanceCount(monthData.events)}
                    </span>
                  </div>
                  <span className="text-gray-300">
                    {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3">
                    {monthData.events.map((event, index) => (
                      <div key={`${event.date}-${index}`} className="py-2">
                        <div className="text-xs text-gray-500">
                          {event.time ? `${event.time}, ` : ""}
                          {event.date} ({event.day})
                        </div>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div
                              className={`text-lg ${event.status === "Absent" ? "text-red-600" : ""}`}
                            >
                              {event.event}
                            </div>
                            {event.reason && (
                              <div className="text-xs text-red-600">
                                Reason: {event.reason}
                              </div>
                            )}
                          </div>
                          <div
                            className={`${
                              event.status === "Attended"
                                ? "text-emerald-500"
                                : "text-red-600"
                            } flex min-w-[100px] items-center justify-end gap-1`}
                          >
                            {event.status === "Attended" ? (
                              <CheckIcon />
                            ) : (
                              <ClearIcon />
                            )}{" "}
                            {event.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Attendance;
