import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/providers/TitleContextProvider";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Input, { DateInput, TelInput } from "@/components/Input";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ActionButton } from "@/components/Button";
import { useGraphQL } from "@/hooks/useGraphQL";
import { useMutation } from "@tanstack/react-query";
import { addShadowUser as addShadowUserFn } from "@/graphql/declaration";
import { useUser } from "@/stores/useUser";
import Popup from "@/components/Popup/Popup";

type ShadowUserForm = {
  name: string;
  contact: string;
  gender: string;
  dob: string;
  remark: string;
  occupation: string;
};

export const AddShadowUser = () => {
  const { setTitle, setWhite, setRightIcon, setFixed } =
    useContext(TitleContext);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    setRightIcon(null);
    setWhite(false);
    setTitle("Add Shadow User");
    setFixed(false);
  }, [setRightIcon, setWhite, setTitle, setFixed]);

  useEffect(() => {
    if (!successDialogOpen) return;
    const timer = setTimeout(() => {
      setSuccessDialogOpen(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [successDialogOpen]);

  const { cg } = useUser();

  const { mutate } = useGraphQL();
  // Pass the mutate function to the useMutation hook from react-query
  const { mutate: addShadowUser } = useMutation({
    mutationFn: ({
      name,
      contact,
      gender,
      dob,
      cg,
    }: {
      name: string;
      contact: string;
      dob: string;
      gender: string;
      cg: string;
    }) => {
      return mutate(addShadowUserFn, {
        name,
        contact,
        gender,
        cg,
        dob,
      });
    },
  });

  return (
    <>
      <Popup
        isOpen={successDialogOpen}
        title="Created Shadow User"
        onClose={() => setSuccessDialogOpen(false)}
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
        <p className="text-sm text-[#92969D]">
          Please complete all fields so we can learn more about you! This will
          help us assign you to the group that fits you best.
        </p>
        <Formik<ShadowUserForm>
          initialValues={{
            name: "",
            contact: "",
            gender: "",
            dob: "",
            occupation: "",
            remark: "",
          }}
          validateOnChange={false}
          onSubmit={(values, action) => {
            action.setSubmitting(true);

            addShadowUser(
              { ...values, cg: cg ?? "" },
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
            dob: Yup.date(),
            occupation: Yup.string(),
            remark: Yup.string(),
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
              <DateInput label="Date of birth" name="dob" />
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
                type="submit"
                label="Add"
                onClick={submitForm}
              />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
