import { sharedStyles } from '../shared-styles';

type DashboardHeaderProps = {
  websiteUrl: string | undefined;
};

export default function DashboardHeader({ websiteUrl }: DashboardHeaderProps) {
  return (
    <section className='border-b py-10'>
      <div
        className={`flex justify-between ${sharedStyles.desktopPaddingSides}`}
      >
        <div className=''>
          <h1 className='text-3xl font-bold'>Your Website</h1>
          <div className='mt-2 flex'>
            <p>{websiteUrl}</p>
            <button className={`ml-5 text-${sharedStyles.primaryColor}`}>
              Copy
            </button>
            <button className={`ml-5 text-${sharedStyles.primaryColor}`}>
              Edit
            </button>
          </div>
        </div>
        <div>
          <button className={sharedStyles.secondaryButton()}>
            Share your Website
          </button>
          <button className={`ml-5 ${sharedStyles.primaryButton()}`}>
            Preview Site
          </button>
        </div>
      </div>
    </section>
  );
}
