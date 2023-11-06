import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='px-20 pt-5'>
      <ul className='flex justify-between'>
        <div className='flex gap-7'>
          <li className='border-b-4 border-transparent pb-5 hover:border-gray-600'>
            <Link className='' href='/'>
              Home
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
      </ul>
    </div>
  );
}
