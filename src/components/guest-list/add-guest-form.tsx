'use client';

import { useState } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../loader';

type Event = {
  id: string;
  name: string;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  venue: string | null;
  attire: string | null;
  description: string | null;
  userId: string;
};

type AddGuestFormProps = {
  setShowGuestForm: (x: boolean) => void;
  events: Event[];
};

export default function AddGuestForm({
  setShowGuestForm,
  events,
}: AddGuestFormProps) {
  const { mutate, isLoading: isCreatingGuest } = api.guest.create.useMutation({
    onSuccess: () => {
      setShowGuestForm(false);
    },
    onError: (err) => {
      const errorMessage =
        err.data?.zodError?.fieldErrors?.firstName ??
        err.data?.zodError?.fieldErrors?.lastName;
      if (errorMessage?.[0]) window.alert('Full name required');
      else window.alert('Failed to create event! Please try again later.');
    },
  });

  const [guestFormData, setGuestFormData] = useState({
    firstName: '',
    lastName: '',
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

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const handleOnChange = (field: string, input: string) => {
    setGuestFormData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
  };

  const handleSelectEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    event: Event
  ) => {
    if (e.target.checked) {
      setSelectedEvents((prevEvents) => [...prevEvents, event.id]);
    } else {
      setSelectedEvents((prevEvents) =>
        prevEvents.filter((ev) => ev !== event.id)
      );
    }
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
            value={guestFormData.firstName}
            onChange={(e) => handleOnChange('firstName', e.target.value)}
          />
          <input
            placeholder='Last Name'
            value={guestFormData.lastName}
            onChange={(e) => handleOnChange('lastName', e.target.value)}
          />
        </div>
        <div>
          <h3>Invite to the following events:</h3>
          {events?.map((event) => {
            return (
              <>
                <input
                  type='checkbox'
                  id={event.id}
                  onChange={(e) => handleSelectEvent(e, event)}
                />
                <label htmlFor={event.id}>{event.name}</label>
              </>
            );
          })}
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
          <button
            onClick={() =>
              mutate({ ...guestFormData, eventIds: selectedEvents })
            }
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
