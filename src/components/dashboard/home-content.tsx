import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlinePlusCircle,
} from 'react-icons/ai';
import { CiLocationOn } from 'react-icons/ci';
import { BsPencil } from 'react-icons/bs';
import { TfiNewWindow } from 'react-icons/tfi';
import { sharedStyles } from '../shared-styles';
import { type WeddingData, type Event, type Guest } from '~/types/schema';
import { convertDate } from '~/server/api/utils';

type DashboardData = {
  events: Event[];
  guests: Guest[];
  totalEvents: number;
  totalGuests: number;
  weddingData: WeddingData;
};

type HomeContentProps = {
  dashboardData: DashboardData;
};

export default function HomeContent({ dashboardData }: HomeContentProps) {
  return (
    <div className=''>
      <div className='px-10'>
        <div className='flex cursor-pointer items-center justify-center border py-16 transition-colors duration-300 ease-in-out hover:bg-gray-100'>
          <div className='flex'>
            <AiOutlinePlusCircle
              size={25}
              color={sharedStyles.primaryColorHex}
            />
            <p className={`pl-3 text-${sharedStyles.primaryColor}`}>
              Add a Cover Photo
            </p>
          </div>
        </div>
      </div>
      <div className='border-b py-5'>
        <div className='px-10'>
          <h2 className='my-3 text-xl font-semibold'>
            {dashboardData?.weddingData?.groomFirstName} &{' '}
            {dashboardData?.weddingData?.brideFirstName}
          </h2>
          <div className='flex gap-1 text-neutral-500'>
            <AiOutlineCalendar size={20} />
            <span>{dashboardData?.weddingData?.date?.standardFormat}</span>
            <span>|</span>
            <span>{dashboardData?.weddingData?.daysRemaining} Days To Go!</span>
          </div>
          <div className='mt-1 flex gap-1'>
            <CiLocationOn size={20} />
            <span>
              <button
                className={`cursor-pointer text-${sharedStyles.primaryColor}`}
              >
                Add your wedding location
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className='px-10 py-5'>
        <h2 className='mb-3 text-sm'>Events</h2>
        <div className='grid grid-cols-3 gap-5'>
          {dashboardData?.events?.map((event) => {
            return (
              <div key={event.id} className='relative border p-6'>
                <button className='absolute right-5 top-5'>
                  <BsPencil size={24} color={sharedStyles.primaryColorHex} />
                </button>
                <h3 className='mb-4 text-lg font-semibold'>{event.name}</h3>
                <div className='flex flex-col gap-3 text-sm font-light'>
                  <div className='flex gap-2'>
                    <AiOutlineCalendar size={20} />
                    {!!event.date ? (
                      <p>{convertDate(event.date)}</p>
                    ) : (
                      <button className='underline'>Add date</button>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <AiOutlineClockCircle size={20} />
                    {!!event.startTime ? (
                      <p>{event.startTime.toString()}</p>
                    ) : (
                      <button className='underline'>Add time</button>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <CiLocationOn size={20} />
                    {!!event.venue ? (
                      <p>{event.venue}</p>
                    ) : (
                      <div className='flex gap-2'>
                        <button className='underline'>Add venue</button>
                        <span className='text-neutral-300'>|</span>
                        <button className='underline'>Browse venues</button>
                        <TfiNewWindow size={18} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {/* TODO: useContext here to trigger add event form */}
          <div className='flex items-center justify-center border'>
            <div className='flex'>
              <AiOutlinePlusCircle
                size={25}
                color={sharedStyles.primaryColorHex}
              />
              <p className={`pl-3 text-${sharedStyles.primaryColor}`}>
                Add Event
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
