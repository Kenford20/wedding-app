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
import { type Guest, type Event } from '~/types/schema';

export default function Dashboard() {
  const { user } = useUser();
  const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [selectedEventTab, setSelectedEventTab] = useState('All Events'); // eventId
  // const [events, setEvents] = useState<Event[]>(guestListData.events);
  const [events, setEvents] = useState<Event[]>();
  const [guests, setGuests] = useState<Guest[]>();
  console.log('events', events);

  const { data: guestListData, isLoading: isFetchingGuestListData } =
    api.guestList.getAllByUserId.useQuery();

  useEffect(() => {
    setEvents(guestListData?.events ?? []);
    setGuests(guestListData?.guests ?? []);
  }, [guestListData]);

  useEffect(() => {
    if (showGuestForm || showEventForm) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showGuestForm, showEventForm]);

  if (isFetchingGuestListData) return <LoadingPage />;
  if (!guestListData || !events || !guests) return <div>404</div>;

  console.log(guestListData);

  return (
    <Layout>
      <main className=''>
        {showGuestForm && (
          <AddGuestForm
            setShowGuestForm={setShowGuestForm}
            events={events}
            setGuests={setGuests}
          />
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
            guests={guests}
            setShowGuestForm={setShowGuestForm}
          />
        ) : (
          <NoGuestsView setShowGuestForm={setShowGuestForm} />
        )}
      </main>
    </Layout>
  );
}
