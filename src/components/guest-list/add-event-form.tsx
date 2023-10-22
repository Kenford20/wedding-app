'use client';

import { useState } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../loader';

type AddEventFormProps = {
  setShowEventForm: (x: boolean) => void;
};

export default function AddEventForm({ setShowEventForm }: AddEventFormProps) {
  const { mutate, isLoading: isCreatingEvent } = api.event.create.useMutation();

  const [eventFormData, setEventFormData] = useState({
    eventName: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    attire: '',
    description: '',
  });

  const handleOnChange = (field: string, input: string) => {
    setEventFormData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
    console.log(eventFormData);
  };

  return (
    <div className='absolute top-0 flex h-screen w-screen justify-end bg-transparent/[0.5]'>
      {isCreatingEvent && (
        <div className='flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      )}
      <div></div>
      <div className='h-screen w-1/3 bg-pink-200'>
        <div className='bottom-2 border'>
          <h1>Add Event</h1>
          <span
            className='cursor-pointer'
            onClick={() => setShowEventForm(false)}
          >
            X
          </span>
        </div>
        <div>
          <h2>Event Information</h2>
          <input
            placeholder='Event Name*'
            value={eventFormData.eventName}
            onChange={(e) => handleOnChange('eventName', e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder='MM/DD/YYYY'
            value={eventFormData.date}
            onChange={(e) => handleOnChange('date', e.target.value)}
          />
          <select
            value={eventFormData.startTime}
            onChange={(e) => handleOnChange('startTime', e.target.value)}
          >
            <option defaultValue='Start Time'>Start Time</option>
            <option>12:00 PM</option>
            <option>12:15 PM</option>
            <option>12:30 PM</option>
          </select>
          <select
            value={eventFormData.endTime}
            onChange={(e) => handleOnChange('endTime', e.target.value)}
          >
            <option defaultValue='End Time'>End Time</option>
            <option>12:00 PM</option>
            <option>12:15 PM</option>
            <option>12:30 PM</option>
          </select>
          <input
            placeholder='Venue Name'
            value={eventFormData.venue}
            onChange={(e) => handleOnChange('venue', e.target.value)}
          />
          <input
            placeholder='Attire'
            value={eventFormData.attire}
            onChange={(e) => handleOnChange('attire', e.target.value)}
          />
          <input
            placeholder='Description'
            value={eventFormData.description}
            onChange={(e) => handleOnChange('description', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => setShowEventForm(false)}>Cancel</button>
          <button onClick={() => mutate(eventFormData)}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}
