import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

interface HeaderNavProps {
  title: string;
  showBack?: boolean;
  rightIcon?: React.ReactNode;
  transparent?: boolean;
  white?: boolean;
  fixed?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title,
  showBack,
  rightIcon,
  transparent = false,
  white = false,
  fixed = false,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`top-0 z-[999] flex w-full flex-row items-center justify-between ${
        transparent ? "bg-transparent" : "bg-[#f2f2f2]"
      } px-4 py-6.5 ${white ? "text-white" : ""} ${fixed ? "fixed" : "sticky"}`}
    >
      <div className="h-6 w-6">
        {showBack && (
          <GoChevronLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer"
            role="button"
            size={24}
          />
        )}
      </div>
      <p className="absolute left-1/2 max-w-[75%] -translate-x-1/2 truncate text-xl font-bold whitespace-nowrap">
        {title}
      </p>
      <div className="h-6 w-6">{rightIcon}</div>
    </div>
  );
};
