import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loader';
import { guestListData } from '~/components/db-mocks';

import AddGuestForm from '~/components/guest-list/add-guest-form';
import Layout from '../layout';
import AddEventForm from '~/components/guest-list/add-event-form';
import GuestHeader from '~/components/guest-list/header';
import EventsTabs from '~/components/guest-list/events-tabs';
import { NoGuestsView } from '~/components/guest-list/no-guests-view';
import { GuestsView } from '~/components/guest-list/guests-view';

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
        {guestListData?.guests.length > 0 ? (
          <GuestsView
            events={events}
            guests={guestListData.guests}
            setShowGuestForm={setShowGuestForm}
          />
        ) : (
          <NoGuestsView setShowGuestForm={setShowGuestForm} />
        )}
      </main>
    </Layout>
  );
}
