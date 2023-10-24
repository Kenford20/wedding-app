import { SignInButton, useUser, SignOutButton } from '@clerk/nextjs';
import Head from 'next/head';
import { LoadingPage } from '~/components/loader';
import { api } from '~/utils/api';
import NamesForm from '../components/names-form';

export default function Home() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn)
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='inline-block border-2 border-black p-2'>
          <SignInButton />
        </div>
      </div>
    );

  const { data: currentUsersWebsite, isLoading } =
    api.website.getByUserId.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!!currentUsersWebsite) window.location.href = '/dashboard';

  return (
    !currentUsersWebsite && (
      <>
        <Head>
          <title>Test</title>
          <meta name='description' content='Generated by create-t3-app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className='flex justify-between bg-pink-300 p-4'>
          <h1>{user.firstName}</h1>
          <SignOutButton />
        </div>
        <main className='flex min-h-screen flex-col items-center justify-center'>
          <NamesForm />
        </main>
      </>
    )
  );
}
