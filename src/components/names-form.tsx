'use client';

import { useState } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from './loader';

export default function NamesForm() {
  const hello = api.website.hello.useQuery({ text: 'from tRPC' });

  const { mutate: createWebsite, isLoading: isCreatingWebsite } =
    api.website.create.useMutation({
      onSuccess: () => createEvent({ eventName: 'Wedding Day' }),
    });

  const { mutate: createEvent, isLoading: isCreatingEvent } =
    api.event.create.useMutation({
      onSuccess: () => (window.location.href = '/dashboard'),
      // onError: (e) => {
      //   const errorMessage = e.data?.zodError?.fieldErrors.content;
      //   if (errorMessage && errorMessage[0]) {
      //     toast.error(errorMessage[0]);
      //   } else {
      //     toast.error("Failed to post! Please try again later.");
      //   }
      // },
    });

  const [nameData, setNameData] = useState({
    firstName: '',
    lastName: '',
    partnerFirstName: '',
    partnerLastName: '',
  });

  const handleOnChange = (field: string, input: string) => {
    setNameData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
  };

  return (
    <div className='container flex flex-col items-center justify-center gap-6 px-4 py-16 '>
      {(isCreatingWebsite || isCreatingEvent) && (
        <div className='flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      )}
      <p>{hello.data ? hello.data.greeting : 'Loading tRPC query...'}</p>
      <h1 className='text-3xl'>Welcome ya love birds! Enter your names</h1>
      <input
        placeholder='First name'
        className='rounded-md border-2 border-slate-400 p-4'
        value={nameData.firstName}
        onChange={(e) => handleOnChange('firstName', e.target.value)}
      />
      <input
        placeholder='Last name'
        className='rounded-md border-2 border-slate-400 p-4'
        value={nameData.lastName}
        onChange={(e) => handleOnChange('lastName', e.target.value)}
      />
      <input
        placeholder="Partner's first name"
        className='rounded-md border-2 border-slate-400 p-4'
        value={nameData.partnerFirstName}
        onChange={(e) => handleOnChange('partnerFirstName', e.target.value)}
      />
      <input
        placeholder="Partner's last name"
        className='rounded-md border-2 border-slate-400 p-4'
        value={nameData.partnerLastName}
        onChange={(e) => handleOnChange('partnerLastName', e.target.value)}
      />
      <button
        onClick={() => createWebsite(nameData)}
        className='rounded-full bg-pink-400 px-20 py-4 text-white'
      >
        Create our website!
      </button>
    </div>
  );
}
