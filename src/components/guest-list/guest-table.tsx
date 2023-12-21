import { AiOutlineHome } from 'react-icons/ai';
import { CiMail } from 'react-icons/ci';
import { FaSort } from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi2';
import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { sharedStyles } from '../shared-styles';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../loader';

import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  type Household,
  type Event,
  type HouseholdFormData,
  type FormInvites,
  type Guest,
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
          className='guest-table grid min-w-fit items-center gap-12 border-b px-8 py-6 font-light italic text-gray-600'
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
          {/* <h5>Gift</h5> */}
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
  if (household.guests.length < 1) return null;

  const handleEditHousehold = () => {
    setPrefillHousehold({
      householdId: household.id,
      address1: household.address1 ?? undefined,
      address2: household.address2 ?? undefined,
      city: household.city ?? undefined,
      state: household.state ?? undefined,
      country: household.country ?? undefined,
      zipCode: household.zipCode ?? undefined,
      phone: household.phone ?? undefined,
      email: household.email ?? undefined,
      notes: household.notes ?? undefined,
      guestParty: household.guests.map((guest) => {
        const invitations: FormInvites = {};
        guest?.invitations?.forEach((inv) => {
          invitations[inv.eventId] = inv.rsvp!;
        });
        return {
          guestId: guest.id,
          firstName: guest.firstName,
          lastName: guest.lastName,
          invites: invitations,
        };
      }),
    });
    toggleGuestForm();
  };

  return (
    <div
      key={household.id}
      className='guest-table grid min-w-fit cursor-pointer items-center gap-12 border-b px-8 py-5'
      style={{
        gridTemplateColumns: `40px 240px 100px 125px repeat(${events.length}, 175px) 175px`,
      }}
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
            <span
              className={sharedStyles.ellipsisOverflow}
              key={guest.id}
            >{`${guest.firstName} ${guest.lastName}`}</span>
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
          <div key={event.id} className='flex flex-col gap-3'>
            {household.guests.map((guest) => {
              const rsvp = guest.invitations?.find(
                (inv) => inv.eventId === event.id
              )?.rsvp;
              return (
                <InvitationDropdown
                  key={guest.id}
                  guest={guest}
                  event={event}
                  rsvp={rsvp ?? 'Not Invited'}
                />
              );
            })}
          </div>
        );
      })}
      {/* These are for single event view/tab */}
      {/* <p>Thank You Checkbox</p> */}
      {/* <p>{household.gift ?? '-'}</p> */}
      <p className={sharedStyles.ellipsisOverflow}>{household.notes ?? '-'}</p>
    </div>
  );
};

type InvitationDropdownProps = {
  guest: Guest;
  event: Event;
  rsvp: string;
};

const InvitationDropdown = ({
  guest,
  event,
  rsvp,
}: InvitationDropdownProps) => {
  const [rsvpValue, setRsvpValue] = useState(rsvp);

  const { mutate: updateInvitation, isLoading: isUpdatingInvitation } =
    api.invitation.update.useMutation({
      onSuccess: (updatedInvitation) => {
        setRsvpValue(updatedInvitation.rsvp ?? 'Not Invited');
      },
      onError: () => {
        window.alert('Failed to update invitation! Please try again later.');
      },
    });

  const getRSVPcolor = (rsvp: string | null | undefined) => {
    switch (rsvp) {
      case 'Not Invited':
        return 'bg-gray-500';
      case 'Invited':
        return 'bg-gray-300';
      case 'Attending':
        return 'bg-green-400';
      case 'Declined':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div key={guest.id} className='flex items-center'>
      <span
        className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${getRSVPcolor(
          rsvpValue
        )}`}
      ></span>
      {isUpdatingInvitation ? (
        <div className='m-auto w-[65%]'>
          <LoadingSpinner />
        </div>
      ) : (
        <select
          name='guestRSVP'
          value={rsvpValue}
          id={`guest-rsvp-${guest.id}`}
          className='pr-3 font-light tracking-tight'
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            updateInvitation({
              guestId: guest.id,
              eventId: event.id,
              rsvp: e.target.value,
            });
          }}
        >
          <option value='Not Invited'>Not Invited</option>
          <option value='Invited'>Invited</option>
          <option value='Attending'>Attending</option>
          <option value='Declined'>Declined</option>
        </select>
      )}
    </div>
  );
};
