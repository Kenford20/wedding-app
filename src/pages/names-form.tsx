'use client';

import { useState } from 'react';
import { api } from '~/utils/api';

interface NamesFormProps {}

export default function NamesForm(props: NamesFormProps) {
  const hello = api.websiteUrls.hello.useQuery({ text: 'from tRPC' });
  const { mutate } = api.websiteUrls.create.useMutation();

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
        onClick={() => mutate(nameData)}
        className='rounded-full bg-pink-400 px-20 py-4 text-white'
      >
        Create our website!
      </button>
    </div>
  );
}
