import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { sharedStyles } from '~/components/shared-styles';
import { LoadingPage } from '~/components/loader';
import { useEventForm } from '~/contexts/event-form-context';
import Layout from '../layout';
import DashboardHeader from '~/components/dashboard/website-header';
import RegistrySetup from '~/components/dashboard/registry-setup';
import PageSectionsTemplate from '~/components/dashboard/page-sections-template';
import HomeContent from '~/components/dashboard/home-content';
import EventForm from '~/components/forms/event-form';
import OopsPage from '~/components/oops';
import RsvpContent from '~/components/dashboard/rsvp-content';
import DashboardControls from '~/components/dashboard/controls';
import SidebarPanel from '~/components/dashboard/sidebar-panel';

import { type EventFormData, type Event } from '~/types/schema';

export default function Dashboard() {
  const isEventFormOpen = useEventForm();
  const [showRegistrySetup, setShowRegistrySetup] = useState<boolean>(true);
  const [events, setEvents] = useState<Event[]>();
  const [prefillEvent, setPrefillEvent] = useState<EventFormData | undefined>();

  useEffect(() => {
    setShowRegistrySetup(
      localStorage.getItem('registrySectionStatus') !== 'hidden'
    );
  }, []);

  const { data: dashboardData, isLoading: isFetchingDashboardData } =
    api.guestList.getByUserId.useQuery();

  useEffect(() => {
    setEvents(dashboardData?.events ?? []);
  }, [dashboardData]);

  if (isFetchingDashboardData) return <LoadingPage />;
  if (typeof window !== 'undefined' && dashboardData === null) {
    window.location.href = '/';
  }
  if (!dashboardData || !events) return <OopsPage />;

  return (
    <Layout>
      <main>
        {isEventFormOpen && (
          <EventForm setEvents={setEvents} prefillFormData={prefillEvent} />
        )}
        <DashboardHeader websiteUrl={dashboardData?.weddingData?.websiteUrl} />
        {showRegistrySetup && (
          <RegistrySetup setShowRegistrySetup={setShowRegistrySetup} />
        )}
        <div
          className={`mt-14 grid grid-cols-[3.25fr_300px] gap-7 ${sharedStyles.desktopPaddingSides}`}
        >
          <div>
            <div className='flex justify-between pb-8'>
              <h2 className='text-xl font-semibold'>Pages</h2>
              <DashboardControls />
            </div>
            <PageSectionsTemplate title={'Home'}>
              <HomeContent
                dashboardData={dashboardData}
                events={events}
                setPrefillEvent={setPrefillEvent}
              />
            </PageSectionsTemplate>
            <PageSectionsTemplate title={'Our Story'} />
            <PageSectionsTemplate title={'Wedding Party'} />
            <PageSectionsTemplate title={'Photos'} />
            <PageSectionsTemplate title={'Q + A'} />
            <PageSectionsTemplate title={'Travel'} />
            <PageSectionsTemplate title={'Things to Do'} />
            <PageSectionsTemplate title={'RSVP'}>
              <RsvpContent />
            </PageSectionsTemplate>
          </div>
          <SidebarPanel />
        </div>
      </main>
    </Layout>
  );
}
