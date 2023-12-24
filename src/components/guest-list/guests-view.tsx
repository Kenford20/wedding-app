import { BiPencil } from 'react-icons/bi';
import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { sharedStyles } from '../shared-styles';
import { useToggleEventForm } from '~/contexts/event-form-context';
import GuestSearchFilter from './guest-search-filter';
import GuestTable from './guest-table';

import { useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  type Household,
  type Event,
  type HouseholdFormData,
  type EventFormData,
} from '~/types/schema';

type GuestsViewProps = {
  events: Event[];
  households: Household[];
  totalGuests: number;
  selectedEventId: string;
  setPrefillHousehold: Dispatch<SetStateAction<HouseholdFormData | undefined>>;
  setPrefillEvent: Dispatch<SetStateAction<EventFormData | undefined>>;
};

export default function GuestsView({
  events,
  households,
  totalGuests,
  selectedEventId,
  setPrefillHousehold,
  setPrefillEvent,
}: GuestsViewProps) {
  const toggleGuestForm = useToggleGuestForm();
  return (
    <section>
      {selectedEventId === 'all' ? (
        <DefaultTableHeader
          households={households}
          totalGuests={totalGuests}
          numEvents={events.length}
        />
      ) : (
        <SelectedEventTableHeader
          totalGuests={totalGuests}
          households={households}
          selectedEvent={events.find((event) => event.id === selectedEventId)}
          setPrefillEvent={setPrefillEvent}
        />
      )}
      <div
        className={`mb-8 flex justify-between ${sharedStyles.desktopPaddingSidesGuestList}`}
      >
        <GuestSearchFilter />
        <div>
          <button className={sharedStyles.secondaryButton()}>
            Download List
          </button>
          <button
            className={`ml-5 ${sharedStyles.primaryButton()}`}
            onClick={() => {
              setPrefillHousehold(undefined);
              toggleGuestForm();
            }}
          >
            Add Guest
          </button>
        </div>
      </div>
      <GuestTable
        events={events}
        households={households}
        selectedEventId={selectedEventId}
        setPrefillHousehold={setPrefillHousehold}
      />
    </section>
  );
}

type DefaultTableHeaderProps = {
  households: Household[];
  numEvents: number;
  totalGuests: number;
};

const DefaultTableHeader = ({
  households,
  numEvents,
  totalGuests,
}: DefaultTableHeaderProps) => {
  return (
    <div>
      <div className={`py-8 ${sharedStyles.desktopPaddingSidesGuestList}`}>
        <span className='text-sm'>
          TOTAL HOUSEHOLDS:{' '}
          <span className='font-bold'>{households.length}</span>
        </span>
        <span className={sharedStyles.verticalDivider}>|</span>
        <span className='text-sm'>
          TOTAL GUESTS: <span className='font-bold'>{totalGuests}</span>
        </span>
        <span className={sharedStyles.verticalDivider}>|</span>
        <span className='text-sm'>
          TOTAL EVENTS: <span className='font-bold'>{numEvents}</span>
        </span>
      </div>
    </div>
  );
};

type SelectedEventTableHeaderProps = {
  totalGuests: number;
  households: Household[];
  selectedEvent: Event | undefined;
  setPrefillEvent: Dispatch<SetStateAction<EventFormData | undefined>>;
};

const SelectedEventTableHeader = ({
  totalGuests,
  households,
  selectedEvent,
  setPrefillEvent,
}: SelectedEventTableHeaderProps) => {
  const toggleEventForm = useToggleEventForm();
  const guestResponses = useMemo(() => {
    const guestResponses = {
      attending: 0,
      declined: 0,
      noResponse: 0,
    };

    households.forEach((household) => {
      household.guests.forEach((guest) => {
        if (!guest.invitations) return;
        const matchingInvitation = guest.invitations.find(
          (inv) => inv.eventId === selectedEvent?.id
        );
        if (!matchingInvitation) return;
        switch (matchingInvitation.rsvp) {
          case 'Attending':
            guestResponses.attending += 1;
            break;
          case 'Declined':
            guestResponses.declined += 1;
            break;
          default:
            guestResponses.noResponse += 1;
            break;
        }
      });
    });

    return guestResponses;
  }, [households, selectedEvent]);

  if (selectedEvent === undefined) return null;

  const handleEditEvent = (event: Event) => {
    const standardDate = event?.date?.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    setPrefillEvent({
      eventName: event.name,
      date: standardDate ?? undefined,
      startTime: event.startTime ?? undefined,
      endTime: event.endTime ?? undefined,
      venue: event.venue ?? undefined,
      attire: event.attire ?? undefined,
      description: event.description ?? undefined,
      eventId: event.id,
    });
    toggleEventForm();
  };

  return (
    <div className='py-8'>
      <div
        className={`${sharedStyles.desktopPaddingSidesGuestList} mb-3 flex items-center gap-2`}
      >
        <h2 className='text-xl font-bold'>{selectedEvent.name}</h2>
        <BiPencil
          size={22}
          color={sharedStyles.primaryColorHex}
          className='cursor-pointer'
          onClick={() => handleEditEvent(selectedEvent)}
        />
      </div>
      <div
        className={`${sharedStyles.desktopPaddingSidesGuestList} flex gap-4`}
      >
        <span className='text-md font-semibold'>
          {totalGuests} Guests Invited:
        </span>
        <div className='text-md flex items-center gap-1.5'>
          <span className={`h-1.5 w-1.5 rounded-full bg-green-400`} />
          <div className='font-medium'>{guestResponses.attending}</div>
          Attending
        </div>
        <div className='text-md flex items-center gap-1.5'>
          <span className={`h-1.5 w-1.5 rounded-full bg-red-400`} />
          <span className='font-medium'>{guestResponses.declined}</span>
          Declined
        </div>
        <div className='text-md flex items-center gap-1.5'>
          <span className={`h-1.5 w-1.5 rounded-full bg-gray-200`} />
          <span className=''>{guestResponses.noResponse}</span>No Response
        </div>
      </div>
    </div>
  );
};
