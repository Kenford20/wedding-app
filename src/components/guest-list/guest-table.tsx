import { type Guest, type Event } from '~/types/schema';
import { sharedStyles } from '../shared-styles';

type GuestTableProps = {
  events: Event[];
  guests: Guest[];
};

export default function GuestTable({ events, guests }: GuestTableProps) {
  return (
    <div className={sharedStyles.desktopPaddingSides}>
      <div
        className={`guest-table grid gap-12 border-b py-6 font-extralight`}
        style={{
          gridTemplateColumns: `40px 200px 100px repeat(${events.length}, 175px) 1fr`,
        }}
      >
        <div>
          <input
            style={{ accentColor: sharedStyles.primaryColorHex }}
            type='checkbox'
            id='check-all'
            className='h-7 w-7'
          />
        </div>
        <h5>Name</h5>
        <h5>Contact</h5>
        {events?.map((event) => {
          return <h5 key={event.id}>{event.name} RSVP</h5>;
        })}
        <h5>My Notes</h5>
      </div>

      <div>
        {guests?.map((guest) => {
          return (
            <div
              key={guest.id}
              className={`guest-table grid gap-12 border-b py-4`}
              style={{
                gridTemplateColumns: `40px 200px 100px repeat(${events.length}, 175px) 1fr`,
              }}
            >
              <div>
                <input
                  className='h-7 w-7'
                  style={{ accentColor: sharedStyles.primaryColorHex }}
                  type='checkbox'
                  id={`check-guest-${guest.id}`}
                />
              </div>
              <h3>{`${guest.firstName} ${guest.lastName}`}</h3>
              <div>
                <i>HO</i>
                <i>PH</i>
                <i>MA</i>
              </div>
              {events?.map((event) => {
                return (
                  <div key={event.id}>
                    <select name='guestRSVP' id={`guest-rsvp-${guest.id}`}>
                      <option value='invited'>Not Invited</option>
                      <option value='invited'>Invited</option>
                      <option value='attending'>Attending</option>
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
  );
}
