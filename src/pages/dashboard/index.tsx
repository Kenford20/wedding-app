import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Layout from '../layout';
import { api } from '~/utils/api';
import { LoadingPage } from '~/components/loader';
import DashboardHeader from '~/components/dashboard/website-header';

export default function Dashboard() {
  const { data: currentUsersWebsite, isLoading } =
    api.website.getByUserId.useQuery();
  console.log('user website ', currentUsersWebsite);

  if (isLoading) return <LoadingPage />;
  if (typeof window !== 'undefined' && currentUsersWebsite === null) {
    window.location.href = '/';
  }

  return (
    <Layout>
      <main>
        <section>
          <DashboardHeader websiteUrl={currentUsersWebsite?.url} />
        </section>
        <section>
          <h2>Let&apos;s set up your registry</h2>
          <p>
            Share your wish list with guests by linking an existing registry or
            starting a new one.
          </p>
          <div>
            <button>Get Started</button>
            <button>Maybe Later</button>
          </div>
        </section>
        <br />
        <h1>Pages</h1>
        <section>
          <h1>Home</h1>
          <h2>Name1 & Name2</h2>
          <i>Icon</i>
          <span>WeddingDate</span>
          <span>|</span>
          <span>daysRemaining!</span>
          <i>Icon</i>
          <span>
            <button>Add your wedding location</button>
          </span>
          <h3>Events (map through them here)</h3>
          <div>
            <button>Edit Icon Button</button>
            <h2>Rehearsal Dinner</h2>
            <i>Icon</i>
            <span>eventDate</span>
            <i>Icon</i>
            <span>eventTime</span>
            <i>Icon</i>
            <span>eventVenue</span>
          </div>
        </section>
        <section>
          <div>
            <h1>RSVP</h1>
            <div>Rehearsal Dinner</div>
          </div>
          <div>
            <div>
              <h2>Wedding Day</h2>
              <i>Icon</i>
              <span>numGuestsInvited Guests Invited</span>
            </div>
            <div>
              <h3>Will you be attending?</h3>
              <div>
                some chart
                <p>numGuestsResponded of numGuestsInvited responded</p>
              </div>
              <div>
                <div>
                  <span>Accepted</span>
                  <span>numGuestsAccepted</span>
                </div>
                <div>
                  <span>Declined</span>
                  <span>numGuestsDeclined</span>
                </div>
                <div>
                  <span>No Response</span>
                  <span>numGuestsNoResponse</span>
                </div>
              </div>
            </div>
            <Link href='/guest-list'>Manage Guest List</Link>
          </div>
          <div>
            <h3>General Questions</h3>
          </div>
        </section>
      </main>
    </Layout>
  );
}
