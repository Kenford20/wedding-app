import { sharedStyles } from '../shared-styles';
import GuestSearchFilter from './guest-search-filter';
import GuestTable from './guest-table';

type Event = {
  id: string;
  name: string;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  venue: string | null;
  attire: string | null;
  description: string | null;
  userId: string;
};

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  userId: string;
  rsvps: Rsvp[];
};

type Rsvp = {
  eventId: string;
  rsvp: string | null;
};

type GuestsViewProps = {
  events: Event[];
  guests: Guest[];
  setShowGuestForm: (x: boolean) => void;
};

export function GuestsView({
  events,
  guests,
  setShowGuestForm,
}: GuestsViewProps) {
  const numGuests = 5;
  const numEvents = 3;
  return (
    <section>
      <div>
        <div className={`py-8 ${sharedStyles.desktopPaddingSides}`}>
          <span className='text-sm'>
            TOTAL HOUSEHOLDS: <span className='font-bold'>{numGuests}</span>
          </span>
          <span className={sharedStyles.verticalDivider}>|</span>
          <span className='text-sm'>
            TOTAL GUESTS: <span className='font-bold'>{numGuests}</span>
          </span>
          <span className={sharedStyles.verticalDivider}>|</span>
          <span className='text-sm'>
            TOTAL EVENTS: <span className='font-bold'>{numEvents}</span>
          </span>
        </div>
      </div>
      <div
        className={`mb-8 flex justify-between ${sharedStyles.desktopPaddingSides}`}
      >
        <GuestSearchFilter />
        <div>
          <button className={sharedStyles.secondaryButton()}>
            Download List
          </button>
          <button
            className={`ml-5 ${sharedStyles.primaryButton()}`}
            onClick={() => setShowGuestForm(true)}
          >
            Add Guest
          </button>
        </div>
      </div>
      <GuestTable events={events} guests={guests} />
    </section>
  );
}
