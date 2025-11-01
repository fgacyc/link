import { ProfileIcon } from "@/components/ProfileIcon";
import { type GetCGMembersResponse } from "@/types/graphql";
import React, { useState, useRef, useEffect } from "react";
import { CgSpinner } from "react-icons/cg";

type Member =
  GetCGMembersResponse["user_connect_groupCollection"]["edges"][number]["node"]["connect_group"]["user_connect_groupCollection"]["edges"][number]["node"]["user"];

const MemberDropdown: React.FC<{
  members: GetCGMembersResponse["user_connect_groupCollection"]["edges"];
  onSelect: (member: Member) => void;
  placeholder?: string;
  selectedMember?: Member;
  shadowSelections?: boolean;
  disabled?: boolean;
}> = ({
  members,
  onSelect,
  placeholder = "Select a member",
  selectedMember,
  shadowSelections = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 处理选择成员
  const handleSelect = (member: Member) => {
    setIsOpen(false);
    onSelect(member);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 显示当前选择的成员或占位符 */}
      <div
        className="flex w-full cursor-pointer items-center rounded border border-gray-300 bg-white p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedMember ? (
          <div className="flex w-full items-center gap-2">
            <ProfileIcon
              isVerified={!selectedMember.id.startsWith("shadow|")}
              imageUrl={
                selectedMember.avatar_url ??
                `https://placehold.co/40x40?text=${selectedMember.name?.replaceAll(" ", "+") ?? "User"}`
              }
              size="mini"
            />
            <div className="flex flex-col">
              <span>{selectedMember.name}</span>
              <span className="text-xs text-gray-500">{selectedMember.id}</span>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <div className="ml-auto">
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg">
          {disabled ? (
            <div className="flex w-full flex-col items-center justify-center gap-2 p-2 py-5">
              <CgSpinner className="animate-spin" color="#41FAD3" size={30} />
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : (
            members[0]?.node.connect_group.user_connect_groupCollection.edges
              .filter((a) => {
                if (shadowSelections) {
                  return a.node.user.id.startsWith("shadow|");
                }
                return !a.node.user.id.startsWith("shadow|");
              })
              .map((member) => {
                return (
                  <div
                    key={member.node.user.id}
                    className="flex cursor-pointer items-center gap-2 p-2 hover:bg-blue-100"
                    onClick={() => handleSelect(member.node.user)}
                  >
                    <ProfileIcon
                      isVerified={!member.node.user.id.startsWith("shadow|")}
                      imageUrl={
                        member.node.user.avatar_url ??
                        `https://placehold.co/40x40?text=${member.node.user.name?.replaceAll(" ", "+") ?? "User"}`
                      }
                      size="small"
                    />
                    <div className="flex flex-col">
                      <span>{member.node.user.name}</span>
                      <span className="text-xs text-gray-500">
                        ({member.node.user.id})
                      </span>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
};

export default MemberDropdown;
