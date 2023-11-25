import { AiOutlineHome } from 'react-icons/ai';
import { CiMail } from 'react-icons/ci';
import { FaSort } from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi2';
import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { type Household, type Event } from '~/types/schema';
import { sharedStyles } from '../shared-styles';

type TableRowProps = {
  household: Household;
  events: Event[];
};

const TableRow = ({ household, events }: TableRowProps) => {
  const toggleGuestForm = useToggleGuestForm();
  return (
    <div
      key={household.id}
      className='guest-table grid min-w-fit cursor-pointer items-center gap-12 border-b py-5 pl-8'
      style={{
        gridTemplateColumns: `40px 240px 100px 125px repeat(${events.length}, 175px) 175px`,
      }}
      // TODO: use state to initialize guest form with household data like in event form
      onClick={() => toggleGuestForm()}
    >
      <div className='flex flex-col gap-1'>
        {household.guests.map((guest) => {
          return (
            <div key={guest.id}>
              <input
                className='h-6 w-6 cursor-pointer'
                style={{
                  accentColor: sharedStyles.primaryColorHex,
                }}
                type='checkbox'
                id={`check-guest-${guest.id}`}
              />
            </div>
          );
        })}
      </div>

      <div className='flex flex-col gap-2'>
        {household.guests.map((guest) => {
          return (
            <span key={guest.id}>{`${guest.firstName} ${guest.lastName}`}</span>
          );
        })}
      </div>

      <p>{household.guests.length}</p>

      <div className='flex gap-2'>
        <AiOutlineHome size={22} />
        <HiOutlinePhone size={22} />
        <CiMail size={23} />
      </div>

      {events?.map((event) => {
        return (
          <div key={event.id} className='flex flex-col gap-2'>
            {household.guests.map((guest) => {
              return (
                <div key={guest.id} className='flex items-center'>
                  <select
                    name='guestRSVP'
                    id={`guest-rsvp-${guest.id}`}
                    className='pr-3 font-light tracking-tight'
                  >
                    <option value='Not Invited'>Not Invited</option>
                    <option value='Invited'>Invited</option>
                    <option value='Attending'>Attending</option>
                    <option value='Declined'>Declined</option>
                  </select>
                </div>
              );
            })}
          </div>
        );
      })}

      <p>{household.notes ?? '-'}</p>
    </div>
  );
};

type GuestTableProps = {
  events: Event[];
  households: Household[];
};

export default function GuestTable({ events, households }: GuestTableProps) {
  return (
    <div className={sharedStyles.desktopPaddingSidesGuestList}>
      <div className='box-border max-h-[80vh] overflow-auto'>
        <div
          className='guest-table grid min-w-fit items-center gap-12 border-b py-6 pl-8 font-light italic text-gray-600'
          style={{
            gridTemplateColumns: `40px 240px 100px 125px repeat(${events.length}, 175px) 175px`,
          }}
        >
          <div>
            <input
              style={{ accentColor: sharedStyles.primaryColorHex }}
              type='checkbox'
              id='check-all'
              className='h-6 w-6 cursor-pointer'
            />
          </div>
          <div className='flex cursor-pointer items-center gap-2'>
            <h5>Name</h5>
            <FaSort size={14} />
          </div>
          <div className='flex cursor-pointer items-center gap-2'>
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
          {households?.map((household) => (
            <TableRow
              key={household.id}
              household={household}
              events={events}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
