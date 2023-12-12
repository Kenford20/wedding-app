import { useEffect, useMemo, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loader';
import { useEventForm } from '~/contexts/event-form-context';
import { useGuestForm } from '~/contexts/guest-form-context';
import { guestListData } from '~/components/db-mocks';

import Layout from '../layout';
import GuestForm from '~/components/forms/guest-form';
import EventForm from '~/components/forms/event-form';
import GuestHeader from '~/components/guest-list/header';
import EventsTabs from '~/components/guest-list/events-tabs';
import NoGuestsView from '~/components/guest-list/no-guests-view';
import GuestsView from '~/components/guest-list/guests-view';
import OopsPage from '~/components/oops';

import {
  type Household,
  type Event,
  type EventFormData,
  type HouseholdFormData,
} from '~/types/schema';

export default function Dashboard() {
  const isEventFormOpen = useEventForm();
  const isGuestFormOpen = useGuestForm();

  const [selectedEventTab, setSelectedEventTab] = useState('All Events'); // eventId - move state into query
  const [events, setEvents] = useState<Event[]>();
  const [households, setHouseholds] = useState<Household[]>();
  // TODO: setPrefillEvent passes into the selectedEventTab view thats currently active and will tie to the edit button
  const [prefillEvent, setPrefillEvent] = useState<EventFormData | undefined>();
  const [prefillHousehold, setPrefillHousehold] = useState<
    HouseholdFormData | undefined
  >();
  const totalGuests =
    useMemo(
      () =>
        households?.reduce(
          (acc, household) => acc + household.guests.length,
          0
        ),
      [households]
    ) ?? 0;

  const { data: guestListData, isLoading: isFetchingGuestListData } =
    api.guestList.getByUserId.useQuery();

  useEffect(() => {
    setEvents(guestListData?.events ?? []);
    setHouseholds(guestListData?.households ?? []);
  }, [guestListData]);

  if (isFetchingGuestListData) return <LoadingPage />;
  if (typeof window !== 'undefined' && guestListData === null) {
    window.location.href = '/';
  }
  if (!guestListData || !events || !households) return <OopsPage />;

  console.log('guestListIndex data', guestListData);
  return (
    <Layout>
      <main>
        {isGuestFormOpen && (
          <GuestForm
            events={events}
            setHouseholds={setHouseholds}
            prefillFormData={prefillHousehold}
          />
        )}
        {isEventFormOpen && (
          <EventForm setEvents={setEvents} prefillFormData={prefillEvent} />
        )}
        <GuestHeader />
        <EventsTabs events={events} />
        {households.length > 0 ? (
          <GuestsView
            events={events}
            households={households}
            totalGuests={totalGuests}
            setPrefillHousehold={setPrefillHousehold}
          />
        ) : (
          <NoGuestsView />
        )}
      </main>
    </Layout>
  );
}
