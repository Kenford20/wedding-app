import { sharedStyles } from '../shared-styles';
import { type GuestPartyFormData, type Event } from '~/types/schema';
import { type Dispatch, type SetStateAction } from 'react';
import { FiMinusCircle } from 'react-icons/fi';

type guestNameFormProps = {
  events: Event[];
  guestIndex: number;
  guestParty: GuestPartyFormData;
  setGuestParty: Dispatch<SetStateAction<GuestPartyFormData[]>>;
};

export const GuestNameForm = ({
  events,
  guestIndex,
  guestParty,
  setGuestParty,
}: guestNameFormProps) => {
  const handleRemoveGuest = () => {
    setGuestParty((prev) => prev.filter((guest, i) => i !== guestIndex));
  };

  const handleSelectEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    event: Event,
    index: number
  ) => {
    if (e.target.checked) {
      setGuestParty((prev) => {
        const updatedParty = prev.slice();
        const oldInvites: string[] | undefined = updatedParty[index]?.invites;
        updatedParty[index] = {
          ...updatedParty[index]!,
          invites: [...oldInvites!, event.id],
        };

        return updatedParty;
      });
    } else {
      setGuestParty((prev) => {
        const updatedParty = prev.slice();
        updatedParty[index] = {
          ...updatedParty[index]!,
          invites:
            updatedParty[index]?.invites!.filter((ev) => ev !== event.id) ?? [],
        };

        return updatedParty;
      });
    }
  };

  const handleNameChange = (field: string, input: string, index: number) => {
    setGuestParty((prev) => {
      const updatedParty = prev.slice();
      updatedParty[index] = {
        ...updatedParty[index]!,
        [field]: input,
      };

      return updatedParty;
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
            value={guestParty.firstName}
            onChange={(e) =>
              handleNameChange('firstName', e.target.value, guestIndex)
            }
          />
          <input
            className='w-1/2 border p-3'
            placeholder='Last Name*'
            value={guestParty.lastName}
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
                  <input
                    className='h-6 w-6 cursor-pointer border p-3'
                    style={{ accentColor: sharedStyles.primaryColorHex }}
                    type='checkbox'
                    id={`guest${guestIndex}: ${event.id}`}
                    onChange={(e) => handleSelectEvent(e, event, guestIndex)}
                  />
                  <label
                    className='cursor-pointer'
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
