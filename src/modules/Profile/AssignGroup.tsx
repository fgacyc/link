import { TitleContext } from "@/providers/TitleContextProvider";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { ProfileIcon } from "@/components/ProfileIcon";

import ActivityIndicator from "@/components/ActivityIndicator";
import { AutoCompleteInput } from "@/components/Input";
import { ActionButton } from "@/components/Button";
import Dialog from "@/components/Dialog/Dialog";
import Popup from "@/components/Popup/Popup";
import { Formik, Form } from "formik";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/stores/useUser";
import {
  useLatestCGAttendance,
  useSinglePerson,
  getAllCGWithParams,
} from "@/graphql";
import { useCGLeader, useCreateCGInvite } from "@/graphql/hooks/connect-group";
import { getLevelfromAttendanceDate } from "@/utils";
import * as Yup from "yup";
import toast from "react-hot-toast";

export default function AssignGroup() {
  const { setTitle, setBg, setWhite, setFixed } = useContext(TitleContext);

  const { id } = useParams();

  useEffect(() => {
    setTitle("Assign to Other Group");
    setFixed(false);
    setWhite(false);
    setBg("transparent");
  }, [setTitle, setFixed, setWhite, setBg]);

  const { uid } = useUser();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();

  // Track selected CG details for display in dialog
  const [selectedCG, setSelectedCG] = useState<{
    id: string;
    name: string;
    satellite: string;
  } | null>(null);

  // Map to store CG details by ID for lookup when option is selected
  const cgDetailsMapRef = React.useRef<
    Map<
      string,
      {
        id: string;
        name: string;
        satellite: string;
      }
    >
  >(new Map());

  const { data: member, isLoading } = useSinglePerson(id ?? "");
  const { data: attendance } = useLatestCGAttendance(member?.id ?? "");

  // Check if member already has a pending invite
  const hasPendingInvite =
    (member?.connect_group_inviteCollection?.edges?.length ?? 0) > 0;

  // Redirect if member already has a pending assignment
  useEffect(() => {
    if (member && hasPendingInvite) {
      navigate(`/cg/profile/${id}`, { replace: true });
      toast.error("This member already has a pending assignment");
    }
  }, [member, hasPendingInvite, navigate, id]);

  // Fetch leader of selected CG
  const { data: leaderData, isLoading: isLeaderLoading } = useCGLeader(
    selectedCG?.id ?? "",
  );
  const leader =
    leaderData?.user_connect_groupCollection?.edges?.[0]?.node?.user;

  // Mutation for creating CG invite
  const { mutateAsync: createInvite, isPending: isCreatingInvite } =
    useCreateCGInvite();

  type AssignGroupForm = {
    cgName: string;
    // whenToAssign: string;
  };

  // Memoized search function using react-query for caching and deduplication
  const searchCGWithQuery = useMemo(
    () => async (query: string) => {
      try {
        const searchKey = `%${query}%`;

        // Use queryClient.fetchQuery to leverage react-query caching
        const searchResults = await queryClient.fetchQuery({
          queryKey: ["allCGWithParams", searchKey],
          queryFn: () => getAllCGWithParams(searchKey),
          staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
        });

        // Transform the GraphQL response to match the expected format
        if (searchResults?.connect_groupCollection?.edges) {
          // Clear and rebuild the map with new results
          cgDetailsMapRef.current.clear();

          return searchResults.connect_groupCollection.edges.map((edge) => {
            const cgDetails = {
              id: edge.node.id,
              name: edge.node.name,
              satellite: edge.node.satellite.name,
            };

            // Store in map for later lookup
            cgDetailsMapRef.current.set(edge.node.id, cgDetails);

            return {
              id: edge.node.id,
              label: `${edge.node.name} (${edge.node.satellite.name})`,
              value: edge.node.name,
            };
          });
        }

        return [];
      } catch (error) {
        console.error("Error searching CGs:", error);
        return [];
      }
    },
    [queryClient],
  );

  // Handle CG selection from autocomplete
  const handleCGSelect = (option: {
    id: string;
    label: string;
    value: string;
  }) => {
    const cgDetails = cgDetailsMapRef.current.get(option.id);
    if (cgDetails) {
      setSelectedCG(cgDetails);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!member) return <div>Member not found</div>;

  const cg = member.user_connect_groupCollection.edges[0]?.node.connect_group;

  return (
    <div className="flex h-full flex-grow flex-col gap-4 px-4">
      <div className="flex flex-col gap-3">
        <div
          className={
            "flex items-center justify-between rounded-sm bg-white p-2"
          }
        >
          <div className={"flex flex-row items-center gap-2"}>
            <ProfileIcon
              imageUrl={member?.avatar_url ?? ""}
              isVerified={!member.id.startsWith("shadow|")}
              size="small"
            />
            <div className={"flex flex-col"}>
              <p className={"text-sm font-semibold text-black"}>
                {member.name ?? "None"}
              </p>
              <p className={"text-dark text-[10px]"}>{cg?.name}</p>
              <p className={"text-gray text-[10px]"}>CG ID: {cg?.id}</p>
            </div>
          </div>
          <ActivityIndicator
            level={getLevelfromAttendanceDate(
              attendance?.latest_attendance.edges[0]?.node.created_at ?? "",
            )}
          />
        </div>
        <div className={"text-sm text-[#92969D]"}>
          Please search a CG name to assign this member to other group.
        </div>
      </div>
      <Formik<AssignGroupForm>
        initialValues={{
          cgName: "",
          // whenToAssign: "",
        }}
        validationSchema={Yup.object().shape({
          cgName: Yup.string().required("CG Name is required."),
          // whenToAssign: Yup.string().required("Date is required."),
        })}
        onSubmit={(values, actions) => {
          // Check if the entered name exactly matches a CG from the search results
          if (!selectedCG) {
            // Try to find exact match from the cached results
            const matchedCG = Array.from(cgDetailsMapRef.current.values()).find(
              (cgItem) =>
                cgItem.name.toLowerCase() === values.cgName.toLowerCase(),
            );

            if (matchedCG) {
              // Check if trying to assign to the same CG
              if (cg && matchedCG.id === cg.id) {
                actions.setFieldError(
                  "cgName",
                  "Member is already in this CG.",
                );
                return;
              }

              // Auto-select the matched CG
              setSelectedCG(matchedCG);
              // Open the dialog after a brief moment to allow state update
              setTimeout(() => {
                setIsDialogOpen(true);
              }, 100);
            } else {
              // No exact match found
              actions.setFieldError(
                "cgName",
                "Please select a valid CG from the dropdown.",
              );
              return;
            }
          } else {
            // Check if trying to assign to the same CG
            if (cg && selectedCG.id === cg.id) {
              actions.setFieldError("cgName", "Member is already in this CG.");
              return;
            }

            // CG already selected, proceed to dialog
            setIsDialogOpen(true);
          }
        }}
      >
        <Form className="flex flex-col gap-5">
          <AutoCompleteInput
            label="CG Name"
            name="cgName"
            placeholder="Please enter CG name, etc: CYC 123"
            onSearch={searchCGWithQuery}
            onSelect={handleCGSelect}
            onClear={() => setSelectedCG(null)}
            disabledOptionId={cg?.id}
          />

          {/* <DateInput
            label="When to assign?"
            name="whenToAssign"
            placeholder="Please select a date"
          /> */}

          <div className={"sticky flex w-full flex-col gap-2"}>
            <ActionButton extendedPaddingY label={"Assign Now"} type="submit" />
          </div>
        </Form>
      </Formik>

      <Dialog
        isOpen={isDialogOpen}
        title="Confirmation to Assign"
        centerTitle
        cancelText="Cancel"
        confirmText={isCreatingInvite ? "Assigning..." : "Confirm to Assign"}
        onCancel={() => {
          if (isCreatingInvite) return; // Prevent cancel during loading
          setIsDialogOpen(false);
          console.log("On Cancel");
        }}
        onConfirm={async () => {
          if (!selectedCG || !member || !uid) {
            console.error("Missing required data for invite");
            return;
          }

          try {
            await createInvite({
              cg_id: selectedCG.id,
              user_id: member.id,
              created_by: uid,
            });

            setIsDialogOpen(false);
            setIsPopupOpen(true);
            console.log("Invite created successfully");
          } catch (error) {
            console.error("Error creating invite:", error);
            toast.error("Failed to create invite. Please try again.");
            // Keep dialog open on error
          }
        }}
        vertical={true}
      >
        <div className={"flex flex-col items-center gap-2"}>
          <ProfileIcon
            imageUrl={member?.avatar_url ?? "None"}
            size={"xlarge"}
            isVerified={!member.id.startsWith("shadow|")}
          />
          <div className={"text-center text-[#92969D]"}>
            Are you sure want to assign this member to
            <b className={"ml-2 text-black"}>
              {selectedCG?.name ?? "No CG selected"}
            </b>
            ?
          </div>
        </div>
        {selectedCG && (
          <div className={"mt-4 rounded-lg bg-[#F4F4F4] p-2 text-sm"}>
            <div className={"mb-2 flex justify-between"}>
              <div>Leader Name:</div>
              <div className={"font-bold"}>
                {isLeaderLoading
                  ? "Loading..."
                  : leader?.name
                    ? leader.name
                    : "N/A"}
              </div>
            </div>
            <div className={"mb-2 flex justify-between"}>
              <div>Group Name:</div>
              <div className={"font-bold"}>{selectedCG.name}</div>
            </div>
            <div className={"flex justify-between"}>
              <div>Satellite:</div>
              <div className={"font-bold"}>{selectedCG.satellite}</div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isCreatingInvite && (
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <span>Creating invite...</span>
          </div>
        )}
      </Dialog>
      <Popup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          console.log("Popup closed");
          navigate(`/cg/profile/${id}`);
        }}
        title="Submitted to Assign"
        buttonText="Okay"
        imageUrl=""
      >
        <div className={"flex flex-col items-center gap-2"}>
          <ProfileIcon
            imageUrl={member?.avatar_url ?? "None"}
            size={"large"}
            isVerified={!member?.id.startsWith("shadow|")}
          />
          <div className={"text-center text-sm text-[#92969D]"}>
            Please wait. Now the member is still under approval from the new
            cell group.
          </div>
        </div>
      </Popup>
    </div>
  );
}
