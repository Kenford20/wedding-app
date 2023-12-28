import { AiOutlineHome } from 'react-icons/ai';
import { CiMail } from 'react-icons/ci';
import { FaSort } from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi2';
import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { sharedStyles } from '../shared-styles';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../loader';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
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
  selectedEventId: string;
  setPrefillHousehold: Dispatch<SetStateAction<HouseholdFormData | undefined>>;
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
};

export default function GuestTable({
  events,
  households,
  selectedEventId,
  setPrefillHousehold,
  setHouseholds,
}: GuestTableProps) {
  const [nameSort, setNameSort] = useState('none');
  const [partySort, setPartySort] = useState('none');
  const [sortedHouseholds, setSortedHouseholds] = useState(households);
  const selectedEvent = events.find((event) => event.id === selectedEventId);
  const gridColumns =
    selectedEventId === 'all'
      ? `40px 240px 100px 125px repeat(${events.length}, 175px) 175px`
      : '40px 240px 100px 125px 175px 175px 150px 100px';

  useEffect(() => {
    setSortedHouseholds(households);
  }, [households]);

  const sortByName = () => {
    setSortedHouseholds(() => {
      if (nameSort === 'none') {
        setNameSort('ascending');
        return [...households].sort((a, b) =>
          a.guests[0]!.firstName.localeCompare(b.guests[0]!.firstName)
        );
      } else if (nameSort === 'ascending') {
        setNameSort('descending');
        return [...households].sort((a, b) =>
          b.guests[0]!.firstName.localeCompare(a.guests[0]!.firstName)
        );
      } else {
        setNameSort('none');
        return households;
      }
    });
  };

  const sortByParty = () => {
    setSortedHouseholds(() => {
      if (partySort === 'none') {
        setPartySort('ascending');
        return [...households].sort(
          (a, b) => a.guests.length - b.guests.length
        );
      } else if (partySort === 'ascending') {
        setPartySort('descending');
        return [...households].sort(
          (a, b) => b.guests.length - a.guests.length
        );
      } else {
        setPartySort('none');
        return households;
      }
    });
  };

  return (
    <div className={sharedStyles.desktopPaddingSidesGuestList}>
      <div className='box-border max-h-[80vh] overflow-auto'>
        <div
          className='guest-table grid min-w-fit items-center gap-12 border-b px-8 py-6 font-light italic text-gray-600'
          style={{
            gridTemplateColumns: gridColumns,
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
          <div
            className='flex cursor-pointer items-center gap-2'
            onClick={() => sortByName()}
          >
            <h5>Name</h5>
            <FaSort size={14} />
          </div>
          <div
            className='flex cursor-pointer items-center gap-2'
            onClick={() => sortByParty()}
          >
            <h5>Party Of</h5>
            <FaSort size={14} />
          </div>
          <h5>Contact</h5>
          {selectedEventId === 'all' ? (
            events?.map((event) => {
              return <h5 key={event.id}>{event.name} RSVP</h5>;
            })
          ) : (
            <h5>{selectedEvent?.name} RSVP</h5>
          )}

          <h5>My Notes</h5>

          {selectedEventId !== 'all' && <h5>Gift</h5>}

          {selectedEventId !== 'all' && <h5>Thank You</h5>}
        </div>

        <div className='text-md min-w-fit border-l border-r'>
          {sortedHouseholds?.map((household) =>
            selectedEventId === 'all' ? (
              <DefaultTableRow
                key={household.id}
                household={household}
                events={events}
                setPrefillHousehold={setPrefillHousehold}
                setHouseholds={setHouseholds}
              />
            ) : (
              <SingleEventTableRow
                key={household.id}
                household={household}
                selectedEvent={selectedEvent}
                setPrefillHousehold={setPrefillHousehold}
                setHouseholds={setHouseholds}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

type DefaultTableRowProps = {
  household: Household;
  events: Event[];
  setPrefillHousehold: Dispatch<SetStateAction<HouseholdFormData | undefined>>;
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
};

const DefaultTableRow = ({
  household,
  events,
  setPrefillHousehold,
  setHouseholds,
}: DefaultTableRowProps) => {
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
      gifts: household.gifts,
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
                  householdId={household.id}
                  setHouseholds={setHouseholds}
                />
              );
            })}
          </div>
        );
      })}
      <p className={sharedStyles.ellipsisOverflow}>{household.notes ?? '-'}</p>
    </div>
  );
};

type SingleEventTableRowProps = {
  household: Household;
  selectedEvent: Event | undefined;
  setPrefillHousehold: Dispatch<SetStateAction<HouseholdFormData | undefined>>;
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
};

const SingleEventTableRow = ({
  household,
  selectedEvent,
  setPrefillHousehold,
  setHouseholds,
}: SingleEventTableRowProps) => {
  const toggleGuestForm = useToggleGuestForm();
  const { mutate: updateGift, isLoading: isUpdatingGift } =
    api.gift.update.useMutation({
      onSuccess: (updatedGift) => {
        setHouseholds((prevHouseholds) =>
          prevHouseholds?.map((prevHousehold) => {
            return prevHousehold.id === household.id
              ? {
                  ...prevHousehold,
                  gifts: prevHousehold.gifts.map((gift) =>
                    gift.eventId === updatedGift.eventId ? updatedGift : gift
                  ),
                }
              : prevHousehold;
          })
        );
      },
      onError: () => {
        window.alert('Failed to update gift! Please try again later.');
      },
    });

  if (selectedEvent === undefined || household.guests.length < 1) return null;
  const selectedEventGift = household.gifts.find(
    (gift) => gift.eventId === selectedEvent.id
  );

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
      gifts: household.gifts.filter(
        (gift) => gift.eventId === selectedEvent.id
      ),
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
        gridTemplateColumns: '40px 240px 100px 125px 175px 175px 150px 100px',
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

      <div key={selectedEvent.id} className='flex flex-col gap-3'>
        {household.guests.map((guest) => {
          const rsvp = guest.invitations?.find(
            (inv) => inv.eventId === selectedEvent.id
          )?.rsvp;
          return (
            <InvitationDropdown
              key={guest.id}
              guest={guest}
              event={selectedEvent}
              rsvp={rsvp ?? 'Not Invited'}
              householdId={household.id}
              setHouseholds={setHouseholds}
            />
          );
        })}
      </div>

      <p className={sharedStyles.ellipsisOverflow}>{household.notes ?? '-'}</p>

      <p>{selectedEventGift?.description ?? '-'}</p>

      {isUpdatingGift ? (
        <LoadingSpinner />
      ) : (
        <div>
          <input
            className='h-6 w-6 cursor-pointer'
            style={{
              accentColor: sharedStyles.primaryColorHex,
            }}
            type='checkbox'
            id={`thank-you-${selectedEvent.id}`}
            onClick={(e) => e.stopPropagation()}
            checked={selectedEventGift?.thankyou}
            onChange={(e) =>
              updateGift({
                householdId: household.id,
                eventId: selectedEvent.id,
                thankyou: e.target.checked,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

type InvitationDropdownProps = {
  guest: Guest;
  event: Event;
  rsvp: string;
  householdId: string;
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
};

const InvitationDropdown = ({
  guest,
  event,
  rsvp,
  householdId,
  setHouseholds,
}: InvitationDropdownProps) => {
  const [rsvpValue, setRsvpValue] = useState(rsvp);

  const { mutate: updateInvitation, isLoading: isUpdatingInvitation } =
    api.invitation.update.useMutation({
      onSuccess: (updatedInvitation) => {
        setRsvpValue(updatedInvitation.rsvp ?? 'Not Invited');
        // TODO: need to modify this to handle batch updates to multiple guests when that feature is implemented
        setHouseholds((prevHouseholds) =>
          prevHouseholds?.map((prevHousehold) => {
            return prevHousehold.id === householdId
              ? {
                  ...prevHousehold,
                  guests: prevHousehold.guests.map((guest) => {
                    return guest.id === updatedInvitation.guestId
                      ? {
                          ...guest,
                          invitations: guest.invitations?.map((inv) =>
                            inv.eventId === updatedInvitation.eventId
                              ? updatedInvitation
                              : inv
                          ),
                        }
                      : guest;
                  }),
                }
              : prevHousehold;
          })
        );
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
