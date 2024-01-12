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
import WebsiteSettingsForm from '~/components/forms/website-settings';

import { type EventFormData, type Event } from '~/types/schema';

export default function Dashboard() {
  const isEventFormOpen = useEventForm();
  const [showRegistrySetup, setShowRegistrySetup] = useState<boolean>(true);
  const [events, setEvents] = useState<Event[]>();
  const [prefillEvent, setPrefillEvent] = useState<EventFormData | undefined>();
  const [collapseSections, setCollapseSections] = useState<boolean>(false);
  const [isWebsiteSettingsOpen, setIsWebsiteSettingsOpen] =
    useState<boolean>(false);

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

  console.log('dash', dashboardData);

  return (
    <Layout>
      <main>
        {isEventFormOpen && (
          <EventForm setEvents={setEvents} prefillFormData={prefillEvent} />
        )}
        {isWebsiteSettingsOpen && (
          <WebsiteSettingsForm
            setIsWebsiteSettingsOpen={setIsWebsiteSettingsOpen}
            website={dashboardData?.weddingData?.website}
          />
        )}
        <DashboardHeader
          websiteUrl={dashboardData?.weddingData?.website?.url}
          setIsWebsiteSettingsOpen={setIsWebsiteSettingsOpen}
        />
        {showRegistrySetup && (
          <RegistrySetup setShowRegistrySetup={setShowRegistrySetup} />
        )}
        <div
          className={`mt-14 grid grid-cols-[3.25fr_300px] gap-7 ${sharedStyles.desktopPaddingSides}`}
        >
          <div>
            <div className='flex justify-between pb-8'>
              <h2 className='text-xl font-semibold'>Pages</h2>
              <DashboardControls
                collapseSections={collapseSections}
                setCollapseSections={setCollapseSections}
              />
            </div>
            <PageSectionsTemplate title={'Home'} collapse={collapseSections}>
              <HomeContent
                dashboardData={dashboardData}
                events={events}
                setPrefillEvent={setPrefillEvent}
              />
            </PageSectionsTemplate>
            <PageSectionsTemplate
              title={'Our Story'}
              collapse={collapseSections}
            />
            <PageSectionsTemplate
              title={'Wedding Party'}
              collapse={collapseSections}
            />
            <PageSectionsTemplate
              title={'Photos'}
              collapse={collapseSections}
            />
            <PageSectionsTemplate title={'Q + A'} collapse={collapseSections} />
            <PageSectionsTemplate
              title={'Travel'}
              collapse={collapseSections}
            />
            <PageSectionsTemplate
              title={'Things to Do'}
              collapse={collapseSections}
            />
            <PageSectionsTemplate title={'RSVP'} collapse={collapseSections}>
              <RsvpContent
                events={dashboardData.events}
                totalGuests={dashboardData.totalGuests}
              />
            </PageSectionsTemplate>
          </div>
          <SidebarPanel setIsWebsiteSettingsOpen={setIsWebsiteSettingsOpen} />
        </div>
      </main>
    </Layout>
  );
}
