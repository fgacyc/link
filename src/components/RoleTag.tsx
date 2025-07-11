import { Flag } from "@mui/icons-material";

export const RoleTag: React.FC<{
  pastoralRoleId: string;
  borderColor?: string;
  flagSize?: "small" | "medium" | "large" | "inherit";
}> = ({ pastoralRoleId, borderColor, flagSize = "small" }) => {
  return pastoralRoleId === "rol_fd249a3111bb4dceb57f" ? (
    <Flag className="text-dark-neon-green" fontSize={flagSize} />
  ) : pastoralRoleId === "rol_1ecba215831345f48abf" ? (
    <div
      style={{
        borderColor: borderColor ?? "#191d1a",
      }}
      className="rounded-[2px] border px-[3px] py-[1px] text-[10px]"
    >
      NF
    </div>
  ) : null;
};
