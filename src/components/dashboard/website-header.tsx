import { sharedStyles } from '../shared-styles';
import { FiEdit2 } from 'react-icons/fi';
import { FaRegCopy } from 'react-icons/fa';

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
            <span
              className={`ml-5 cursor-pointer text-${sharedStyles.primaryColor} flex items-center gap-1`}
            >
              <FaRegCopy size={16} color={sharedStyles.primaryColorHex} />
              Copy
            </span>
            <span
              className={`ml-5 cursor-pointer text-${sharedStyles.primaryColor} flex items-center gap-1`}
            >
              <FiEdit2 size={16} color={sharedStyles.primaryColorHex} />
              Edit
            </span>
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
