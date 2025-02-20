import React from "react";

interface ActivityIndicatorProps {
    level: "high" | "medium" | "low" | "none";
}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ level }) => {
    const colorMap = {
        high: "bg-[#00BA93]",
        medium: "bg-[#F6B100]",
        low: "bg-[#FF0000]",
        none: "bg-[#D9D9D9]",
    };

    const activeLines = {
        high: 3,
        medium: 2,
        low: 1,
        none: 0,
    };

    return (
        <div className="flex flex-col items-center space-y-1 w-3 h-3">
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className={`w-3 h-[1px] ${index < 3 - activeLines[level] ? "bg-[#D9D9D9]" : activeLines[level] > 0 ? colorMap[level] : "bg-[#D9D9D9]"} rounded`}
                />
            ))}
        </div>
    );
};

export default ActivityIndicator;