export interface ActionButtonProps {
  label: string;
  onClick: (() => void) | (() => Promise<void>);
  variant?: "primary" | "secondary" | "warning";
  disabled?: boolean;
  rounded?: "small" | "default";
  type?: HTMLButtonElement["type"];
  extendedPaddingY?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  rounded = "default",
  extendedPaddingY = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`w-full rounded-4xl ${
        rounded === "small" ? "rounded-lg" : "rounded-4xl"
      } px-2 ${extendedPaddingY ? "py-2" : "py-1"} ${disabled ? "opacity-10" : ""} ${
        variant === "primary"
          ? "bg-dark font-bold text-white"
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

interface ButtonProps {
  label: string;
  onClick: (() => void) | (() => Promise<void>);
  disabled?: boolean;
  type?: HTMLButtonElement["type"];
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="text-dark bg-neon-green rounded-lg px-2 py-0.5 text-xs leading-6 font-semibold"
    >
      {label}
    </button>
  );
};
