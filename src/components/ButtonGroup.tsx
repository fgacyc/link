import { Button, ButtonProps } from "./Button";

interface ButtonGroupProps {
  btns: ButtonProps[];
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ btns }) => {
  return (
    <div className="flex flex-col gap-3">
      {btns.map((btn) => (
        <Button
          variant={btn.variant}
          label={btn.label}
          disabled={btn.disabled}
          onClick={btn.onClick}
        />
      ))}
    </div>
  );
};
