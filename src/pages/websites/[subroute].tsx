'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '~/components/loader';
import { api } from '~/utils/api';
import Navbar from '../../components/user-website/navbar';

export default function WebsiteTemplate() {
  const router = useRouter();
  const websiteUrl = router.query.subroute;

  const { data: weddingData, isLoading } =
    api.website.fetchWeddingData.useQuery({
      subUrl: String(router.query.subroute!),
    });

  if (isLoading) return <LoadingSpinner />;
  if (!weddingData) return <div>404</div>;

  console.log('wedding, ', weddingData);

  return (
    !!weddingData && (
      <main className='flex h-screen flex-col items-center justify-center gap-20 font-["Crimson_Text"] tracking-widest text-zinc-500'>
        <div className='text-center'>
          <h1 className='my-5 text-6xl font-medium tracking-widest'>
            {weddingData.groomFirstName} & {weddingData.brideFirstName}
          </h1>
          <p className='text-lg'>
            {weddingData.date?.standardFormat?.toString()}
          </p>
          {weddingData.daysRemaining > 0 && (
            <p className='text-lg'>{weddingData.daysRemaining} Days To Go!</p>
          )}
        </div>
        <Navbar />
        <div className='w-48 text-center'>
          image placeholder will need to look into uploading on dashboard and
          storing in some storage bucket to be fetched and rendered here s3
          bucket?
        </div>

        {weddingData.events.map((event) => {
          return (
            <div key={event.id}>
              <h3 className='text-3xl font-extralight tracking-widest'>
                {event.name.toLowerCase()}
              </h3>
              <h3 className='text-3xl font-light'>{event.date?.toString()}</h3>
            </div>
          );
        })}

        <div className='text-center'>
          <h2 className='border-b border-black px-5 pb-6 text-6xl'>
            {weddingData.groomFirstName[0]} & {weddingData.brideFirstName[0]}
          </h2>
          <p className='mt-4 text-lg tracking-widest'>
            {weddingData.date.numberFormat?.toString()}
          </p>
        </div>

        <div className='text-center'>
          <p className='text-sm'>Created by Kenford</p>
          <p className='text-sm'>
            Getting married?{' '}
            <span className='underline'>
              <Link href={'/'}>Create your wedding website for free</Link>
            </span>
          </p>
        </div>
      </main>
    )
  );
}
