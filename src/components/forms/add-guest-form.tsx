'use client';

import { useState } from 'react';
import { api } from '~/utils/api';
import { sharedStyles } from '../shared-styles';
import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { useDisablePageScroll } from '../helpers';
import { GuestNameForm } from './guest-names';
import { IoMdClose } from 'react-icons/io';

import { type Dispatch, type SetStateAction } from 'react';
import {
  type Event,
  type Household,
  type HouseholdFormData,
} from '../../types/schema';

const defaultContactData = {
  address1: undefined,
  address2: undefined,
  city: undefined,
  state: undefined,
  country: undefined,
  zipCode: undefined,
  phoneNumber: undefined,
  email: undefined,
  notes: undefined,
};

const defaultHouseholdFormData: HouseholdFormData = {
  ...defaultContactData,
  guestParty: [
    {
      firstName: '',
      lastName: '',
      invites: [],
    },
  ],
};

type AddGuestFormProps = {
  events: Event[];
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
  prefillHousehold: Household | undefined;
};

export default function AddGuestForm({
  events,
  setHouseholds,
  prefillHousehold,
}: AddGuestFormProps) {
  console.log('prefillHousehold', prefillHousehold);
  const toggleGuestForm = useToggleGuestForm();
  const { mutate, isLoading: isCreatingGuest } = api.guest.create.useMutation({
    onSuccess: (createdHousehold) => {
      closeForm && toggleGuestForm();
      setHouseholdFormData(defaultHouseholdFormData);
      setHouseholds((prevHouseholds: Household[] | undefined) =>
        prevHouseholds
          ? [...prevHouseholds, createdHousehold]
          : [createdHousehold]
      );
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.guestParty;
      if (errorMessage?.[0])
        window.alert('Please fill in the full name for all guests!');
      else window.alert('Failed to create event! Please try again later.');
    },
  });

  const [householdFormData, setHouseholdFormData] = useState<HouseholdFormData>(
    defaultHouseholdFormData
  );
  const [contactData, setContactData] = useState(defaultContactData);
  const [closeForm, setCloseForm] = useState<boolean>(false);

  useDisablePageScroll();

  const handleOnChange = (field: string, input: string) => {
    setContactData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
  };

  const handleAddGuestToParty = () => {
    setHouseholdFormData((prev) => {
      return {
        ...prev,
        guestParty: [
          ...prev.guestParty,
          {
            firstName: '',
            lastName: '',
            invites: [],
          },
        ],
      };
    });
  };

  return (
    <div className='fixed top-0 z-50 flex h-screen w-screen justify-end overflow-y-scroll bg-transparent/[0.5] pb-16'>
      <div className='relative h-fit w-[525px] bg-white'>
        <div className='flex justify-between border-b p-5'>
          <h1 className='text-xl font-semibold'>Add Party</h1>
          <span className='cursor-pointer' onClick={() => toggleGuestForm()}>
            <IoMdClose size={25} />
          </span>
        </div>
        {householdFormData?.guestParty.map((guest, i) => {
          return (
            <div key={i}>
              <GuestNameForm
                events={events}
                guestIndex={i}
                guest={guest}
                setHouseholdFormData={setHouseholdFormData}
              />
            </div>
          );
        })}
        <div className='mt-3 text-center'>
          <button
            onClick={() => handleAddGuestToParty()}
            className={`text-${sharedStyles.primaryColor}`}
          >
            + Add A Guest To This Party
          </button>
        </div>
        <div className='p-5'>
          <h2 className='mb-3 text-xl font-semibold'>Contact Information</h2>
          <div className='grid grid-cols-1 grid-rows-[repeat(5,50px)] gap-3'>
            <input
              className='w-100 border p-3'
              placeholder='Street Address'
              value={contactData.address1}
              onChange={(e) => handleOnChange('address1', e.target.value)}
            />
            <input
              className='w-100 border p-3'
              placeholder='Apt/Suite/Other'
              value={contactData.address2}
              onChange={(e) => handleOnChange('address2', e.target.value)}
            />
            <div className='flex gap-3'>
              <input
                className='w-1/2 border p-3'
                placeholder='City'
                value={contactData.city}
                onChange={(e) => handleOnChange('city', e.target.value)}
              />
              <select
                value={contactData.state}
                onChange={(e) => handleOnChange('state', e.target.value)}
                className='w-1/4 border p-3'
              >
                <option defaultValue='State'>State</option>
                <option>AL</option>
                <option>AR</option>
                <option>WY</option>
              </select>
              <input
                className='w-1/4 border p-3'
                placeholder='Zip Code'
                value={contactData.zipCode}
                onChange={(e) => handleOnChange('zipCode', e.target.value)}
              />
            </div>
            <select
              className='w-100 border p-3'
              value={contactData.country}
              onChange={(e) => handleOnChange('country', e.target.value)}
            >
              <option defaultValue='State'>Country</option>
              <option>Murca</option>
              <option>Mexico</option>
              <option>Canada</option>
            </select>
            <div className='flex gap-3'>
              <input
                className='w-1/2 border p-3'
                placeholder='Phone'
                value={contactData.phoneNumber}
                onChange={(e) => handleOnChange('phoneNumber', e.target.value)}
              />
              <input
                className='w-1/2 border p-3'
                placeholder='Email'
                value={contactData.email}
                onChange={(e) => handleOnChange('email', e.target.value)}
              />
            </div>
          </div>
          <h2 className='my-4 text-xl font-semibold'>My Notes</h2>
          <textarea
            placeholder='Enter notes about your guests, like food allergies'
            value={contactData.notes}
            onChange={(e) => handleOnChange('notes', e.target.value)}
            className='h-32 w-full border p-3'
            style={{ resize: 'none' }}
          />
        </div>
        <div
          className='fixed bottom-0 flex flex-col gap-3 border-t bg-white px-3 py-5'
          style={{ width: 'inherit' }}
        >
          <div className='flex gap-3 text-sm'>
            <button
              disabled={isCreatingGuest}
              onClick={() => {
                setCloseForm(true);
                mutate(householdFormData);
              }}
              className={`w-1/2 ${sharedStyles.secondaryButton({
                py: 'py-2',
                isLoading: isCreatingGuest,
              })}`}
            >
              {isCreatingGuest ? 'Processing...' : 'Save & Close'}
            </button>
            <button
              disabled={isCreatingGuest}
              className={`w-1/2 ${sharedStyles.primaryButton({
                px: 'px-2',
                py: 'py-2',
                isLoading: isCreatingGuest,
              })}`}
              onClick={() => {
                setCloseForm(false);
                mutate(householdFormData);
              }}
            >
              {isCreatingGuest ? 'Processing...' : 'Save & Add Another Guest'}
            </button>
          </div>
          <button
            onClick={() => toggleGuestForm()}
            className={`text-sm font-semibold ${
              isCreatingGuest ? 'cursor-not-allowed' : 'hover:underline'
            } ${
              isCreatingGuest
                ? 'text-pink-200'
                : `text-${sharedStyles.primaryColor}`
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
