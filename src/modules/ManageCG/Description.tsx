import { ActionButton } from "@/components/Button";
import { TextareaInput } from "@/components/Input";
import Popup from "@/components/Popup/Popup";
import { useCGDetails, useEditCG } from "@/graphql/hooks/connect-group";
import { TitleContext } from "@/providers/TitleContextProvider";
import { Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router";
import * as Yup from "yup";

type EditCGDescriptionForm = {
  description: string;
};

const ManageCGDescription = () => {
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

  useEffect(() => {
    setRightIcon(null);
    setWhite(false);
    setTitle("Edit Description");
    setFixed(false);
    setBg("transparent");
    setHasUnsavedChanges(false);

    // Cleanup function to reset state when component unmounts
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setRightIcon, setWhite, setTitle, setFixed, setBg, setHasUnsavedChanges]);

  const editCG = useEditCG();

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
        {isLoading || isRefetching ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <Formik<EditCGDescriptionForm>
            initialValues={{
              description: "",
            }}
            enableReinitialize
            validateOnChange={false}
            onSubmit={(values, action) => {
              action.setSubmitting(true);

              editCG.mutate(
                {
                  description: values.description.trim(),
                  id: data?.connect_groupCollection.edges[0]?.node.id ?? "",
                },
                {
                  onSuccess: () => {
                    action.resetForm();
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
              description: Yup.string()
                .required("Required.")
                .max(100, "Maximum 100 characters."),
            })}
          >
            {({ submitForm, isSubmitting, dirty }) => {
              // Track unsaved changes
              useEffect(() => {
                setHasUnsavedChanges(dirty);
              }, [dirty]);

              return (
                <Form className="flex w-full flex-col gap-3">
                  <TextareaInput
                    label="Description"
                    name="description"
                    placeholder="Please enter the group description"
                    hint="Max. 100 characters"
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

export default ManageCGDescription;
