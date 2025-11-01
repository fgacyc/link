import {
  ChevronRightOutlined,
  LinkRounded,
  PersonAddRounded,
} from "@mui/icons-material";
import Drawer from ".";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useCGDetails } from "@/graphql/hooks/connect-group";
import { useUser } from "@/stores/useUser";

interface AddMemberDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AddMemberDrawer = ({ open, setOpen }: AddMemberDrawerProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: cgDetails } = useCGDetails();

  const cgName =
    cgDetails?.connect_groupCollection.edges[0]?.node.name ?? "our CG";
  const cgId = user?.cg ?? "";

  return (
    <Drawer open={open} setOpen={setOpen} title="Add Member">
      <div className="mb-10 flex flex-col gap-5">
        <ActionItem
          onClick={() =>
            navigate("/cg/add-shadow-user", { viewTransition: true })
          }
          icon={<PersonAddRounded className="text-dark-neon-green" />}
          title="Add Shadow User"
          description="Record the attendance of unregistered members or new friends without requiring immediate registration."
        />
        <ActionItem
          onClick={() => {
            const invitationText = `Hey! Welcome to my CG, ${cgName}! 
Join us by clicking the link below! 

https://invite.fgacyc.com/${cgId}`;

            navigator.clipboard.writeText(invitationText);
            toast.success("Invitation Link Copied!");
          }}
          icon={<LinkRounded className="text-dark-neon-green" />}
          title="Copy Invitation Link"
          description="Generate an invitation link to encourage new friends to register and download the app."
        />
      </div>
    </Drawer>
  );
};

interface ActionItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const ActionItem = ({ title, description, icon, onClick }: ActionItemProps) => {
  return (
    <button
      className="flex flex-row items-center justify-between gap-3"
      onClick={onClick}
    >
      <div className="flex w-full flex-row items-center gap-3">
        {icon}
        <div className="flex flex-col gap-1">
          <p className="text-dark w-full text-left text-sm font-medium">
            {title}
          </p>
          <p className="text-gray w-full text-left text-xs">{description}</p>
        </div>
      </div>
      <ChevronRightOutlined
        sx={{
          fontSize: 16,
        }}
        className="text-dark"
      />
    </button>
  );
};
