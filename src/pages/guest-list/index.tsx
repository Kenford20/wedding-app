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
import { useEventForm } from '~/contexts/event-form-context';
import { useGuestForm } from '~/contexts/guest-form-context';

export default function Dashboard() {
  const isEventFormOpen = useEventForm();
  const isGuestFormOpen = useGuestForm();
  const [selectedEventTab, setSelectedEventTab] = useState('All Events'); // eventId
  const [events, setEvents] = useState<Event[]>();
  const [guests, setGuests] = useState<Guest[]>();

  const { data: guestListData, isLoading: isFetchingGuestListData } =
    api.guestList.getByUserId.useQuery();

  useEffect(() => {
    setEvents(guestListData?.events ?? []);
    setGuests(guestListData?.guests ?? []);
  }, [guestListData]);

  useEffect(() => {
    if (isGuestFormOpen || isEventFormOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isGuestFormOpen, isEventFormOpen]);

  if (isFetchingGuestListData) return <LoadingPage />;
  if (!guestListData || !events || !guests) return <div>404</div>;

  console.log('guestListIndex');

  return (
    <Layout>
      <main className=''>
        {isGuestFormOpen && (
          <AddGuestForm events={events} setGuests={setGuests} />
        )}
        {isEventFormOpen && <AddEventForm setEvents={setEvents} />}
        <section>
          <GuestHeader />
        </section>
        <EventsTabs events={events} />
        {guests.length > 0 ? (
          <GuestsView events={events} guests={guests} />
        ) : (
          <NoGuestsView />
        )}
      </main>
    </Layout>
  );
}
