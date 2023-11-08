import { sharedStyles } from '../shared-styles';
import ExampleTable from './example-table';

export function NoGuestsView() {
  return (
    <section className={sharedStyles.desktopPaddingSides}>
      <div className='w-96 p-5 shadow-xl'>
        <h2>Add Guests to This Event</h2>
        <p>
          Simply add guests that you&apos;ve already added to other events, or
          add a unique guest to this event.
        </p>
      </div>
      <ExampleTable />
    </section>
  );
}
