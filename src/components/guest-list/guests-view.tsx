import { type Guest, type Event } from '~/types/schema';
import { sharedStyles } from '../shared-styles';
import GuestSearchFilter from './guest-search-filter';
import GuestTable from './guest-table';

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
