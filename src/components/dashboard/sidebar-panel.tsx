import Link from 'next/link';
import { sharedStyles } from '../shared-styles';

export default function SidebarPanel() {
  return (
    <section className='px-3'>
      <div className='flex items-end justify-between border-b pb-5'>
        <h2 className='text-2xl font-semibold'>Your Theme</h2>
        <Link href='' className={`text-${sharedStyles.primaryColor} text-lg`}>
          Browse Themes
        </Link>
      </div>
      <div className='flex items-end justify-between border-b py-5'>
        <h2 className='text-2xl font-semibold'>Privacy Settings</h2>
        <Link href='' className={`text-${sharedStyles.primaryColor} text-lg`}>
          Manage
        </Link>
      </div>
    </section>
  );
}
