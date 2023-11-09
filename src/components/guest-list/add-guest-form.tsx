'use client';

import { useState, useEffect, useRef } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../loader';
import { sharedStyles } from '../shared-styles';
import { type Event, type Guest } from '../../types/schema';

type AddGuestFormProps = {
  setShowGuestForm: (x: boolean) => void;
  events: Event[];
  setGuests: Dispatch<SetStateAction<Guest[] | undefined>>;
};

export default function AddGuestForm({
  setShowGuestForm,
  events,
  setGuests,
}: AddGuestFormProps) {
  const { mutate, isLoading: isCreatingGuest } = api.guest.create.useMutation({
    onSuccess: (createdGuest) => {
      setShowGuestForm(false);
      setGuests((prevGuests) =>
        prevGuests ? [...prevGuests, createdGuest] : [createdGuest]
      );
    },
    onError: (err) => {
      const errorMessage =
        err.data?.zodError?.fieldErrors?.firstName ??
        err.data?.zodError?.fieldErrors?.lastName;
      if (errorMessage?.[0]) window.alert('Full name required');
      else window.alert('Failed to create event! Please try again later.');
    },
  });

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
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
  const formRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    formRef?.current?.classList.add('overflow-scroll');
  }, []);

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
    <div
      className='fixed top-0 flex h-screen w-screen justify-end bg-transparent/[0.5] pb-16'
      ref={formRef}
    >
      {isCreatingGuest && (
        <div className='flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      )}
      <div className='h-fit w-[500px] bg-white'>
        <div className='flex justify-between border-b p-5'>
          <h1 className='text-xl font-semibold'>Add Party</h1>
          <span
            className='cursor-pointer'
            onClick={() => setShowGuestForm(false)}
          >
            X
          </span>
        </div>
        <div className='p-5'>
          <h2 className='mb-3 text-xl font-semibold'>Guest Name</h2>
          <div className='flex justify-between gap-3'>
            <input
              className='w-1/2 border p-3'
              placeholder='First Name*'
              value={guestFormData.firstName}
              onChange={(e) => handleOnChange('firstName', e.target.value)}
            />
            <input
              className='w-1/2 border p-3'
              placeholder='Last Name*'
              value={guestFormData.lastName}
              onChange={(e) => handleOnChange('lastName', e.target.value)}
            />
          </div>
        </div>
        <div className='p-5'>
          <h3 className='mb-3 text-gray-400'>
            Invite to the following events:
          </h3>
          <div className='grid grid-cols-2 gap-3'>
            {events?.map((event) => {
              return (
                <div key={event.id}>
                  <div className='flex items-center gap-3'>
                    <input
                      className='h-6 w-6 cursor-pointer border p-3'
                      style={{ accentColor: sharedStyles.primaryColorHex }}
                      type='checkbox'
                      id={event.id}
                      onChange={(e) => handleSelectEvent(e, event)}
                    />
                    <label className='cursor-pointer' htmlFor={event.id}>
                      {event.name}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className='mt-3 text-center'>
          <button className={`text-${sharedStyles.primaryColor}`}>
            + Add A Guest To This Party
          </button>
        </div>
        <div className='p-5'>
          <h2 className='mb-3 text-xl font-semibold'>Contact Information</h2>
          <div className='grid grid-cols-1 grid-rows-[repeat(5,50px)] gap-3'>
            <input
              className='w-100 border p-3'
              placeholder='Street Address'
              value={guestFormData.address1}
              onChange={(e) => handleOnChange('address1', e.target.value)}
            />
            <input
              className='w-100 border p-3'
              placeholder='Apt/Suite/Other'
              value={guestFormData.address2}
              onChange={(e) => handleOnChange('address2', e.target.value)}
            />
            <div className='flex gap-3'>
              <input
                className='w-1/2 border p-3'
                placeholder='City'
                value={guestFormData.city}
                onChange={(e) => handleOnChange('city', e.target.value)}
              />
              <select
                value={guestFormData.state}
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
                value={guestFormData.zipCode}
                onChange={(e) => handleOnChange('zipCode', e.target.value)}
              />
            </div>
            <select
              className='w-100 border p-3'
              value={guestFormData.country}
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
                value={guestFormData.phoneNumber}
                onChange={(e) => handleOnChange('phoneNumber', e.target.value)}
              />
              <input
                className='w-1/2 border p-3'
                placeholder='Email'
                value={guestFormData.email}
                onChange={(e) => handleOnChange('email', e.target.value)}
              />
            </div>
          </div>
          <h2 className='my-4 text-xl font-semibold'>My Notes</h2>
          <textarea
            placeholder='Enter notes about your guests, like food allergies'
            value={guestFormData.notes}
            onChange={(e) => handleOnChange('notes', e.target.value)}
            className='h-32 w-full border p-3'
            style={{ resize: 'none' }}
          />
        </div>
        <div
          className='fixed bottom-0 flex gap-3 border-t bg-white p-5'
          style={{ width: 'inherit' }}
        >
          <button
            onClick={() => setShowGuestForm(false)}
            className={`${sharedStyles.secondaryButton({
              px: 'px-12',
              py: 'py-2',
            })} w-1/2`}
          >
            Cancel
          </button>
          <button
            className={`${sharedStyles.primaryButton({
              px: 'px-12',
              py: 'py-2',
            })} w-1/2`}
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
