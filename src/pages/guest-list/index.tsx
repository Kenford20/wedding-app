import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loader';
import { useEventForm } from '~/contexts/event-form-context';
import { useGuestForm } from '~/contexts/guest-form-context';
import { guestListData } from '~/components/db-mocks';

import Layout from '../layout';
import AddGuestForm from '~/components/forms/add-guest-form';
import EventForm from '~/components/forms/event-form';
import GuestHeader from '~/components/guest-list/header';
import EventsTabs from '~/components/guest-list/events-tabs';
import NoGuestsView from '~/components/guest-list/no-guests-view';
import GuestsView from '~/components/guest-list/guests-view';
import OopsPage from '~/components/oops';

import { type Guest, type Event, type EventFormData } from '~/types/schema';

export default function Dashboard() {
  const isEventFormOpen = useEventForm();
  const isGuestFormOpen = useGuestForm();
  const [selectedEventTab, setSelectedEventTab] = useState('All Events'); // eventId
  const [events, setEvents] = useState<Event[]>();
  const [guests, setGuests] = useState<Guest[]>();
  // TODO: setPrefillEvent passes into the selectedEventTab view thats currently active and will tie to the edit button
  const [prefillEvent, setPrefillEvent] = useState<EventFormData | undefined>();

  const { data: guestListData, isLoading: isFetchingGuestListData } =
    api.guestList.getByUserId.useQuery();

  useEffect(() => {
    setEvents(guestListData?.events ?? []);
    setGuests(guestListData?.guests ?? []);
  }, [guestListData]);

  if (isFetchingGuestListData) return <LoadingPage />;
  if (!guestListData || !events || !guests) return <OopsPage />;

  console.log('guestListIndex data', guestListData);

  return (
    <Layout>
      <main>
        {isGuestFormOpen && (
          <AddGuestForm events={events} setGuests={setGuests} />
        )}
        {isEventFormOpen && (
          <EventForm setEvents={setEvents} prefillFormData={prefillEvent} />
        )}
        <GuestHeader />
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
