import { sharedStyles } from '../shared-styles';
import { type Event } from '../../types/schema';
import { useToggleEventForm } from '~/contexts/event-form-context';

type EventsTabsProps = {
  events: Event[];
};

export default function EventsTabs({ events }: EventsTabsProps) {
  const toggleEventForm = useToggleEventForm();
  return (
    <div className='border-b'>
      <ul className={`flex gap-5 ${sharedStyles.desktopPaddingSides}`}>
        <li className='cursor-pointer border-b-4 border-gray-600 border-transparent py-3 text-sm hover:border-gray-600'>
          All Events
        </li>
        {events?.map((event) => {
          return (
            <li
              className='cursor-pointer border-b-4 border-transparent py-3 text-sm hover:border-gray-600'
              key={event.id}
            >
              {event.name}
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
