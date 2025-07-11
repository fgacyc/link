import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useParams } from "react-router";
import { useAllAttendance } from "@/graphql/hooks/attendance";
import { ContentPaste } from "@mui/icons-material";

/**
 * AttendanceEvent Interface - Represents a single attendance record
 * 出勤事件接口 - 表示单个出勤记录
 */
interface AttendanceEvent {
  date: string;
  day: string;
  name: string;
  status: "Attended" | "Absent";
  reason?: string;
}

/**
 * AttendanceMonth Interface - Represents a month of attendance records
 * 出勤月份接口 - 表示一个月的出勤记录
 */
interface AttendanceMonth {
  month: string;
  year: string;
  events: AttendanceEvent[];
}

const Attendance = () => {
  const [expandedMonths, setExpandedMonths] = useState<string[]>(["Jan 2025"]);
  const { id } = useParams();
  const { data } = useAllAttendance(id ?? "");

  const attendanceData: AttendanceMonth[] =
    data?.attendanceCollection?.edges?.reduce(
      (acc: AttendanceMonth[], edge) => {
        const node = edge.node;
        const createdAt = new Date(node.created_at);
        const month = createdAt.toLocaleString("default", { month: "long" });
        const year = createdAt.getFullYear().toString();

        // Find existing month or create new one
        let monthData = acc.find((m) => m.month === month && m.year === year);
        if (!monthData) {
          monthData = { month, year, events: [] };
          acc.push(monthData);
        }

        // Create attendance event
        const attendanceEvent: AttendanceEvent = {
          date: createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
          }),
          day: createdAt.toLocaleDateString("en-GB", { weekday: "short" }),
          name: node.session.name,
          status: node.attended ? "Attended" : "Absent",
          reason: node.description,
        };

        monthData.events.push(attendanceEvent);
        return acc;
      },
      [],
    ) || [];

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

  if (attendanceData.length === 0) {
    return (
      <div className="flex flex-grow flex-col bg-white px-4 py-5">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <ContentPaste className="text-gray" fontSize="large" />
          <p className="text-gray text-sm">No attendance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col bg-white px-4 py-5">
      <div className="flex-grow">
        <div className="space-y-2">
          {attendanceData.map((monthData) => {
            const monthYear = `${monthData.month} ${monthData.year}`;
            const isExpanded = expandedMonths.includes(monthYear);

            return (
              <div
                key={monthYear}
                className="border-gray/20 overflow-hidden rounded-lg border p-3 shadow"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleMonth(monthYear)}
                  className="flex w-full items-center justify-between text-left transition-colors duration-200"
                >
                  <span className="text-dark text-sm font-bold">
                    {monthYear}{" "}
                    <span className="text-gray text-xs font-normal">
                      {getAttendanceCount(monthData.events)}
                    </span>
                  </span>

                  <div
                    className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <ExpandMoreIcon className="text-gray-600" />
                  </div>
                </button>

                {/* Accordion Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex w-full flex-col pt-3">
                    {monthData.events.map((e) => (
                      <div
                        key={e.date}
                        className="flex flex-row items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <p className="text-gray text-[10px]">
                            {e.date} ({e.day})
                          </p>
                          <p
                            className={`${
                              e.status === "Attended"
                                ? "text-dark"
                                : "text-[#AD0000]"
                            } text-sm font-medium`}
                          >
                            {e.name}
                          </p>
                          {e.status === "Absent" && e.reason ? (
                            <p className="text-[10px] text-[#AD0000]">
                              Reason: {e.reason}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex flex-row items-center">
                          {e.status === "Attended" ? (
                            <>
                              <CheckIcon
                                className="text-dark-neon-green"
                                style={{
                                  fontSize: "16px",
                                }}
                              />
                              <p className="text-dark-neon-green text-xs">
                                {e.status}
                              </p>
                            </>
                          ) : (
                            <>
                              <ClearIcon
                                className="text-[#AD0000]"
                                style={{
                                  fontSize: "16px",
                                }}
                              />
                              <p className="text-xs text-[#AD0000]">
                                {e.status}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
