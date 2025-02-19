import React, { useState } from 'react';
import Input from '../Input';
import ProfileIcon from '../ProfileIcon';

interface FormData {
  name: string;
  phone: string;
  phoneCountryCode: string;
  gender: string;
  dob: string;
  occupation: string;
  remark: string;
}

const InputDemo: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    phoneCountryCode: '+60',
    gender: '',
    dob: '',
    occupation: '',
    remark: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name === 'phone-countryCode' ? 'phoneCountryCode' : name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <div className="flex items-center justify-center mb-6">
        <ProfileIcon 
          imageUrl="/vite.svg"
          size={80}
          isVerified={true}
          alt="User profile"
        />
      </div>

      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Please enter the name"
      />

      <Input
        label="Contact No."
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter your phone number"
        countryCode={['+60', '+65', '+61']}
        selectedCountryCode={formData.phoneCountryCode}
      />

      <Input
        label="Gender"
        name="gender"
        type="radio"
        value={formData.gender}
        onChange={handleChange}
        options={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]}
      />

      <Input
        label="Date of Birth"
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleChange}
      />

      <Input
        label="Occupation"
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
        placeholder="Please enter the occupation"
      />

      <Input
        label="Remark"
        name="remark"
        value={formData.remark}
        onChange={handleChange}
        placeholder="Only you can see this remark"
      />

      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
};

export default InputDemo;
