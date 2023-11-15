import Link from 'next/link';
import { AiOutlineDown, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { sharedStyles } from '../shared-styles';

type PageSectionsTemplateProps = {
  title: string;
  children?: React.ReactNode;
};

export default function PageSectionsTemplate({
  title,
  children,
}: PageSectionsTemplateProps) {
  return (
    <section className='mb-10'>
      <div className='w-full border'>
        <div className='flex justify-between px-5 py-7'>
          <div className='flex'>
            <button>
              <AiOutlineDown />
            </button>
            <h2 className='ml-3 text-xl font-semibold'>{title}</h2>
          </div>
          <div className='flex'>
            <Link href='/dashboard/preview'>
              <button className='text-pink-400'>Preview</button>
            </Link>
            {title !== 'Home' && (
              <>
                <span className={sharedStyles.verticalDivider}>|</span>
                <BsThreeDotsVertical size={23} />
              </>
            )}
          </div>
        </div>
        {children}
        <div className='border-t'></div>
        <div className='p-5'>
          <div className='flex cursor-pointer'>
            <AiOutlinePlusCircle
              size={25}
              color={sharedStyles.primaryColorHex}
            />
            <p className={`pl-3 text-${sharedStyles.primaryColor}`}>
              Add More to {title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
