'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import AddGuestForm from '~/components/guest-list/add-guest-form';
import Layout from '../layout';

export default function Dashboard() {
  const { user } = useUser();
  const [showGuestForm, setShowGuestForm] = useState<boolean>();

  return (
    <Layout>
      <main>
        {showGuestForm && <AddGuestForm setShowGuestForm={setShowGuestForm} />}
        <section>
          <div>
            <h1>Your Guest List</h1>
          </div>
        </section>
        <section>
          <ul>
            <li>All Events</li>
            <li>Rehearsal Dinner</li>
            <li>Wedding Day</li>
            <button>+ New Event</button>
          </ul>
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