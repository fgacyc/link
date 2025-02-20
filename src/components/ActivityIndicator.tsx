import React from "react";

interface ActivityIndicatorProps {
    level: "high" | "medium" | "low"; // high: 3条线, medium: 2条线, low: 1条线
}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ level }) => {
    const colorMap = {
        high: "bg-[#00BA93]",
        medium: "bg-[#F6B100]",
        low: "bg-[#FF0000]",
    };

    const activeLines = {
        high: 3,
        medium: 2,
        low: 1,
    };

    return (
        <div className="flex flex-col items-center space-y-1 w-3 h-3">
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className={`w-3 h-[1px] ${index < 3 - activeLines[level] ? "bg-[#D9D9D9]" : colorMap[level]} rounded`}
                />
            ))}
        </div>
    );
};

export default ActivityIndicator;