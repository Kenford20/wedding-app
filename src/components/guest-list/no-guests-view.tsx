import { sharedStyles } from '../shared-styles';
import ExampleTable from './example-table';

type NoGuestsViewProps = {
  setShowGuestForm: (x: boolean) => void;
};

export function NoGuestsView({ setShowGuestForm }: NoGuestsViewProps) {
  return (
    <section className={sharedStyles.desktopPaddingSides}>
      <div className='my-10 w-[500px] cursor-pointer rounded-md p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
        <h2 className='pb-3 text-2xl font-semibold'>
          Add Guests to This Event
        </h2>
        <p>
          Simply add guests that you&apos;ve already added to other events, or
          add a unique guest to this event.
        </p>
        <div className='mt-5 flex gap-5'>
          <button
            className={sharedStyles.primaryButton({ px: 'px-12', py: 'py-2' })}
          >
            Import Guests
          </button>
          <button
            className={sharedStyles.primaryButton({ px: 'px-12', py: 'py-2' })}
            onClick={() => setShowGuestForm(true)}
          >
            Add Guest
          </button>
        </div>
      </div>
      <ExampleTable />
    </section>
  );
}
