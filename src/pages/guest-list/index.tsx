import { useEffect, useMemo, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loader';
import { useEventForm } from '~/contexts/event-form-context';
import { useGuestForm } from '~/contexts/guest-form-context';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const selectedEventId = searchParams.get('event') ?? 'all';

  const [events, setEvents] = useState<Event[]>();
  const [households, setHouseholds] = useState<Household[]>();
  // TODO: setPrefillEvent passes into the selectedEventId view thats currently active and will tie to the edit button
  const [prefillEvent, setPrefillEvent] = useState<EventFormData | undefined>();
  const [prefillHousehold, setPrefillHousehold] = useState<
    HouseholdFormData | undefined
  >();

  const { data: guestListData, isLoading: isFetchingGuestListData } =
    api.guestList.getByUserId.useQuery();

  useEffect(() => {
    setEvents(guestListData?.events ?? []);
    setHouseholds(guestListData?.households ?? []);
  }, [guestListData]);

  const filteredHouseholdsByEvent = useMemo(
    () =>
      selectedEventId === 'all'
        ? households ?? []
        : households?.map((household) => {
            return {
              ...household,
              guests: household.guests.filter((guest) => {
                if (!guest.invitations) return false;
                const matchingInvitation = guest.invitations.find(
                  (guest) => guest.eventId === selectedEventId
                );
                if (matchingInvitation === undefined) return false;
                return matchingInvitation?.rsvp !== 'Not Invited';
              }),
            };
          }) ?? [],
    [selectedEventId, households]
  );

  const totalGuests =
    useMemo(
      () =>
        filteredHouseholdsByEvent?.reduce(
          (acc, household) => acc + household.guests.length,
          0
        ),
      [filteredHouseholdsByEvent]
    ) ?? 0;

  if (isFetchingGuestListData) return <LoadingPage />;
  if (typeof window !== 'undefined' && guestListData === null) {
    window.location.href = '/';
  }
  if (!guestListData || !events || !households) return <OopsPage />;

  console.log('guestListIndex data', guestListData);
  // console.log('filtered householdz', filteredHouseholdsByEvent);
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
        <EventsTabs events={events} selectedEventId={selectedEventId} />
        {totalGuests > 0 ? (
          <GuestsView
            events={events}
            households={filteredHouseholdsByEvent}
            selectedEventId={selectedEventId}
            setPrefillHousehold={setPrefillHousehold}
            setPrefillEvent={setPrefillEvent}
            setHouseholds={setHouseholds}
          />
        ) : (
          <NoGuestsView setPrefillHousehold={setPrefillHousehold} />
        )}
      </main>
    </Layout>
  );
}
