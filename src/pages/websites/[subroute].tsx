'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '~/components/loader';
import { api } from '~/utils/api';

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
      <main className='flex h-screen flex-col items-center justify-center gap-20'>
        <p>{websiteUrl}</p>
        <div className='text-center'>
          <h1 className='text-3xl'>
            {weddingData.groomFirstName} & {weddingData.brideFirstName}
          </h1>
          <p className='text-md'>*weddingDate: October 15, 2024</p>
          <p className='text-lg'>*remaininigDays: 413 Days To Go!</p>
        </div>

        <div className='text-center'>
          image placeholder will need to look into uploading on dashboard and
          storing in some storage bucket to be fetched and rendered here s3
          bucket?
        </div>

        <div className='text-center'>
          <button className='rounded-md bg-pink-200 px-10 py-4'>RSVP</button>
          <h2>Wedding Day</h2>
          <p className='text-xl'>*weddingDate: October 15, 2024</p>
        </div>

        <div className='text-center'>
          <h2 className='text-3xl'>
            {weddingData.groomFirstName[0]} & {weddingData.brideFirstName[0]}
          </h2>
          <br />
          <p className='text-lg'>*weddingDate numberFormat: 10.15.2024</p>
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
