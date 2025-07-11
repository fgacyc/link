import { useCGDetails } from "@/graphql";
import { TitleContext } from "@/providers/TitleContextProvider";
import { ChevronRightSharp } from "@mui/icons-material";
import { useContext, useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { Link } from "react-router";

const ManageCG = () => {
  const { setTitle, setRightIcon, setBg, setFixed, setWhite } =
    useContext(TitleContext);

  useEffect(() => {
    setTitle("Manage Group");
    setBg("transparent");
    setWhite(false);
    setFixed(false);
    setRightIcon(null);
  }, [setTitle, setRightIcon, setBg, setWhite]);

  const { data, isLoading } = useCGDetails();
  const cgName = data?.connect_groupCollection.edges[0]?.node.name;
  const cgImageUrl = data?.connect_groupCollection.edges[0]?.node.image_url;

  const ListItem = ({
    label,
    value,
    to,
    imageUrl,
  }: {
    label: string;
    value?: string;
    to: string;
    imageUrl?: string;
  }) => {
    return (
      <Link to={to} viewTransition>
        <div
          className={`flex w-full flex-row py-2 ${
            imageUrl ? "items-start" : "items-center"
          } gap-3 text-base`}
        >
          <p className="text-gray min-w-[100px] text-sm font-medium">{label}</p>
          {imageUrl ? (
            <div className="flex w-full items-center">
              <img
                className="h-auto w-full max-w-full rounded-md object-cover"
                src={imageUrl}
              />
            </div>
          ) : (
            <p
              className={`line-clamp-3 w-full text-sm ${value === "-" ? "italic" : ""} text-black`}
            >
              {value}
            </p>
          )}
          <ChevronRightSharp fontSize="inherit" />
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-full w-full flex-col gap-5 px-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
          <p className="text-center">Loading...</p>
        </div>
      ) : (
        <div className="shadow-01 flex w-full flex-col gap-3 rounded-md bg-white p-3">
          <p className="text-sm font-bold">Group Settings</p>
          <ListItem
            label="Group Name"
            value={cgName ?? ""}
            to="/cg/manage/name"
          />
          <ListItem
            label="Group Photo"
            imageUrl={
              cgImageUrl ?? `https://placehold.co/300x150?text=${cgName}`
            }
            to="/cg/manage/photo"
          />
          <ListItem
            label="Description"
            value={
              data?.connect_groupCollection.edges[0]?.node.description ?? "-"
            }
            to="/cg/manage/description"
          />
        </div>
      )}
    </div>
  );
};

export default ManageCG;
