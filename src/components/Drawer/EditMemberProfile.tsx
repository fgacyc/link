import Drawer from ".";
import { useState } from "react";
import { RemoveMemberPopup } from "../Popup/RemoveMemberPopup";
import { Link, useParams } from "react-router";
import { usePastoralRole, useSinglePerson } from "@/graphql/hooks";
import { hasElevatedPermissions } from "@/utils";
import { useUser } from "@/stores/useUser";
import toast from "react-hot-toast";

interface EditMemberProfileDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EditMemberProfileDrawer: React.FC<
  EditMemberProfileDrawerProps
> = ({ open, setOpen }) => {
  const [removeOpen, setRemoveOpen] = useState(false);
  const { user } = useUser();
  const { id } = useParams();

  const { data: pastoralRole } = usePastoralRole(user?.id ?? "");
  const pastoralRoleWeight =
    pastoralRole?.user_connect_groupCollection.edges[0]?.node.pastoral_role
      .weight;
  const hasPermissions = hasElevatedPermissions(pastoralRoleWeight ?? 0);

  // Check if member has a pending invite
  const { data: member } = useSinglePerson(id ?? "");
  const hasPendingInvite =
    (member?.connect_group_inviteCollection?.edges?.length ?? 0) > 0;

  if (!hasPermissions) {
    return null;
  }

  return (
    <>
      <Drawer noHeaderSpace open={open} setOpen={setOpen}>
        <div className="flex w-full flex-col items-center pb-5">
          {hasPendingInvite ? (
            <div
              onClick={() => {
                toast.error("This member already has a pending assignment");
              }}
              className="w-full cursor-not-allowed opacity-50"
            >
              <p className="text-dark w-full py-3 text-center text-base font-medium">
                Assign to Other Group
              </p>
            </div>
          ) : (
            <Link to={`/cg/profile/${id}/assign`}>
              <p className="text-dark w-full py-3 text-center text-base font-medium">
                Assign to Other Group
              </p>
            </Link>
          )}
          <Link to={`/cg/bind-account/${id}`}>
            <p className="text-dark w-full py-3 text-center text-base font-medium">
              Bind Account
            </p>
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              setRemoveOpen(true);
            }}
            className="w-full focus:outline-none"
          >
            <p className="w-full py-3 text-center text-base text-[#FF0000]">
              Remove from Group
            </p>
          </button>
        </div>
      </Drawer>
      <RemoveMemberPopup isOpen={removeOpen} setOpen={setRemoveOpen} />
    </>
  );
};
