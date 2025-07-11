import Drawer from ".";
import { useState } from "react";
import { RemoveMemberPopup } from "../Popup/RemoveMemberPopup";

interface EditMemberProfileDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EditMemberProfileDrawer: React.FC<
  EditMemberProfileDrawerProps
> = ({ open, setOpen }) => {
  const [removeOpen, setRemoveOpen] = useState(false);
  return (
    <>
      <Drawer noHeaderSpace open={open} setOpen={setOpen}>
        <div className="flex w-full flex-col items-center pb-5">
          {/* <Link to={`/cg/profile/${id}/assign`}>
          <p className="text-dark w-full py-3 text-center text-base font-medium">
            Assign to Other Group
          </p>
        </Link> */}
          {/* <Link to={`/cg/profile/${id}/assign`}>
          <p className="text-dark w-full py-3 text-center text-base font-medium">
            Bind Account
          </p>
        </Link> */}
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
