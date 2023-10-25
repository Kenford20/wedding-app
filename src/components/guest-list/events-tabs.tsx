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
    <div className='border-b-2'>
      <ul className='flex gap-5 px-16'>
        <li className='cursor-pointer border-b-4 border-transparent py-3 text-sm hover:border-gray-600'>
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
          className='text-sm text-pink-400'
          onClick={() => setShowEventForm(true)}
        >
          + New Event
        </button>
      </ul>
    </div>
  );
}