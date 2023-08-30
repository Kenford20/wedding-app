import { useUser, SignOutButton } from '@clerk/nextjs';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div>
      <div className='flex justify-between bg-pink-300 p-4'>
        <h1>{user?.firstName ?? 'wee'}</h1>
        <SignOutButton />
      </div>
      Dashboard
    </div>
  );
}
