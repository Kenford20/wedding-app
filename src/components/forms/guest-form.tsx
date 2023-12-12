'use client';

import { useState } from 'react';
import { api } from '~/utils/api';
import { sharedStyles } from '../shared-styles';
import { useToggleGuestForm } from '~/contexts/guest-form-context';
import { useDisablePageScroll } from '../helpers';
import { GuestNameForm } from './guest-names';
import { IoMdClose } from 'react-icons/io';

import { type Dispatch, type SetStateAction } from 'react';
import {
  type FormInvites,
  type Event,
  type Household,
  type HouseholdFormData,
} from '../../types/schema';

const defaultContactData = {
  address1: undefined,
  address2: undefined,
  city: undefined,
  state: undefined,
  country: undefined,
  zipCode: undefined,
  phoneNumber: undefined,
  email: undefined,
  notes: undefined,
};

const defaultHouseholdFormData = (events: Event[]) => {
  const invites: FormInvites = {};
  events.forEach((event: Event) => (invites[event.id] = 'Not Invited'));
  return {
    ...defaultContactData,
    householdId: '',
    guestParty: [
      {
        firstName: '',
        lastName: '',
        invites,
      },
    ],
  };
};

type AddGuestFormProps = {
  events: Event[];
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
  prefillFormData: HouseholdFormData | undefined;
};

export default function AddGuestForm({
  events,
  setHouseholds,
  prefillFormData,
}: AddGuestFormProps) {
  const isEditMode = !!prefillFormData;
  const toggleGuestForm = useToggleGuestForm();

  const [householdFormData, setHouseholdFormData] = useState<HouseholdFormData>(
    prefillFormData ?? defaultHouseholdFormData(events)
  );
  const [contactData, setContactData] = useState(defaultContactData);

  useDisablePageScroll();

  const getTitle = () => {
    if (!isEditMode || !prefillFormData) return 'Add Party';
    const primaryContact = prefillFormData.guestParty[0];
    const primaryContactName =
      primaryContact?.firstName + ' ' + primaryContact?.lastName;
    const numGuests = prefillFormData.guestParty.length;
    return numGuests > 1
      ? `${primaryContactName} + ${numGuests - 1}`
      : primaryContactName;
  };

  const handleOnChange = (field: string, input: string) => {
    setContactData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
  };

  const handleAddGuestToParty = () => {
    const invites: FormInvites = {};
    events.forEach((event: Event) => (invites[event.id] = 'Not Invited'));
    setHouseholdFormData((prev) => {
      return {
        ...prev,
        guestParty: [
          ...prev.guestParty,
          {
            firstName: '',
            lastName: '',
            invites,
          },
        ],
      };
    });
  };

  return (
    <div className='fixed top-0 z-50 flex h-screen w-screen justify-end overflow-y-scroll bg-transparent/[0.5] pb-16'>
      <div className='relative h-fit w-[525px] bg-white'>
        <div className='flex justify-between border-b p-5'>
          <h1 className='text-xl font-semibold'>{getTitle()}</h1>
          <span className='cursor-pointer' onClick={() => toggleGuestForm()}>
            <IoMdClose size={25} />
          </span>
        </div>
        {householdFormData?.guestParty.map((guest, i) => {
          return (
            <div key={i}>
              <GuestNameForm
                events={events}
                guestIndex={i}
                guest={guest}
                setHouseholdFormData={setHouseholdFormData}
              />
            </div>
          );
        })}
        <div className='mt-3 text-center'>
          <button
            onClick={() => handleAddGuestToParty()}
            className={`text-${sharedStyles.primaryColor}`}
          >
            + Add A Guest To This Party
          </button>
        </div>
        <div className='p-5'>
          <h2 className='mb-3 text-xl font-semibold'>Contact Information</h2>
          <div className='grid grid-cols-1 grid-rows-[repeat(5,50px)] gap-3'>
            <input
              className='w-100 border p-3'
              placeholder='Street Address'
              value={contactData.address1}
              onChange={(e) => handleOnChange('address1', e.target.value)}
            />
            <input
              className='w-100 border p-3'
              placeholder='Apt/Suite/Other'
              value={contactData.address2}
              onChange={(e) => handleOnChange('address2', e.target.value)}
            />
            <div className='flex gap-3'>
              <input
                className='w-1/2 border p-3'
                placeholder='City'
                value={contactData.city}
                onChange={(e) => handleOnChange('city', e.target.value)}
              />
              <select
                value={contactData.state}
                onChange={(e) => handleOnChange('state', e.target.value)}
                className='w-1/4 border p-3'
              >
                <option defaultValue='State'>State</option>
                <option>AL</option>
                <option>AR</option>
                <option>WY</option>
              </select>
              <input
                className='w-1/4 border p-3'
                placeholder='Zip Code'
                value={contactData.zipCode}
                onChange={(e) => handleOnChange('zipCode', e.target.value)}
              />
            </div>
            <select
              className='w-100 border p-3'
              value={contactData.country}
              onChange={(e) => handleOnChange('country', e.target.value)}
            >
              <option defaultValue='State'>Country</option>
              <option>Murca</option>
              <option>Mexico</option>
              <option>Canada</option>
            </select>
            <div className='flex gap-3'>
              <input
                className='w-1/2 border p-3'
                placeholder='Phone'
                value={contactData.phoneNumber}
                onChange={(e) => handleOnChange('phoneNumber', e.target.value)}
              />
              <input
                className='w-1/2 border p-3'
                placeholder='Email'
                value={contactData.email}
                onChange={(e) => handleOnChange('email', e.target.value)}
              />
            </div>
          </div>
          <h2 className='my-4 text-xl font-semibold'>My Notes</h2>
          <textarea
            placeholder='Enter notes about your guests, like food allergies'
            value={contactData.notes}
            onChange={(e) => handleOnChange('notes', e.target.value)}
            className='h-32 w-full border p-3'
            style={{ resize: 'none' }}
          />
        </div>
        {isEditMode ? (
          <EditFormButtons
            events={events}
            householdFormData={householdFormData}
            setHouseholds={setHouseholds}
            setHouseholdFormData={setHouseholdFormData}
          />
        ) : (
          <AddFormButtons
            events={events}
            householdFormData={householdFormData}
            setHouseholds={setHouseholds}
            setHouseholdFormData={setHouseholdFormData}
          />
        )}
      </div>
    </div>
  );
}

type AddFormButtonsProps = {
  events: Event[];
  householdFormData: HouseholdFormData;
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
  setHouseholdFormData: Dispatch<SetStateAction<HouseholdFormData>>;
};

const AddFormButtons = ({
  events,
  householdFormData,
  setHouseholds,
  setHouseholdFormData,
}: AddFormButtonsProps) => {
  const toggleGuestForm = useToggleGuestForm();
  const [closeForm, setCloseForm] = useState<boolean>(false);

  const { mutate: createGuests, isLoading: isCreatingGuests } =
    api.household.create.useMutation({
      onSuccess: (createdHousehold) => {
        console.log('newz', createdHousehold);
        closeForm && toggleGuestForm();
        setHouseholdFormData(defaultHouseholdFormData(events));
        setHouseholds((prevHouseholds: Household[] | undefined) =>
          prevHouseholds
            ? [...prevHouseholds, createdHousehold]
            : [createdHousehold]
        );
      },
      onError: (err) => {
        const errorMessage = err.data?.zodError?.fieldErrors?.guestParty;
        if (errorMessage?.[0])
          window.alert('Please fill in the full name for all guests!');
        else window.alert('Failed to create guests! Please try again later.');
      },
    });

  const handleCreateGuests = () => {
    createGuests({
      ...householdFormData,
      guestParty: householdFormData.guestParty.map((guest) => {
        const inv: string[] = [];
        Object.entries(guest.invites).forEach(([eventId, rsvp]) => {
          if (rsvp === 'Invited') inv.push(eventId);
        });
        return {
          ...guest,
          invites: inv,
        };
      }),
    });
  };

  return (
    <div
      className='fixed bottom-0 flex flex-col gap-3 border-t bg-white px-3 py-5'
      style={{ width: 'inherit' }}
    >
      <div className='flex gap-3 text-sm'>
        <button
          disabled={isCreatingGuests}
          onClick={() => {
            setCloseForm(true);
            handleCreateGuests();
          }}
          className={`w-1/2 ${sharedStyles.secondaryButton({
            py: 'py-2',
            isLoading: isCreatingGuests,
          })}`}
        >
          {isCreatingGuests ? 'Processing...' : 'Save & Close'}
        </button>
        <button
          disabled={isCreatingGuests}
          className={`w-1/2 ${sharedStyles.primaryButton({
            px: 'px-2',
            py: 'py-2',
            isLoading: isCreatingGuests,
          })}`}
          onClick={() => {
            setCloseForm(false);
            handleCreateGuests();
          }}
        >
          {isCreatingGuests ? 'Processing...' : 'Save & Add Another Guest'}
        </button>
      </div>
      <button
        onClick={() => toggleGuestForm()}
        className={`text-sm font-semibold ${
          isCreatingGuests ? 'cursor-not-allowed' : 'hover:underline'
        } ${
          isCreatingGuests
            ? 'text-pink-200'
            : `text-${sharedStyles.primaryColor}`
        }`}
      >
        Cancel
      </button>
    </div>
  );
};

type EditFormButtonsProps = {
  events: Event[];
  householdFormData: HouseholdFormData;
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
  setHouseholdFormData: Dispatch<SetStateAction<HouseholdFormData>>;
};

const EditFormButtons = ({
  events,
  householdFormData,
  setHouseholds,
  setHouseholdFormData,
}: EditFormButtonsProps) => {
  const toggleGuestForm = useToggleGuestForm();

  // const { mutate: deleteHousehold, isLoading: isDeletingHousehold } =
  //   api.household.delete.useMutation({
  //     onSuccess: (createdHousehold) => {
  //       toggleGuestForm();
  //       setHouseholdFormData(defaultHouseholdFormData(events));
  //       setHouseholds((prevHouseholds: Household[] | undefined) =>
  //         prevHouseholds
  //           ? [...prevHouseholds, createdHousehold]
  //           : [createdHousehold]
  //       );
  //     },
  //     onError: (err) => {
  //       const errorMessage = err.data?.zodError?.fieldErrors?.guestParty;
  //       if (errorMessage?.[0])
  //         window.alert('Please fill in the full name for all guests!');
  //       else window.alert('Failed to delete party! Please try again later.');
  //     },
  //   });

  // TODO: create/delete guest in db when user adds/remove a guest while updating a household
  const { mutate: updateHousehold, isLoading: isUpdatingHousehold } =
    api.household.update.useMutation({
      onSuccess: (updatedHousehold) => {
        toggleGuestForm();
        setHouseholdFormData(defaultHouseholdFormData(events));
        setHouseholds((prevHouseholds: Household[] | undefined) => {
          if (!prevHouseholds) return [updatedHousehold];
          const updatedHouseholds = prevHouseholds.slice();
          const oldHousehold = prevHouseholds
            .map((household) => household.id)
            .indexOf(updatedHousehold.id);
          updatedHouseholds.splice(oldHousehold, 1, updatedHousehold);
          return updatedHouseholds;
        });
      },
      onError: (err) => {
        const errorMessage = err.data?.zodError?.fieldErrors?.guestParty;
        if (errorMessage?.[0])
          window.alert('Please fill in the full name for all guests!');
        else window.alert('Failed to update party! Please try again later.');
      },
    });

  return (
    <div
      className='fixed bottom-0 flex flex-col gap-3 border-t bg-white px-3 py-5'
      style={{ width: 'inherit' }}
    >
      <div className='flex gap-3 text-sm'>
        <button
          disabled={isUpdatingHousehold}
          onClick={() => toggleGuestForm()}
          className={`w-1/2 ${sharedStyles.secondaryButton({
            py: 'py-2',
            isLoading: isUpdatingHousehold,
          })}`}
        >
          Cancel
        </button>
        <button
          disabled={isUpdatingHousehold}
          className={`w-1/2 ${sharedStyles.primaryButton({
            px: 'px-2',
            py: 'py-2',
            isLoading: isUpdatingHousehold,
          })}`}
          onClick={() => updateHousehold(householdFormData)}
        >
          {isUpdatingHousehold ? 'Processing...' : 'Save'}
        </button>
      </div>
      <button
        onClick={() => {
          // deleteHousehold();
        }}
        className={`text-sm font-bold ${
          isUpdatingHousehold ? 'cursor-not-allowed' : 'hover:underline'
        } ${
          isUpdatingHousehold
            ? 'text-pink-200'
            : `text-${sharedStyles.primaryColor}`
        }`}
      >
        {isUpdatingHousehold ? 'Processing...' : 'Delete Party'}
      </button>
    </div>
  );
};
