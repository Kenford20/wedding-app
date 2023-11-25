import { AiOutlineHome } from 'react-icons/ai';
import { CiMail } from 'react-icons/ci';
import { FaSort } from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi2';
import { type Household, type Event, type Guest } from '~/types/schema';
import { sharedStyles } from '../shared-styles';

type TableRowProps = {
  guest: Guest;
  events: Event[];
  partySize: number;
  notes: string;
  foobar: boolean;
};

const TableRow = ({
  guest,
  events,
  partySize,
  notes,
  foobar,
}: TableRowProps) => {
  if (!guest) return null;
  return (
    <div
      key={guest.id}
      className={`guest-table grid min-w-fit items-center gap-12 pl-8`}
      style={{
        gridTemplateColumns: `40px 240px 100px 125px repeat(${events.length}, 175px) 175px`,
      }}
    >
      <div>
        <input
          className='h-6 w-6 cursor-pointer border-gray-100'
          style={{ accentColor: sharedStyles.primaryColorHex }}
          type='checkbox'
          id={`check-guest-${guest.id}`}
        />
      </div>
      <h3>{`${guest.firstName} ${guest.lastName}`}</h3>
      {foobar ? <span className='absolue'>{partySize}</span> : <div></div>}
      {foobar ? (
        <div className='flex gap-2'>
          <AiOutlineHome size={22} />
          <HiOutlinePhone size={22} />
          <CiMail size={23} />
        </div>
      ) : (
        <div></div>
      )}
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
      <div>{foobar && notes}</div>
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
          className='guest-table grid min-w-fit items-center gap-12 border-b py-6 pl-8 font-light italic'
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
          {households?.map((household) => {
            return (
              // TODO: refactor table layout for households with multiple guests
              <div key={household.id} className='border-b py-5'>
                {household.guests.map((guest, i) => {
                  return (
                    <TableRow
                      key={guest.id}
                      guest={guest}
                      events={events}
                      partySize={household.guests.length}
                      notes={household.notes ?? '-'}
                      foobar={i === 0}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
