import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../../../Redux/slices/currentUserSlice.js';

const UserSettings = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { userInfo, isLoading, error } = useSelector(state => state.user);
  const [avatar, setAvatar] = useState(null);
  const [contactNumber, setContactNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default to US

  useEffect(() => {
    if (!userInfo) {
      console.log("No user Info Found in User Settings.jsx"); 
    } else {
      setValue('fullName', userInfo.fullName);
      setValue('email', userInfo.email);
      setContactNumber(userInfo.contactNumber || '');
      setCountryCode(userInfo.countryCode || '+91'); // Adjust for country code
    }
  }, [dispatch, userInfo, setValue]);

  const onSubmit = async (formData) => {
    const formDataWithFile = new FormData();
    formDataWithFile.append('fullName', formData.fullName);
    formDataWithFile.append('email', formData.email);
    formDataWithFile.append('contactNumber', `${contactNumber}`);

    if (avatar) {
      formDataWithFile.append('avatar', avatar);
    }

    dispatch(updateUserProfile(formDataWithFile));
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-md shadow-lg max-w-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Update Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Full Name:</label>
          <input
            {...register('fullName', { required: 'Full Name is required' })}
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email:</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
                message: 'Enter a valid email address',
              },
            })}
            type="email"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Contact Number:</label>
          <div className="flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              {/* Add more country codes as needed */}
            </select>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="border border-gray-300 rounded-r-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="1234567890"
            />
          </div>
          {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Avatar:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
      </form>
    </div>
  );
};

export default UserSettings;
