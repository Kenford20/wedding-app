import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loader';
import { guestListData } from '~/components/db-mocks';
import { sharedStyles } from '~/components/shared-styles';

import AddGuestForm from '~/components/guest-list/add-guest-form';
import Layout from '../layout';
import AddEventForm from '~/components/guest-list/add-event-form';
import GuestHeader from '~/components/guest-list/header';
import EventsTabs from '~/components/guest-list/events-tabs';
import GuestTable from '~/components/guest-list/guest-table';
import GuestSearchFilter from '~/components/guest-list/guest-search-filter';

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

export default function Dashboard() {
  const { user } = useUser();
  const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [selectedEventTab, setSelectedEventTab] = useState('All Events'); // eventId
  // const [events, setEvents] = useState<Event[]>(guestListData.events);
  const [events, setEvents] = useState<Event[]>();
  console.log('events', events);

  const { data: guestListData, isLoading: isFetchingGuestListData } =
    api.guestList.getAllByUserId.useQuery();

  useEffect(() => {
    setEvents(guestListData?.events);
  }, [guestListData?.events]);

  if (isFetchingGuestListData) return <LoadingPage />;
  if (!guestListData || !events) return <div>404</div>;

  console.log(guestListData);

  const numGuests = 5;
  const numEvents = 3;
  return (
    <Layout>
      <main className=''>
        {showGuestForm && (
          <AddGuestForm setShowGuestForm={setShowGuestForm} events={events} />
        )}
        {showEventForm && (
          <AddEventForm
            setShowEventForm={setShowEventForm}
            setEvents={setEvents}
          />
        )}
        <section>
          <GuestHeader />
        </section>
        <EventsTabs events={events} setShowEventForm={setShowEventForm} />
        <section>
          {/* <div>
        <h1>currentEventName</h1>
        <i>Icon</i>
        <span>editEvent</span>
        <div>
          <span>numGuestsInvited Guests Invited:</span>
          <span>numGuestsAccepted Accepted</span>
          <span>numGuestsDeclined Declined</span>
          <span>numGuestsNoResponse No Response</span>
        </div>
      </div> */}
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
          <GuestTable events={events} guests={guestListData.guests} />
        </section>
      </main>
    </Layout>
  );
}
