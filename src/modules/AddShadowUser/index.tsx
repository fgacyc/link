import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/providers/TitleContextProvider";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Input, { DateInput, SelectInput, TelInput } from "@/components/Input";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ActionButton } from "@/components/Button";
import { useCreateShadowUser } from "@/graphql/hooks/shadow-user";
import Popup from "@/components/Popup/Popup";
import { useAllPastoralRole, useCGDetails } from "@/graphql";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router";

type ShadowUserForm = {
  name: string;
  contact: string;
  gender: string;
  dob: string;
  remark: string;
  occupation: string;
  role: string;
};

export const AddShadowUser = () => {
  const { setTitle, setWhite, setRightIcon, setFixed, setBg } =
    useContext(TitleContext);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    setRightIcon(null);
    setWhite(false);
    setTitle("Add Shadow User");
    setFixed(false);
    setBg("transparent");
  }, [setRightIcon, setWhite, setTitle, setFixed, setBg]);

  useEffect(() => {
    if (!successDialogOpen) return;
    const timer = setTimeout(() => {
      setSuccessDialogOpen(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [successDialogOpen]);

  const { data } = useCGDetails();
  const cg = data?.connect_groupCollection.edges[0]?.node.id;

  const { data: pastoralRoles, isLoading } = useAllPastoralRole();
  const mappedPastoralRoles = pastoralRoles?.pastoral_roleCollection.edges
    // Filter out the CGL
    .filter((role) => role.node.weight >= 5)
    .map((role) => ({
      label: role.node.name,
      value: role.node.id,
    }));

  const addShadowUser = useCreateShadowUser();
  const navigate = useNavigate();

  return (
    <>
      <Popup
        isOpen={successDialogOpen}
        title="Created Shadow User"
        onClose={() => {
          setSuccessDialogOpen(false);
          navigate("/cg", {
            viewTransition: true,
          });
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
        <p className="text-gray">
          Now you can mark the attendance for this shadow user!
        </p>
      </Popup>
      <div className="flex h-full w-full flex-col gap-5 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <Formik<ShadowUserForm>
            initialValues={{
              name: "",
              contact: "",
              gender: "",
              role: mappedPastoralRoles?.[0]?.value ?? "",
              dob: "",
              occupation: "",
              remark: "",
            }}
            validateOnChange={false}
            onSubmit={(values, action) => {
              action.setSubmitting(true);

              addShadowUser.mutate(
                {
                  name: values.name.trim(),
                  cg: cg ?? "",
                  metadata: JSON.stringify({
                    contact: values.contact.trim(),
                    occupation: values.occupation.trim(),
                    remarks: values.remark.trim(),
                  }),
                  role: values.role.trim(),
                  gender: values.gender.trim(),
                  dob: values.dob,
                },
                {
                  onSuccess: () => {
                    action.resetForm();
                    setSuccessDialogOpen(true);
                  },
                  onSettled: () => {
                    action.setSubmitting(false);
                  },
                },
              );
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Required."),
              contact: Yup.string()
                .required("Required.")
                .test("validity", "Invalid Phone Number.", (val) => {
                  if (val) {
                    return isValidPhoneNumber(val);
                  }
                }),
              gender: Yup.string().required("Required."),
              dob: Yup.date()
                .required("Required.")
                .max(new Date(), "Date of birth cannot be in the future."),
              occupation: Yup.string(),
              remark: Yup.string(),
              role: Yup.string().required("Required."),
            })}
          >
            {({ submitForm, isSubmitting }) => (
              <Form className="flex w-full flex-col gap-3">
                <Input
                  label="Name"
                  name="name"
                  placeholder="Please enter the name"
                  required
                />
                <TelInput
                  label="Contact No."
                  required
                  name="contact"
                  placeholder="Etc: 123456789"
                />
                <Input
                  type="radio"
                  label="Gender"
                  name="gender"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                />
                <SelectInput
                  required
                  label="Pastoral Role"
                  name="role"
                  loading={isLoading}
                  options={
                    mappedPastoralRoles ?? [{ label: "Loading...", value: "" }]
                  }
                />
                <DateInput label="Date of birth" name="dob" required />
                <Input
                  label="Occupation"
                  name="occupation"
                  placeholder="Please enter the occupation"
                />
                <Input
                  label="Remark"
                  name="remark"
                  placeholder="Only you can see this remark"
                />
                <ActionButton
                  extendedPaddingY
                  disabled={isSubmitting}
                  type="button"
                  loading={isSubmitting}
                  label="Add"
                  onClick={submitForm}
                />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
};
