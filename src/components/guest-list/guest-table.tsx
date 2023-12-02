import { AiOutlineHome } from 'react-icons/ai';
import { CiMail } from 'react-icons/ci';
import { FaSort } from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi2';
import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { sharedStyles } from '../shared-styles';

import { type Dispatch, type SetStateAction } from 'react';
import {
  type Household,
  type Event,
  type HouseholdFormData,
} from '~/types/schema';

type GuestTableProps = {
  events: Event[];
  households: Household[];
  setPrefillHousehold: Dispatch<SetStateAction<HouseholdFormData | undefined>>;
};

export default function GuestTable({
  events,
  households,
  setPrefillHousehold,
}: GuestTableProps) {
  return (
    <div className={sharedStyles.desktopPaddingSidesGuestList}>
      <div className='box-border max-h-[80vh] overflow-auto'>
        <div
          className='guest-table grid min-w-fit items-center gap-12 border-b py-6 pl-8 font-light italic text-gray-600'
          style={{
            gridTemplateColumns: `40px 240px 100px 125px repeat(${events.length}, 175px) 175px`,
          }}
        >
          <div>
            <input
              style={{ accentColor: sharedStyles.primaryColorHex }}
              type='checkbox'
              id='check-all'
              className='h-6 w-6 cursor-pointer'
            />
          </div>
          <div className='flex cursor-pointer items-center gap-2'>
            <h5>Name</h5>
            <FaSort size={14} />
          </div>
          <div className='flex cursor-pointer items-center gap-2'>
            <h5>Party Of</h5>
            <FaSort size={14} />
          </div>
          <h5>Contact</h5>
          {events?.map((event) => {
            return <h5 key={event.id}>{event.name} RSVP</h5>;
          })}
          <h5>My Notes</h5>
        </div>

        <div className='text-md min-w-fit border-l border-r'>
          {households?.map((household) => (
            <TableRow
              key={household.id}
              household={household}
              events={events}
              setPrefillHousehold={setPrefillHousehold}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type TableRowProps = {
  household: Household;
  events: Event[];
  setPrefillHousehold: Dispatch<SetStateAction<HouseholdFormData | undefined>>;
};

const TableRow = ({
  household,
  events,
  setPrefillHousehold,
}: TableRowProps) => {
  const toggleGuestForm = useToggleGuestForm();

  const handleEditHousehold = () => {
    console.log('clciked', household);
    setPrefillHousehold({
      address1: household.address1 ?? undefined,
      address2: household.address2 ?? undefined,
      city: household.city ?? undefined,
      state: household.state ?? undefined,
      country: household.country ?? undefined,
      zipCode: household.zipCode ?? undefined,
      phone: household.phone ?? undefined,
      email: household.email ?? undefined,
      notes: household.notes ?? undefined,
      guestParty: household.guests.map((guest) => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        invites:
          guest?.invitations?.map((invitation) => invitation.eventId) ?? [],
      })),
    });
    toggleGuestForm();
  };

  return (
    <div
      key={household.id}
      className='guest-table grid min-w-fit cursor-pointer items-center gap-12 border-b py-5 pl-8'
      style={{
        gridTemplateColumns: `40px 240px 100px 125px repeat(${events.length}, 175px) 175px`,
      }}
      // TODO: use state to initialize guest form with household data like in event form
      onClick={() => handleEditHousehold()}
    >
      <div className='flex flex-col gap-1'>
        {household.guests.map((guest) => {
          return (
            <div key={guest.id}>
              <input
                className='h-6 w-6 cursor-pointer'
                style={{
                  accentColor: sharedStyles.primaryColorHex,
                }}
                type='checkbox'
                id={`check-guest-${guest.id}`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          );
        })}
      </div>

      <div className='flex flex-col gap-2'>
        {household.guests.map((guest) => {
          return (
            <span key={guest.id}>{`${guest.firstName} ${guest.lastName}`}</span>
          );
        })}
      </div>

      <p>{household.guests.length}</p>

      <div className='flex gap-2'>
        <AiOutlineHome size={22} />
        <HiOutlinePhone size={22} />
        <CiMail size={23} />
      </div>

      {events?.map((event) => {
        return (
          <div key={event.id} className='flex flex-col gap-2'>
            {household.guests.map((guest) => {
              return (
                <div key={guest.id} className='flex items-center'>
                  <select
                    name='guestRSVP'
                    id={`guest-rsvp-${guest.id}`}
                    className='pr-3 font-light tracking-tight'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value='Not Invited'>Not Invited</option>
                    <option value='Invited'>Invited</option>
                    <option value='Attending'>Attending</option>
                    <option value='Declined'>Declined</option>
                  </select>
                </div>
              );
            })}
          </div>
        );
      })}

      <p>{household.notes ?? '-'}</p>
    </div>
  );
};
