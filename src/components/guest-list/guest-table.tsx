type Event = {
  id: string;
  name: string;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  venue: string | null;
  attire: string | null;
  description: string | null;
  userId: string;
};

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  userId: string;
};

type GuestTableProps = {
  events: Event[];
  guests: Guest[];
};

export default function GuestTable({ events, guests }: GuestTableProps) {
  return (
    <div className='px-16'>
      <div
        className={`guest-table grid gap-12 border-b py-6 font-extralight`}
        style={{
          gridTemplateColumns: `40px 175px 100px repeat(${guests.length}, auto) 1fr`,
        }}
      >
        <input type='checkbox' id='check-all'></input>
        <h5>Name</h5>
        <h5>Contact</h5>
        {events.map((event) => {
          return <h5 key={event.id}>{event.name} RSVP</h5>;
        })}
        <h5>My Notes</h5>
      </div>

      <div>
        {guests.map((guest) => {
          return (
            <div
              key={guest.id}
              className={`guest-table grid gap-12 border-b py-4`}
              style={{
                gridTemplateColumns: `40px 175px 100px repeat(${guests.length}, 150px) 1fr`,
              }}
            >
              <input type='checkbox' id={`check-guest-${guest.id}`}></input>
              <h3>{`${guest.firstName} ${guest.lastName}`}</h3>
              <div>
                <i>HO</i>
                <i>PH</i>
                <i>MA</i>
              </div>
              {events.map((event) => {
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
