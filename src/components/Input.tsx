import React from "react";

interface InputProps {
  label: string;
  name: string;
  type?: "text" | "tel" | "radio" | "date";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
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
  value,
  onChange,
  required = false,
  placeholder,
  options = [],
  countryCode = [],
  selectedCountryCode,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "radio" && options.length > 0 ? (
        <div className="flex space-x-4">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center space-x-2"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      ) : type === "tel" ? (
        <div className="flex space-x-2">
          <select
            className="w-20 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedCountryCode ?? countryCode[0]}
            name={`${name}-countryCode`}
            onChange={onChange}
          >
            {countryCode.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            type="tel"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      )}
    </div>
  );
};

export default Input;
