import { sharedStyles } from '../shared-styles';

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

type EventsTabsProps = {
  setShowEventForm: (x: boolean) => void;
  events: Event[];
};

export default function EventsTabs({
  events,
  setShowEventForm,
}: EventsTabsProps) {
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
          onClick={() => setShowEventForm(true)}
        >
          + New Event
        </button>
      </ul>
    </div>
  );
}
