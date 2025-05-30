import { Field, useFormikContext } from "formik";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import React, { useState } from "react";

interface InputProps {
  label: string;
  name: string;
  type?: "text" | "tel" | "radio" | "date";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  countryCode?: string[];
  selectedCountryCode?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  options = [],
}) => {
  const { errors } = useFormikContext();

  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="text-dark block text-sm">
          {label} {required && "*"}
        </label>

        {type === "radio" && options.length > 0 ? (
          <div className="flex space-x-4">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center space-x-2"
              >
                <Field
                  type="radio"
                  name={name}
                  className="form-radio text-blue-600"
                  value={option.value}
                />
                <span className="text-dark">{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <Field
            type={type}
            name={name}
            placeholder={placeholder}
            required={required}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 placeholder:text-[#92969D] focus:outline-none"
          />
        )}
      </div>
      {errors[name as keyof typeof errors] ? (
        <div className="w-full text-end text-xs text-red-600 italic">
          {errors[name as keyof typeof errors]}
        </div>
      ) : (
        <div className="h-16px" />
      )}
    </div>
  );
};

export default Input;

export const TelInput: React.FC<InputProps> = ({
  label,
  name,
  required,
  placeholder,
}) => {
  const { errors, setFieldValue } = useFormikContext();
  const [countryCode, setCountryCode] = useState("+60");
  const [telLine, setTelLine] = useState("");

  const supportedCountries = getCountries();
  const uniqueCountryCode = [
    ...new Set(
      supportedCountries
        .map((a) => getCountryCallingCode(a))
        .sort((a, b) => Number(a) - Number(b)),
    ),
  ];
  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="block text-sm text-[#191D1A]">
          {label} {required && "*"}
        </label>
        <div className="flex items-center rounded-md border border-gray-300 bg-white">
          <select
            className="w-20 max-w-36 rounded-l-md bg-white py-2.5 pl-3 placeholder:text-[#92969D] focus:outline-none"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setFieldValue(name, `${e.target.value}${telLine}`);
            }}
          >
            {uniqueCountryCode
              .sort((a, b) => Number(a) - Number(b))
              .map((code) => (
                <option key={code} value={`+${code}`}>
                  {`+${code}`}
                </option>
              ))}
          </select>
          <div className="px-2 text-[#92969D]">|</div>
          <input
            placeholder={placeholder}
            type="tel"
            name={name}
            onChange={(e) => {
              setFieldValue(name, `${countryCode}${e.target.value}`);
              setTelLine(e.target.value);
            }}
            value={telLine}
            className="w-full rounded-r-md bg-white py-2.5 pr-3 placeholder:text-[#92969D] focus:outline-none"
          />
        </div>
      </div>
      {errors[name as keyof typeof errors] ? (
        <div className="w-full text-end text-xs text-red-600 italic">
          {errors[name as keyof typeof errors]}
        </div>
      ) : (
        <div className="h-[16px]" />
      )}
    </div>
  );
};

export const DateInput: React.FC<InputProps> = ({
  label,
  required,
  placeholder,
  name,
}) => {
  const { errors, setFieldValue, values } = useFormikContext();
  return (
    <div className="flex w-full flex-col gap-0.5">
      <div className="flex w-full flex-col gap-2">
        <label className="block text-sm text-[#191D1A]">
          {label} {required && "*"}
        </label>
        <Field
          name={name}
          type="date"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 placeholder:text-[#92969D] focus:outline-none"
        />
      </div>
      {errors[name as keyof typeof errors] ? (
        <div className="w-full text-end text-xs text-red-600 italic">
          {errors[name as keyof typeof errors]}
        </div>
      ) : (
        <div className="h-[16px]" />
      )}
    </div>
  );
};
