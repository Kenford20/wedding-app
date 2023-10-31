import { sharedStyles } from '../shared-styles';

type DashboardHeaderProps = {
  websiteUrl: string | undefined;
};

export default function DashboardHeader({ websiteUrl }: DashboardHeaderProps) {
  console.log('or', window.location.origin);
  return (
    <div className='flex justify-between px-16 pb-5 pt-10'>
      <div className=''>
        <h1 className='text-3xl font-bold'>Your Website</h1>
        <div className='mt-2 flex'>
          <p>{websiteUrl}</p>
          <button className='ml-5 text-pink-400'>Copy</button>
          <button className='ml-5 text-pink-400'>Edit</button>
        </div>
      </div>
      <div>
        <button className={sharedStyles.secondaryButton}>
          Share your Website
        </button>
        <button className={`ml-5 ${sharedStyles.primaryButton}`}>
          Preview Site
        </button>
      </div>
    </div>
  );
}
