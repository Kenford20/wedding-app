'use client';

import { useState, useRef } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../loader';
import { sharedStyles } from '../shared-styles';
import { useToggleEventForm } from '~/contexts/event-form-context';

import { type Dispatch, type SetStateAction } from 'react';
import { type EventFormData, type Event } from '../../types/schema';

type EventFormProps = {
  setEvents: Dispatch<SetStateAction<Event[] | undefined>>;
  prefillFormData: EventFormData | undefined;
};

const defaultFormData = {
  eventName: '',
  date: '',
  startTime: '',
  endTime: '',
  venue: '',
  attire: '',
  description: '',
};

export default function EventForm({
  setEvents,
  prefillFormData,
}: EventFormProps) {
  const toggleEventForm = useToggleEventForm();
  const { mutate, isLoading: isCreatingEvent } = api.event.create.useMutation({
    onSuccess: (createdEvent) => {
      toggleEventForm();
      setEvents((prevEvents) =>
        prevEvents ? [...prevEvents, createdEvent] : [createdEvent]
      );
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.eventName;
      if (errorMessage?.[0]) window.alert(errorMessage);
      else window.alert('Failed to create event! Please try again later.');
    },
  });

  const [eventFormData, setEventFormData] = useState(
    prefillFormData ?? defaultFormData
  );
  const formRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (field: string, input: string) => {
    setEventFormData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
  };

  return (
    <div
      ref={formRef}
      className='fixed top-0 z-10 flex h-screen w-screen justify-end bg-transparent/[0.5]'
    >
      {isCreatingEvent && (
        <div className='flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      )}
      <div className='h-full w-[500px] bg-white'>
        <div className='flex justify-between border-b p-5'>
          <h1 className='text-xl font-semibold'>Add Event</h1>
          <span className='cursor-pointer' onClick={() => toggleEventForm()}>
            X
          </span>
        </div>
        <div className='p-5'>
          <h2 className='mb-3 text-xl font-semibold'>Event Information</h2>
          <div className='grid grid-cols-1 grid-rows-[repeat(6,50px)] gap-3'>
            <input
              placeholder='Event Name*'
              value={eventFormData.eventName}
              onChange={(e) => handleOnChange('eventName', e.target.value)}
              className='w-100 border p-3'
            />

            <input
              placeholder='MM/DD/YYYY'
              value={eventFormData.date}
              onChange={(e) => handleOnChange('date', e.target.value)}
              className='w-100 border p-3'
            />
            <div className='flex gap-3'>
              <select
                value={eventFormData.startTime}
                onChange={(e) => handleOnChange('startTime', e.target.value)}
                className='w-1/2 border p-3'
              >
                <option defaultValue='Start Time'>Start Time</option>
                <option>12:00 PM</option>
                <option>12:15 PM</option>
                <option>12:30 PM</option>
              </select>
              <select
                value={eventFormData.endTime}
                onChange={(e) => handleOnChange('endTime', e.target.value)}
                className='w-1/2 border p-3'
              >
                <option defaultValue='End Time'>End Time</option>
                <option>12:00 PM</option>
                <option>12:15 PM</option>
                <option>12:30 PM</option>
              </select>
            </div>
            <input
              placeholder='Venue Name'
              value={eventFormData.venue}
              onChange={(e) => handleOnChange('venue', e.target.value)}
              className='w-100 border p-3'
            />
            <input
              placeholder='Attire'
              value={eventFormData.attire}
              onChange={(e) => handleOnChange('attire', e.target.value)}
              className='w-100 border p-3'
            />
            <input
              placeholder='Description'
              value={eventFormData.description}
              onChange={(e) => handleOnChange('description', e.target.value)}
              className='w-100 border p-3'
            />
          </div>
        </div>
        <div
          className='fixed bottom-0 flex gap-5 border-t px-8 py-5'
          style={{ width: 'inherit' }}
        >
          <button
            className={`w-1/2 ${sharedStyles.secondaryButton({
              px: 'px-12',
              py: 'py-2',
            })}`}
            onClick={() => toggleEventForm()}
          >
            Cancel
          </button>
          <button
            className={`w-1/2 ${sharedStyles.primaryButton({
              px: 'px-12',
              py: 'py-2',
            })}`}
            onClick={() => mutate(eventFormData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
