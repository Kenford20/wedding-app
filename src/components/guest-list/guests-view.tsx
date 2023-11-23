import { BiPencil } from 'react-icons/bi';
import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { sharedStyles } from '../shared-styles';
import GuestSearchFilter from './guest-search-filter';
import GuestTable from './guest-table';

import { type Household, type Event } from '~/types/schema';

const foo = (households: Household[], events: Event[], totalGuests: number) => {
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
          TOTAL EVENTS: <span className='font-bold'>{events.length}</span>
        </span>
      </div>
    </div>
  );
};

const bar = () => {
  const selectedEvent = 'Selected Event';
  const numAcceptedGuests = 1;
  const numDeclinedGuests = 2;
  const numNoResponseGuests = 3;
  return (
    <div className='py-8'>
      <div
        className={`${sharedStyles.desktopPaddingSidesGuestList} mb-3 flex items-center gap-2`}
      >
        <h2 className='text-xl font-bold'>{selectedEvent}</h2>
        <BiPencil size={22} color={sharedStyles.primaryColorHex} />
      </div>
      <div
        className={`${sharedStyles.desktopPaddingSidesGuestList} flex gap-4`}
      >
        <span className='text-sm font-semibold'>
          {numAcceptedGuests + numDeclinedGuests + numNoResponseGuests} Guests
          Invited:
        </span>
        <span className='text-sm'>
          <span className='font-medium'>{numAcceptedGuests}</span> Accepted
        </span>
        <span className='text-sm'>
          <span className='font-medium'>{numDeclinedGuests}</span> Declined
        </span>
        <span className='text-sm'>
          <span className='font-medium'>{numNoResponseGuests}</span> No Response
        </span>
      </div>
    </div>
  );
};

type GuestsViewProps = {
  events: Event[];
  households: Household[];
  totalGuests: number;
};

export default function GuestsView({
  events,
  households,
  totalGuests,
}: GuestsViewProps) {
  const toggleGuestForm = useToggleGuestForm();
  return (
    <section>
      {true ? foo(households, events, totalGuests) : bar()}
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
            onClick={() => toggleGuestForm()}
          >
            Add Guest
          </button>
        </div>
      </div>
      <GuestTable events={events} households={households} />
    </section>
  );
}
