import { ActionButton } from "@/components/Button";
import Input from "@/components/Input";
import Popup from "@/components/Popup/Popup";
import {
  useCGDetails,
  useEditCG,
  usePastoralRole,
} from "@/graphql/hooks/connect-group";
import { TitleContext } from "@/providers/TitleContextProvider";
import { Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { useUser } from "@/stores/useUser";
import { hasElevatedPermissions } from "@/utils";

type EditCGNameForm = {
  name: string;
};

const ManageCGName = () => {
  const {
    setTitle,
    setWhite,
    setRightIcon,
    setFixed,
    setBg,
    setHasUnsavedChanges,
  } = useContext(TitleContext);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const { data, isLoading, isRefetching } = useCGDetails();
  const navigate = useNavigate();
  const { uid } = useUser();
  const { data: pastoralRoleData } = usePastoralRole(uid);

  const currentName = data?.connect_groupCollection.edges[0]?.node.name ?? "";

  // Get current user's pastoral role weight
  const roleWeight =
    pastoralRoleData?.user_connect_groupCollection.edges[0]?.node.pastoral_role
      ?.weight;

  // Check if user has permission to edit based on role weight
  const hasPermission = hasElevatedPermissions(roleWeight);

  useEffect(() => {
    setRightIcon(null);
    setWhite(false);
    setTitle("Edit Group Name");
    setFixed(false);
    setBg("transparent");
    setHasUnsavedChanges(false);

    // Cleanup function to reset state when component unmounts
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setRightIcon, setWhite, setTitle, setFixed, setBg, setHasUnsavedChanges]);

  const { mutateAsync: editCG, isPending: isEditing } = useEditCG();

  return (
    <>
      <Popup
        isOpen={successDialogOpen}
        title="Edited Group Name"
        onClose={() => {
          setSuccessDialogOpen(false);
          navigate(-1);
        }}
        customImage={
          <img
            src="/task_done.png"
            className="w-[200px] object-contain"
            alt="Task Done"
          />
        }
        buttonText="Okay"
      >
        <p className="text-gray">Group Name Changed Successfully!</p>
      </Popup>
      <div className="flex h-full w-full flex-col gap-5 px-4">
        {isEditing || isLoading || isRefetching ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
            <p className="text-center">Loading...</p>
          </div>
        ) : !hasPermission ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-red-50 p-6 text-center">
            <p className="text-lg font-semibold text-red-700">Access Denied</p>
            <p className="text-sm text-red-600">
              You don't have permission to edit the group name. Only Pastors,
              Team Leaders, Coaches, and Connect Group Leaders can edit this
              field.
            </p>
            <ActionButton
              extendedPaddingY
              label="Go Back"
              onClick={() => navigate(-1)}
            />
          </div>
        ) : (
          <Formik<EditCGNameForm>
            initialValues={{
              name: currentName,
            }}
            enableReinitialize
            validateOnChange={false}
            onSubmit={(values, action) => {
              action.setSubmitting(true);

              editCG(
                {
                  name: values.name.trim(),
                  id: data?.connect_groupCollection.edges[0]?.node.id ?? "",
                },
                {
                  onSuccess: () => {
                    setHasUnsavedChanges(false);
                    setSuccessDialogOpen(true);
                  },
                  onSettled: () => {
                    action.setSubmitting(false);
                  },
                },
              );
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string()
                .required("Required.")
                .max(50, "Maximum 50 characters.")
                .test(
                  "no-formula-injection",
                  'Cannot start with "=" character.',
                  (value) => !value?.trim().startsWith("="),
                ),
            })}
          >
            {({ submitForm, isSubmitting, dirty }) => {
              // Track unsaved changes
              useEffect(() => {
                setHasUnsavedChanges(dirty);
              }, [dirty]);

              return (
                <Form className="flex w-full flex-col gap-3">
                  <Input
                    label="Group Name"
                    name="name"
                    placeholder="Please enter the group name"
                    hint="Max. 50 characters"
                  />

                  <ActionButton
                    extendedPaddingY
                    disabled={isSubmitting}
                    type="button"
                    loading={isSubmitting}
                    label="Save"
                    onClick={submitForm}
                  />
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </>
  );
};

export default ManageCGName;
