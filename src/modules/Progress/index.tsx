import React from "react";

interface MSJItem {
  id: string;
  title: string;
  completion: {
    current: number;
    total: number;
  };
  status: "completed" | "in-progress" | "locked";
  lockMessage?: string;
}

interface CircularProgressProps {
  current: number;
  total: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  current,
  total,
}) => {
  const percentage: number = (current / total) * 100;
  return (
    <div className="relative h-5 w-5">
      <svg className="h-5 w-5 -rotate-90 transform">
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="#E5E7EB"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="black"
          strokeWidth="2"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 8}`}
          strokeDashoffset={`${2 * Math.PI * 8 * (1 - percentage / 100)}`}
        />
      </svg>
    </div>
  );
};

const Progress: React.FC = () => {
  const getStatusBadgeClasses = (status: MSJItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-[#41FAD3] border rounded-lg border-[#41FAD3]";
      case "in-progress":
        return "text-[#F6B100] border rounded-lg border-[#F6B100] bg-[#F6B100]/10";
      default:
        return "text-gray-500";
    }
  };

  const msjItems: MSJItem[] = [
    {
      id: "msj1",
      title: "MSJ 1",
      completion: { current: 4, total: 4 },
      status: "completed",
    },
    {
      id: "msj2",
      title: "MSJ 2",
      completion: { current: 2, total: 4 },
      status: "in-progress",
    },
    {
      id: "msj3",
      title: "MSJ 3",
      completion: { current: 0, total: 4 },
      status: "locked",
      lockMessage: "Complete MSJ 2 to unlock",
    },
    {
      id: "msj4",
      title: "Lorem ipsum dolor sit amet consectetur. Placerat metus at s...",
      completion: { current: 0, total: 4 },
      status: "locked",
      lockMessage: "Complete MSJ 3 to unlock",
    },
  ];

  return (
    <div className="space-y-4 p-1">
      {msjItems.map((item: MSJItem) => (
        <div key={item.id} className="flex rounded-lg bg-white p-4 shadow-md">
          <div className="mr-4 h-20 w-20 rounded-lg bg-gray-200" />
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate text-sm font-medium text-gray-900">
              {item.title}
            </h3>

            {item.status === "locked" ? (
              <div className="mb-1 flex items-center gap-1 text-sm text-gray-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" />
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6z" />
                </svg>
                {item.lockMessage}
              </div>
            ) : (
              <span
                className={`inline-block rounded-full px-3 py-0.5 text-sm font-medium ${getStatusBadgeClasses(item.status)}`}
              >
                {item.status === "completed" ? "Completed" : "In Progress"}
              </span>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-400">
              Completion {item.completion.current}/{item.completion.total}
              <CircularProgress
                current={item.completion.current}
                total={item.completion.total}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Progress;
