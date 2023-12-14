import { sharedStyles } from '../shared-styles';
import { FiMinusCircle } from 'react-icons/fi';

import { type Dispatch, type SetStateAction } from 'react';
import {
  type GuestFormData,
  type Event,
  type HouseholdFormData,
} from '~/types/schema';

type guestNameFormProps = {
  events: Event[];
  guestIndex: number;
  guest: GuestFormData;
  setHouseholdFormData: Dispatch<SetStateAction<HouseholdFormData>>;
};

export const GuestNameForm = ({
  events,
  guestIndex,
  guest,
  setHouseholdFormData,
}: guestNameFormProps) => {
  const handleRemoveGuest = () => {
    setHouseholdFormData((prev) => ({
      ...prev,
      guestParty: prev.guestParty.filter((guest, i) => i !== guestIndex),
    }));
  };

  const handleSelectEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    event: Event,
    index: number
  ) => {
    setHouseholdFormData((prev) => {
      const updatedParty = prev.guestParty.slice();
      const oldInvites = updatedParty[index]?.invites;
      updatedParty[index] = {
        ...updatedParty[index]!,
        invites: {
          ...oldInvites,
          [event.id]: e.target.checked ? 'Invited' : 'Not Invited',
        },
      };

      return {
        ...prev,
        guestParty: updatedParty,
      };
    });
  };

  const handleNameChange = (field: string, input: string, index: number) => {
    setHouseholdFormData((prev) => {
      const updatedParty = prev.guestParty.slice();
      updatedParty[index] = {
        ...updatedParty[index]!,
        [field]: input,
      };

      return {
        ...prev,
        guestParty: updatedParty,
      };
    });
  };

  return (
    <div>
      <div className='p-5'>
        <h2 className='mb-3 text-xl font-semibold'>Guest Name</h2>
        <div className='flex items-center justify-between gap-3'>
          <input
            className='w-1/2 border p-3'
            placeholder='First Name*'
            value={guest.firstName}
            onChange={(e) =>
              handleNameChange('firstName', e.target.value, guestIndex)
            }
          />
          <input
            className='w-1/2 border p-3'
            placeholder='Last Name*'
            value={guest.lastName}
            onChange={(e) =>
              handleNameChange('lastName', e.target.value, guestIndex)
            }
          />
          {guestIndex > 0 && (
            <div className='cursor-pointer' onClick={() => handleRemoveGuest()}>
              <FiMinusCircle size={28} color='gray' />
            </div>
          )}
        </div>
      </div>
      <div className='p-5'>
        <h3 className='mb-3 text-gray-400'>Invite to the following events:</h3>
        <div className='grid grid-cols-2 gap-3'>
          {events?.map((event: Event) => {
            return (
              <div key={event.id}>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center'>
                    <input
                      className='h-6 w-6 cursor-pointer border p-3'
                      style={{ accentColor: sharedStyles.primaryColorHex }}
                      type='checkbox'
                      id={`guest${guestIndex}: ${event.id}`}
                      onChange={(e) => handleSelectEvent(e, event, guestIndex)}
                      checked={guest.invites[event.id] === 'Invited'}
                    />
                  </div>
                  <label
                    className={`cursor-pointer ${sharedStyles.ellipsisOverflow}`}
                    htmlFor={`guest${guestIndex}: ${event.id}`}
                  >
                    {event.name}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
