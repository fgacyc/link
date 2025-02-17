import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

interface HeaderNavProps {
  transparentBG?: boolean;
  title: string;
  showBack?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  transparentBG,
  title,
  showBack,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`${transparentBG ? "bg-transparent" : "bg-white/95"} sticky top-0 z-[9999] flex w-full flex-row items-center justify-between px-4 pt-6.5`}
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
      <p className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">
        {title}
      </p>
      <div className="h-6 w-6"></div>
    </div>
  );
};
