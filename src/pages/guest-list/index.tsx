import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import AddGuestForm from '~/components/guest-list/add-guest-form';
import Layout from '../layout';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loader';
import AddEventForm from '~/components/guest-list/add-event-form';
import GuestHeader from '~/components/guest-list/header';
import EventsTabs from '~/components/guest-list/events-tabs';

export default function Dashboard() {
  const { user } = useUser();
  const [showGuestForm, setShowGuestForm] = useState<boolean>(false);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);

  const events = [
    {
      name: 'Wedding Day',
      id: '123',
    },
    {
      name: 'Dinner Rehearsal',
      id: '321',
    },
    {
      name: 'test event',
      id: '13',
    },
  ];

  // const { data: events, isLoading: isFetchingEvents } =
  //   api.event.getAllByUserId.useQuery();

  // const { data: invitations, isLoading: isFetchingInvitations } =
  //   api.invitation.getAllByUserId.useQuery();

  // if (isFetchingEvents || isFetchingInvitations) return <LoadingPage />;
  // if (!events || !invitations) return <div>404</div>;
  // console.log('inv', invitations);
  // console.log('ev', events);

  return (
    <Layout>
      <main className=''>
        {showGuestForm && (
          <AddGuestForm setShowGuestForm={setShowGuestForm} events={events} />
        )}
        {showEventForm && <AddEventForm setShowEventForm={setShowEventForm} />}
        <GuestHeader />
        <section>
          <EventsTabs events={events} setShowEventForm={setShowEventForm} />
          <div>
            <h1>currentEventName</h1>
            <i>Icon</i>
            <span>editEvent</span>
            <div>
              <span>numGuestsInvited Guests Invited:</span>
              <span>numGuestsAccepted Accepted</span>
              <span>numGuestsDeclined Declined</span>
              <span>numGuestsNoResponse No Response</span>
            </div>
          </div>
          <div>
            <div>
              <input placeholder='Find Guests'></input>
              <button>
                <i>Icon</i>
              </button>
            </div>
            <div>
              <select name='guestsFilter' id='guestsFilter'>
                <option defaultValue='Filter By'>Filter By</option>
                <option value='invited'>Invited</option>
                <option value='attending'>Attending</option>
                <option value='Declined'>Declined</option>
              </select>
            </div>
            <div>
              <button>Download List</button>
              <button onClick={() => setShowGuestForm(true)}>Add Guest</button>
            </div>
          </div>
          <div>
            <div>
              <div>
                <input type='checkbox' id='check-all'></input>
                <h3>Name</h3>
                <button>nameSort</button>
              </div>
              <div>
                <h3>Party Of</h3>
                <button>partySort</button>
              </div>
              <div>
                <h3>Contact</h3>
              </div>
              <div>
                <h3>RSVP Status</h3>
              </div>
              <div>
                <h3>My Notes</h3>
              </div>
            </div>
            <div>
              {/* guests.map(guest => { */}
              <input type='checkbox' id='check-all'></input>
              <h3>guest.firstName guest.lastName</h3>
              <div>guest.partyNumber</div>
              <div>
                <i>homeIcon</i>
                <i>phoneIcon</i>
                <i>mailIcon</i>
              </div>
              <div>
                <select name='guestRSVP' id='guestRSVP'>
                  <option value='invited'>Not Invited</option>
                  <option value='invited'>Invited</option>
                  <option value='attending'>Attending</option>
                  <option value='Declined'>Declined</option>
                </select>
              </div>
              <div>guest.userNotes</div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
