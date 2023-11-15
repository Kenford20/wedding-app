import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { type Guest, type Event } from '~/types/schema';
import { sharedStyles } from '../shared-styles';
import GuestSearchFilter from './guest-search-filter';
import GuestTable from './guest-table';

type GuestsViewProps = {
  events: Event[];
  guests: Guest[];
};

export default function GuestsView({ events, guests }: GuestsViewProps) {
  const numGuests = 5;
  const numEvents = 3;
  const toggleGuestForm = useToggleGuestForm();
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
            onClick={() => toggleGuestForm()}
          >
            Add Guest
          </button>
        </div>
      </div>
      <GuestTable events={events} guests={guests} />
    </section>
  );
}
