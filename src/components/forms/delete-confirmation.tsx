import { sharedStyles } from '../shared-styles';

type DeleteConfirmationProps = {
  isProcessing: boolean;
  noHandler: () => void;
  yesHandler: () => void;
};

export default function DeleteConfirmation({
  isProcessing,
  noHandler,
  yesHandler,
}: DeleteConfirmationProps) {
  return (
    <div className='absolute z-10 flex h-full w-[500px] items-center justify-center bg-white'>
      <div className='flex flex-col justify-center gap-3 px-7 text-center'>
        <h1 className='text-xl font-semibold'>Are you sure?</h1>
        <p>
          Deleting this event will remove it from your website, and also erase
          any guest lists, RSVPs, and meals associated with it.
        </p>
        <div className='mt-4 flex gap-5'>
          <button
            disabled={isProcessing}
            onClick={() => noHandler()}
            className={`${sharedStyles.secondaryButton({
              py: 'py-2',
              isLoading: isProcessing,
            })} w-1/2 ${
              isProcessing
                ? 'text-pink-200'
                : `text-${sharedStyles.primaryColor}`
            }`}
          >
            No
          </button>
          <button
            disabled={isProcessing}
            className={`w-1/2 ${sharedStyles.primaryButton({
              py: 'py-2',
              isLoading: isProcessing,
            })}`}
            onClick={() => yesHandler()}
          >
            {isProcessing ? 'Processing...' : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
}
