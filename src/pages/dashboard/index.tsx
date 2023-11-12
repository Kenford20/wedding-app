import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { sharedStyles } from '~/components/shared-styles';
import { LoadingPage } from '~/components/loader';
import { BiCollapseVertical } from 'react-icons/bi';
import { HiOutlineArrowsUpDown } from 'react-icons/hi2';
import Link from 'next/link';
import Layout from '../layout';
import DashboardHeader from '~/components/dashboard/website-header';
import RegistrySetup from '~/components/dashboard/registry-setup';
import PageSectionsTemplate from '~/components/dashboard/page-sections-template';
import HomeContent from '~/components/dashboard/home-content';

export default function Dashboard() {
  const [showRegistrySetup, setShowRegistrySetup] = useState(true);

  useEffect(() => {
    setShowRegistrySetup(
      localStorage.getItem('registrySectionStatus') !== 'hidden'
    );
  }, []);

  const { data: dashboardData, isLoading: isFetchingDashboardData } =
    api.guestList.getByUserId.useQuery();
  console.log(dashboardData);

  if (isFetchingDashboardData) return <LoadingPage />;
  if (typeof window !== 'undefined' && dashboardData === null) {
    window.location.href = '/';
  }

  return (
    <Layout>
      <main>
        <section className='border-b py-10'>
          <DashboardHeader
            websiteUrl={dashboardData?.weddingData?.websiteUrl}
          />
        </section>
        {showRegistrySetup && (
          <section
            className={`${sharedStyles.desktopPaddingSides} border-b py-10`}
          >
            <RegistrySetup setShowRegistrySetup={setShowRegistrySetup} />
          </section>
        )}
        <div
          className={`mt-14 grid grid-cols-[4fr_1fr] gap-5 ${sharedStyles.desktopPaddingSides}`}
        >
          <section className=''>
            <div className='mb-5 flex justify-between'>
              <h2 className='text-xl font-semibold'>Pages</h2>
              <div className='flex items-center'>
                <div className='flex cursor-pointer'>
                  <HiOutlineArrowsUpDown
                    size={21}
                    color={sharedStyles.primaryColorHex}
                  />
                  <button className={`text-${sharedStyles.primaryColor} mx-2`}>
                    Reorder
                  </button>
                </div>
                <div className='flex cursor-pointer'>
                  <BiCollapseVertical
                    size={21}
                    color={sharedStyles.primaryColorHex}
                  />
                  <button className={`text-${sharedStyles.primaryColor}`}>
                    Collapse All
                  </button>
                </div>
              </div>
            </div>
            <section className='mb-10'>
              <PageSectionsTemplate title={'Home'}>
                <HomeContent dashboardData={dashboardData} />
              </PageSectionsTemplate>
            </section>
            <section className='mb-10'>
              <PageSectionsTemplate title={'Our Story'} />
            </section>
            <section className='mb-10'>
              <PageSectionsTemplate title={'Wedding Party'} />
            </section>
            <section className='mb-10'>
              <PageSectionsTemplate title={'Photos'} />
            </section>
            <section className='mb-10'>
              <PageSectionsTemplate title={'Q + A'} />
            </section>
            <section className='mb-10'>
              <PageSectionsTemplate title={'Travel'} />
            </section>
            <section className='mb-10'>
              <PageSectionsTemplate title={'Things to Do'} />
            </section>
            <section className='mb-10'>
              <PageSectionsTemplate title={'RSVP'}>
                <>
                  <div>
                    <h2>RSVP</h2>
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
                </>
              </PageSectionsTemplate>
            </section>
          </section>

          <section className='h-72 w-72 bg-red-200'>
            <div className='flex justify-between'>
              <h2 className='text-xl font-semibold'>Your Theme</h2>
              <button>Browse Themes</button>
            </div>
            <div>theme</div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
