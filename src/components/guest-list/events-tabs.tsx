import Link from 'next/link';
import { sharedStyles } from '../shared-styles';
import { useToggleEventForm } from '~/contexts/event-form-context';

import { type Event } from '../../types/schema';

type EventsTabsProps = {
  events: Event[];
  selectedEventTab: string;
};

export default function EventsTabs({
  events,
  selectedEventTab,
}: EventsTabsProps) {
  const toggleEventForm = useToggleEventForm();

  return (
    <div className='border-b'>
      <ul className={`flex gap-5 ${sharedStyles.desktopPaddingSidesGuestList}`}>
        <li
          className={`cursor-pointer border-b-4 py-3 text-sm hover:border-gray-600 ${
            selectedEventTab === 'all'
              ? 'border-gray-600'
              : 'border-transparent'
          }`}
        >
          <Link href='/guest-list?event=all' scroll={false}>
            All Events
          </Link>
        </li>
        {events?.map((event) => {
          return (
            <li
              className={`cursor-pointer border-b-4 py-3 text-sm hover:border-gray-600 ${
                selectedEventTab === event.id
                  ? 'border-gray-600'
                  : 'border-transparent'
              }`}
              key={event.id}
            >
              <Link href={`/guest-list?event=${event.id}`} scroll={false}>
                {event.name}
              </Link>
            </li>
          );
        })}
        <button
          className={`pb-1 text-sm font-semibold text-${sharedStyles.primaryColor}`}
          onClick={() => toggleEventForm()}
        >
          + New Event
        </button>
      </ul>
    </div>
  );
}
