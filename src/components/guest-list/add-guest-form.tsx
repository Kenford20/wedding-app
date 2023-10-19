'use client';

import { useState } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../loader';

type AddGuestFormProps = {
  setShowGuestForm: (x: boolean) => void;
};

export default function AddGuestForm({ setShowGuestForm }: AddGuestFormProps) {
  const { mutate, isLoading: isCreatingGuest } = api.guest.create.useMutation();
  const [guestFormData, setGuestFormData] = useState({
    guestFirstName: '',
    guestLastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    notes: '',
  });

  const handleOnChange = (field: string, input: string) => {
    setGuestFormData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
    console.log(guestFormData);
  };

  const handleSaveGuest = () => {
    console.log(guestFormData);
    mutate(guestFormData);
    setShowGuestForm(false);
  };

  return (
    <div className='absolute top-0 flex h-screen w-screen justify-end bg-transparent/[0.5]'>
      {isCreatingGuest && (
        <div className='flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      )}
      <div></div>
      <div className='h-screen w-1/3 bg-pink-200'>
        <div className='bottom-2 border'>
          <h1>Add Party</h1>
          <span
            className='cursor-pointer'
            onClick={() => setShowGuestForm(false)}
          >
            X
          </span>
        </div>
        <div>
          <h2>Guest Name</h2>
          <input
            placeholder='First Name'
            value={guestFormData.guestFirstName}
            onChange={(e) => handleOnChange('guestFirstName', e.target.value)}
          />
          <input
            placeholder='Last Name'
            value={guestFormData.guestLastName}
            onChange={(e) => handleOnChange('guestLastName', e.target.value)}
          />
        </div>
        <div>
          <h3>Invite to the following events:</h3>
          <input type='checkbox' id='rehearsal-dinner'></input>
          <span>Rehearsal Dinner</span>
          <input type='checkbox' id='wedding-day'></input>
          <span>Wedding Day</span>
        </div>
        <button>+ Add A Guest To This Party</button>
        <div>
          <h2>Contact Information</h2>
          <input
            placeholder='Street Address'
            value={guestFormData.address1}
            onChange={(e) => handleOnChange('address1', e.target.value)}
          />
          <input
            placeholder='Apt/Suite/Other'
            value={guestFormData.address2}
            onChange={(e) => handleOnChange('address2', e.target.value)}
          />
          <input
            placeholder='City'
            value={guestFormData.city}
            onChange={(e) => handleOnChange('city', e.target.value)}
          />
          <select
            value={guestFormData.state}
            onChange={(e) => handleOnChange('state', e.target.value)}
          >
            <option defaultValue='State'>State</option>
            <option>AL</option>
            <option>AR</option>
            <option>WY</option>
          </select>
          <input
            placeholder='Zip Code'
            value={guestFormData.zipCode}
            onChange={(e) => handleOnChange('zipCode', e.target.value)}
          />
          <select
            value={guestFormData.country}
            onChange={(e) => handleOnChange('country', e.target.value)}
          >
            <option defaultValue='State'>Country</option>
            <option>Murca</option>
            <option>Mexico</option>
            <option>Canada</option>
          </select>
          <input
            placeholder='Phone'
            value={guestFormData.phoneNumber}
            onChange={(e) => handleOnChange('phoneNumber', e.target.value)}
          />
          <input
            placeholder='Email'
            value={guestFormData.email}
            onChange={(e) => handleOnChange('email', e.target.value)}
          />
          <h2>My Notes</h2>
          <textarea
            placeholder='Enter notes about your guests, like food allergies'
            value={guestFormData.notes}
            onChange={(e) => handleOnChange('notes', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => setShowGuestForm(false)}>Cancel</button>
          <button onClick={() => handleSaveGuest()}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}
