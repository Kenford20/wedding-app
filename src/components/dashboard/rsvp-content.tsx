import Link from 'next/link';

export default function RsvpContent() {
  return (
    <div>
      <div>
        <h2>RSVP</h2>
        <div>Rehearsal Dinner</div>
      </div>
      <div>
        <div>
          <h2>Wedding Day</h2>
          <i>Icon</i>
          <span>numGuestsInvited Guests Invited</span>
        </div>
        <div>
          <h3>Will you be attending?</h3>
          <div>
            some chart
            <p>numGuestsResponded of numGuestsInvited responded</p>
          </div>
          <div>
            <div>
              <span>Attending</span>
              <span>numGuestsAttending</span>
            </div>
            <div>
              <span>Declined</span>
              <span>numGuestsDeclined</span>
            </div>
            <div>
              <span>No Response</span>
              <span>numGuestsNoResponse</span>
            </div>
          </div>
        </div>
        <Link href='/guest-list?event=all'>Manage Guest List</Link>
      </div>
      <div>
        <h3>General Questions</h3>
      </div>
    </div>
  );
}
