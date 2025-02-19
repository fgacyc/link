import { Button, type ButtonProps } from "./Button";

interface ButtonGroupProps {
  btns: ButtonProps[];
  rounded?: "small" | "default";
  direction?: "row" | "col";
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  btns,
  direction = "col",
  rounded = "default",
}) => {
  return (
    <div
      className={`flex ${direction === "col" ? "flex-col" : "flex-row"} gap-3`}
    >
      {btns.map((btn) => (
        <Button
          variant={btn.variant}
          label={btn.label}
          disabled={btn.disabled}
          onClick={btn.onClick}
          rounded={rounded}
        />
      ))}
    </div>
  );
};
