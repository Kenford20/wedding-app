import { AiOutlineHome } from 'react-icons/ai';
import { CiMail } from 'react-icons/ci';
import { FaSort } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { type Guest, type Event } from '~/types/schema';
import { sharedStyles } from '../shared-styles';

type GuestTableProps = {
  events: Event[];
  guests: Guest[];
};

export default function GuestTable({ events, guests }: GuestTableProps) {
  return (
    <div className={sharedStyles.desktopPaddingSidesGuestList}>
      <div className={`box-border overflow-auto`}>
        <div
          className={`guest-table grid min-w-fit items-center gap-12 border-b py-6 pl-8 font-light italic`}
          style={{
            gridTemplateColumns: `40px 240px 100px 100px repeat(${events.length}, 175px) 175px`,
          }}
        >
          <div>
            <input
              style={{ accentColor: sharedStyles.primaryColorHex }}
              type='checkbox'
              id='check-all'
              className='h-6 w-6'
            />
          </div>
          <div className='flex cursor-pointer items-center items-center gap-2'>
            <h5>Name</h5>
            <FaSort size={14} />
          </div>
          <div className='flex cursor-pointer items-center items-center gap-2'>
            <h5>Party Of</h5>
            <FaSort size={14} />
          </div>
          <h5>Contact</h5>
          {events?.map((event) => {
            return <h5 key={event.id}>{event.name} RSVP</h5>;
          })}
          <h5>My Notes</h5>
        </div>

        <div className='text-md min-w-fit border-l border-r'>
          {guests?.map((guest) => {
            return (
              <div
                key={guest.id}
                className={`guest-table grid min-w-fit items-center gap-12 border-b py-5 pl-8`}
                style={{
                  gridTemplateColumns: `40px 240px 100px 100px repeat(${events.length}, 175px) 175px`,
                }}
              >
                <div>
                  <input
                    className='h-6 w-6'
                    style={{ accentColor: sharedStyles.primaryColorHex }}
                    type='checkbox'
                    id={`check-guest-${guest.id}`}
                  />
                </div>
                <h3>{`${guest.firstName} ${guest.lastName}`}</h3>
                <span>1</span>
                <div className='flex gap-1'>
                  <AiOutlineHome size={24} />
                  <FiPhone size={24} />
                  <CiMail size={25} />
                </div>
                {events?.map((event) => {
                  return (
                    <div key={event.id}>
                      <select name='guestRSVP' id={`guest-rsvp-${guest.id}`}>
                        <option value='Not Invited'>Not Invited</option>
                        <option value='Invited'>Invited</option>
                        <option value='Attending'>Attending</option>
                        <option value='Declined'>Declined</option>
                      </select>
                    </div>
                  );
                })}
                <div>{guest.notes ?? '-'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
