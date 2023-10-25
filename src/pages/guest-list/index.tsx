import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import AddGuestForm from '~/components/guest-list/add-guest-form';
import Layout from '../layout';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loader';
import AddEventForm from '~/components/guest-list/add-event-form';
import GuestHeader from '~/components/guest-list/header';
import EventsTabs from '~/components/guest-list/events-tabs';
import GuestTable from '~/components/guest-list/guest-table';
import GuestSearchFilter from '~/components/guest-list/guest-search-filter';

export default function Dashboard() {
  const { user } = useUser();
  const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [selectedEventTab, setSelectedEventTab] = useState('All Events'); // eventId

  // const events = [
  //   {
  //     name: 'Wedding Day',
  //     id: '123',
  //   },
  //   {
  //     name: 'Dinner Rehearsal',
  //     id: '321',
  //   },
  //   {
  //     name: 'test event',
  //     id: '13',
  //   },
  // ];

  const { data: events, isLoading: isFetchingEvents } =
    api.event.getAllByUserId.useQuery();

  // const { data: invitations, isLoading: isFetchingInvitations } =
  //   api.invitation.getAllByUserId.useQuery();

  const { data: guests, isLoading: isFetchingGuests } =
    api.guest.getAllByUserId.useQuery();

  console.log('g', guests);

  if (isFetchingEvents || isFetchingGuests) return <LoadingPage />;
  if (!events || !guests) return <div>404</div>;
  // console.log('inv', invitations);
  // console.log('ev', events);

  const numGuests = 5;
  const numEvents = 3;
  return (
    <Layout>
      <main className=''>
        {showGuestForm && (
          <AddGuestForm setShowGuestForm={setShowGuestForm} events={events} />
        )}
        {showEventForm && <AddEventForm setShowEventForm={setShowEventForm} />}
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
            <div className='px-16 py-8'>
              <span className='text-sm'>
                TOTAL HOUSEHOLDS: <span className='font-bold'>{numGuests}</span>
              </span>
              <span className='px-3 text-neutral-400'>|</span>
              <span className='text-sm'>
                TOTAL GUESTS: <span className='font-bold'>{numGuests}</span>
              </span>
              <span className='px-3 text-neutral-400'>|</span>
              <span className='text-sm'>
                TOTAL EVENTS: <span className='font-bold'>{numEvents}</span>
              </span>
            </div>
          </div>
          <div className='mb-8 flex justify-between px-16'>
            <GuestSearchFilter />
            <div>
              <button className='rounded-full border border-pink-500 px-12 py-3 font-semibold text-pink-500'>
                Download List
              </button>
              <button
                className='ml-5 rounded-full bg-pink-500 px-12 py-3 font-semibold text-white'
                onClick={() => setShowGuestForm(true)}
              >
                Add Guest
              </button>
            </div>
          </div>
          <GuestTable events={events} guests={guests} />
        </section>
      </main>
    </Layout>
  );
}
