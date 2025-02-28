import React, { useState, useRef, useEffect } from "react";

interface Member {
  id: string;
  name: string;
  image: string;
}

interface DropdownProps {
  members: Member[]; // 外部传入的成员数据
  onSelect: (member: Member) => void; // 选中成员时的回调
  placeholder?: string; // 可选的占位符文本
  selectedMember?: Member; // 可选的预选成员
}

const MemberDropdown: React.FC<DropdownProps> = ({
  members,
  onSelect,
  placeholder = "Select a member",
  selectedMember,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Member | null>(
    selectedMember ?? null,
  );
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
    setSelected(member);
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
        {selected ? (
          <div className="flex w-full items-center">
            <img
              src={selected.image}
              alt={selected.name}
              className="mr-2 h-6 w-6 rounded-full"
            />
            <span>{selected.name}</span>
            <span className="ml-2 text-gray-500">({selected.id})</span>
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
          {members.map((member) => (
            <div
              key={member.id}
              className="flex cursor-pointer items-center p-2 hover:bg-blue-100"
              onClick={() => handleSelect(member)}
            >
              <img
                src={member.image}
                alt={member.name}
                className="mr-2 h-6 w-6 rounded-full"
              />
              <span>{member.name}</span>
              <span className="ml-2 text-gray-500">({member.id})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberDropdown;
