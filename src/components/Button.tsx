export interface ButtonProps {
  label: string;
  onClick: (() => void) | (() => Promise<void>);
  variant?: "primary" | "secondary" | "warning";
  disabled?: boolean;
  rounded?: "small" | "default";
  extendedPaddingY?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  rounded = "default",
  extendedPaddingY = false,
}) => {
  return (
    <button
      className={`w-full rounded-4xl ${
        rounded === "small" ? "rounded-lg" : "rounded-4xl"
      } px-2 ${extendedPaddingY ? "py-2" : "py-1"} ${disabled ? "opacity-10" : ""} ${
        variant === "primary"
          ? "bg-[#191D1A] font-bold text-white"
          : variant === "secondary"
            ? "bg-white/95 text-black"
            : "bg-white/95 text-[#FF0000]"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
