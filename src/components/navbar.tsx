import { useUser, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const { user } = useUser();

  return (
    <div className='bottom-2 border px-20 pt-5'>
      <h1 className='pb-4 text-3xl'>{user?.firstName ?? 'wee'}</h1>
      <ul className='flex justify-between'>
        <div className='flex gap-7 pb-5'>
          <li className='border-b-4 border-transparent pb-5 hover:border-gray-600'>
            <Link className='' href='/'>
              Planning Tools
            </Link>
          </li>
          <li className='border-b-4 border-transparent pb-5 hover:border-gray-600'>
            <Link href='/'>Vendors</Link>
          </li>
          <li className='border-b-4 border-transparent pb-5 hover:border-gray-600'>
            <Link href='/'>Wedding Website</Link>
          </li>
          <li className='border-b-4 border-transparent pb-5 hover:border-gray-600'>
            <Link href='/'>Invitations</Link>
          </li>
          <li className='border-b-4 border-transparent pb-5 hover:border-gray-600'>
            <Link href='/'>Registry</Link>
          </li>
          <li className='border-b-4 border-transparent pb-5 hover:border-gray-600'>
            <Link href='/'>Attire & Rings</Link>
          </li>
          <li className='border-b-4 border-transparent pb-5 hover:border-gray-600'>
            <Link href='/'>Ideas & Advice</Link>
          </li>
          <li>
            <Link
              className='border-b-4 border-transparent pb-5 hover:border-gray-600'
              href='/'
            >
              Gifts & Favors
            </Link>
          </li>
        </div>
        <div className='pb-5'>
          <SignOutButton />
        </div>
      </ul>
    </div>
  );
}
