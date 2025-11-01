import { ActionButton } from "@/components/Button";
import { ImageInput } from "@/components/Input";
import Popup from "@/components/Popup/Popup";
import { useCGDetails, useEditCG } from "@/graphql/hooks/connect-group";
import { TitleContext } from "@/providers/TitleContextProvider";
import { Form, Formik, type FormikHelpers } from "formik";
import { useContext, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router";
import * as Yup from "yup";

type EditCGImageForm = {
  image_url: File | string;
};

const ManageCGImage = () => {
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
    setTitle("Edit Group Image");
    setFixed(false);
    setBg("transparent");
    setHasUnsavedChanges(false);

    // Cleanup function to reset state when component unmounts
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setRightIcon, setWhite, setTitle, setFixed, setBg, setHasUnsavedChanges]);

  const editCG = useEditCG();

  // Submission handler that uploads new file or keeps existing image
  const handleSubmit = async (
    values: EditCGImageForm,
    actions: FormikHelpers<EditCGImageForm>,
  ) => {
    actions.setSubmitting(true);

    try {
      let finalImageUrl: string;

      // Check if user selected a new file
      if (values.image_url instanceof File) {
        // Upload file to S3 first
        const uploadResult = await uploadImg(values.image_url);
        finalImageUrl = uploadResult.url; // Get URL from S3 response
      } else {
        // No new file selected, keep existing image URL
        const existingImageUrl =
          data?.connect_groupCollection.edges[0]?.node.image_url;
        if (!existingImageUrl) {
          throw new Error("No image to save");
        }
        finalImageUrl = existingImageUrl;
      }

      // Now send GraphQL mutation with the final URL
      editCG.mutate(
        {
          image_url: finalImageUrl,
          id: data?.connect_groupCollection.edges[0]?.node.id ?? "",
        },
        {
          onSuccess: () => {
            setHasUnsavedChanges(false);
            setSuccessDialogOpen(true);
          },
          onSettled: () => {
            actions.setSubmitting(false);
          },
        },
      );
    } catch (error) {
      console.error("Upload or mutation failed:", error);
      actions.setSubmitting(false);
    }
  };

  // Your S3 upload function (example)
  const uploadImg = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://storage.fgacyc.com/upload", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header manually - let the browser set it with boundary
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const res = (await response.json()) as { url: string };

    if (res.url?.startsWith("https://undefined/api/")) {
      const res2 = res.url.replace(
        "https://undefined/api/",
        "https://storage.fgacyc.com/",
      );

      return { url: res2 };
    }

    return res;
  };

  return (
    <>
      <Popup
        isOpen={successDialogOpen}
        title="Edited Group Image"
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
        <p className="text-gray">Group Image Changed Successfully!</p>
      </Popup>
      <div className="flex h-full w-full flex-col gap-5 px-4">
        {isLoading || isRefetching ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <Formik<EditCGImageForm>
            initialValues={{
              image_url:
                data?.connect_groupCollection.edges[0]?.node.image_url ?? "",
            }}
            enableReinitialize
            validateOnChange={false}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              image_url: Yup.mixed().test(
                "file-or-existing",
                "Please upload an image or keep the existing one.",
                (value) => {
                  // Valid if user uploaded a file OR if there's an existing image
                  const hasNewFile = value instanceof File;
                  const hasExistingImage =
                    !!data?.connect_groupCollection.edges[0]?.node.image_url;
                  return hasNewFile || hasExistingImage;
                },
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
                  <ImageInput
                    label="Group Image"
                    name="image_url"
                    previewUrl={
                      data?.connect_groupCollection.edges[0]?.node.image_url
                    }
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

export default ManageCGImage;
