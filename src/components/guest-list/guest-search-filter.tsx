import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { sharedStyles } from '../shared-styles';
import { IoIosArrowDown, IoMdCheckmark } from 'react-icons/io';
import { useOuterClick } from '../helpers';

import { type Event, type Household } from '~/types/schema';

type TSelectedOption = {
  eventId: string;
  rsvpValue: string;
};

type GuestSearchFilterProps = {
  households: Household[];
  setFilteredHouseholds: Dispatch<SetStateAction<Household[]>>;
  events: Event[];
  selectedEventId: string;
};

export default function GuestSearchFilter({
  households,
  setFilteredHouseholds,
  events,
  selectedEventId,
}: GuestSearchFilterProps) {
  const [searchInput, setSearchInput] = useState('');
  const [showInvitationDropdown, setShowInvitationDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TSelectedOption | null>(
    null
  );
  const invitationFilterRef = useOuterClick(() =>
    setShowInvitationDropdown(false)
  );

  useEffect(() => {
    setSelectedOption(null);
  }, [selectedEventId]);

  const eventsToMap =
    selectedEventId === 'all'
      ? events
      : [events.find((event) => event.id === selectedEventId)];

  const filterHouseholdsBySearch = (searchText: string) => {
    setSearchInput(searchText);
    setFilteredHouseholds(() =>
      households.filter((household) =>
        household.guests.some(
          (guest) =>
            guest.firstName.includes(searchText) ||
            guest.lastName.includes(searchText)
        )
      )
    );
  };

  const filterHouseholdsByInvitation = ({
    eventId,
    rsvpValue,
  }: TSelectedOption) => {
    setShowInvitationDropdown(false);
    setSelectedOption({ eventId, rsvpValue });
    setFilteredHouseholds(() =>
      households.filter((household) =>
        household.guests.some((guest) =>
          guest.invitations?.some(
            (inv) => inv.eventId === eventId && inv.rsvp === rsvpValue
          )
        )
      )
    );
  };

  return (
    <div className='flex'>
      <div>
        <input
          className='h-12 w-64 border-2 px-3 py-2'
          placeholder='Find Guests'
          value={searchInput}
          onChange={(e) => filterHouseholdsBySearch(e.target.value)}
        ></input>
        <button className={`h-12 w-24 bg-${sharedStyles.primaryColor}`}>
          <i className='text-white'>Search</i>
        </button>
      </div>

      <div className='pl-7' ref={invitationFilterRef}>
        <div className='relative h-12 w-48 border'>
          <div
            onClick={() => setShowInvitationDropdown((prev) => !prev)}
            className='flex cursor-pointer items-center justify-between p-3'
          >
            {selectedOption === null ? (
              <span>Filter By</span>
            ) : (
              <div className='flex items-center gap-1.5'>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${sharedStyles.getRSVPcolor(
                    selectedOption.rsvpValue
                  )}`}
                />
                <p>{selectedOption.rsvpValue}</p>
              </div>
            )}
            <IoIosArrowDown size={20} />
          </div>
          {showInvitationDropdown && (
            <div className='absolute left-0 top-11 z-10 h-52 w-48 overflow-auto border bg-white p-3'>
              {eventsToMap?.map(
                (event) =>
                  event && (
                    <div
                      key={event.id}
                      className='mb-4 flex flex-col border-b pb-2 font-light'
                    >
                      <h5 className='mb-2 text-xs font-medium'>
                        {event.name.toUpperCase()}
                      </h5>
                      {['Not Invited', 'Invited', 'Attending', 'Declined'].map(
                        (rsvp) => (
                          <InvitationOption
                            key={rsvp}
                            rsvpValue={rsvp}
                            eventId={event.id}
                            filterHouseholdsByInvitation={
                              filterHouseholdsByInvitation
                            }
                            setSelectedOption={setSelectedOption}
                            isSelected={
                              event.id === selectedOption?.eventId &&
                              rsvp === selectedOption?.rsvpValue
                            }
                          />
                        )
                      )}
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type InvitationOptionProps = {
  rsvpValue: string;
  eventId: string;
  setSelectedOption: Dispatch<SetStateAction<TSelectedOption | null>>;
  filterHouseholdsByInvitation: ({}: TSelectedOption) => void;
  isSelected: boolean;
};

const InvitationOption = ({
  rsvpValue,
  eventId,
  setSelectedOption,
  filterHouseholdsByInvitation,
  isSelected,
}: InvitationOptionProps) => {
  const handleChangeOption = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    setSelectedOption({ eventId, rsvpValue: target.innerText });
    filterHouseholdsByInvitation({ eventId, rsvpValue: target.innerText });
  };

  return (
    <div
      className='text-md flex cursor-pointer items-center justify-between p-1 pl-3 hover:bg-gray-100'
      onClick={(e) => handleChangeOption(e)}
    >
      <div className='flex items-center gap-1.5'>
        <span
          className={`h-1.5 w-1.5 rounded-full ${sharedStyles.getRSVPcolor(
            rsvpValue
          )}`}
        />
        <p>{rsvpValue}</p>
      </div>
      {isSelected && <IoMdCheckmark size={20} />}
    </div>
  );
};
