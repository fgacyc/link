import { GroupRounded } from "@mui/icons-material";

import { ContentCopyRounded } from "@mui/icons-material";
import { Button } from "@/components/Button";
import { type GetCGMembersResponse } from "@/types/graphql";
import { useUser } from "@/stores/useUser";
import { useCGDetails, useSatellite } from "@/graphql/hooks/connect-group";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface CGHeaderProps {
  members: GetCGMembersResponse["user_connect_groupCollection"]["edges"][0]["node"]["connect_group"]["user_connect_groupCollection"]["edges"][0]["node"]["user"][];
}

export const CGHeader: React.FC<CGHeaderProps> = ({ members }) => {
  const { user } = useUser();
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data, isPending } = useCGDetails();

  const { data: satellite } = useSatellite(
    data?.connect_groupCollection.edges[0]?.node.satellite_id ?? "",
  );

  return (
    <div className="header-bg flex w-full flex-col gap-3 rounded-b-[18px] px-4 pt-19 pb-5 text-white">
      <div className="flex w-full flex-col gap-5 pt-11">
        <p className="text-sm font-bold">
          Satellite: {satellite?.satelliteCollection.edges[0]?.node.name}
        </p>
        <div className="relative min-h-[240px] w-full">
          {(!imageLoaded || isPending) && (
            <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded-sm bg-gray-200">
              <div className="text-sm text-gray-400">Loading...</div>
            </div>
          )}
          {!isPending && (
            <img
              src={
                data?.connect_groupCollection.edges[0]?.node.image_url ??
                `https://placehold.co/350x170?text=${data?.connect_groupCollection.edges[0]?.node.name}`
              }
              alt="Cover"
              className={`h-full w-full rounded-sm object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // Also show on error to prevent infinite loading
            />
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <p className="text-lg font-bold">
            {data?.connect_groupCollection.edges[0]?.node.name}
          </p>
          <ContentCopyRounded
            sx={{
              fontSize: 18,
            }}
            role="button"
            onClick={() => {
              navigator.clipboard.writeText(
                data?.connect_groupCollection.edges[0]?.node.name ?? "",
              );
              toast.success("Copied to clipboard");
            }}
          />
        </div>
        <Button
          label="Numbers"
          onClick={() => {
            window.open(`https://miniapp-numbers-new.pages.dev/${user?.cg}`);
          }}
        />
      </div>
      <div className="text-info-gray flex flex-col gap-1.5">
        <div className="flex flex-row items-center gap-1">
          <p className="text-sm">{members?.length ?? 0}</p>
          <GroupRounded
            sx={{
              fontSize: 12,
            }}
          />
        </div>
        {/* <div className="flex flex-row items-center gap-1">
          <p className="text-sm">CG Name: {cgName}</p>
          <ContentCopyRounded
            sx={{
              fontSize: 14,
            }}
            role="button"
          />
        </div> */}
        {/* <div className="flex flex-row items-center gap-1.5">
          <p className="text-sm">
            {satellite?.satelliteCollection.edges[0]?.node.name}
          </p>
          <div className="bg-info-gray h-[8px] w-[1px]" />
          <p className="text-sm">Daniel Seakny Team</p>
          <div className="bg-info-gray h-[8px] w-[1px]" />
          <p className="text-sm">M2 Junior</p>
        </div> */}
      </div>
      {data?.connect_groupCollection.edges[0]?.node.description ? (
        <p className="text-sm">
          {data?.connect_groupCollection.edges[0]?.node.description}
        </p>
      ) : null}
    </div>
  );
};
