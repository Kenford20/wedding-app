import { sharedStyles } from '../shared-styles';

import { useState, type Dispatch, type SetStateAction } from 'react';
import { type Household } from '~/types/schema';

type GuestSearchFilterProps = {
  households: Household[];
  setFilteredHouseholds: Dispatch<SetStateAction<Household[]>>;
};

export default function GuestSearchFilter({
  households,
  setFilteredHouseholds,
}: GuestSearchFilterProps) {
  const [searchInput, setSearchInput] = useState('');
  const handleOnChange = (searchText: string) => {
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

  return (
    <div className='flex'>
      <div>
        <input
          className='w-64 border-2 px-3 py-2'
          placeholder='Find Guests'
          value={searchInput}
          onChange={(e) => handleOnChange(e.target.value)}
        ></input>
        <button className={`h-11 w-24 bg-${sharedStyles.primaryColor}`}>
          <i className='text-white'>Search</i>
        </button>
      </div>
      <div className='pl-7'>
        <select
          className='h-11 w-36 border px-2 py-2'
          name='guestsFilter'
          id='guestsFilter'
        >
          <option defaultValue='Filter By'>Filter By</option>
          <option value='invited'>Invited</option>
          <option value='attending'>Attending</option>
          <option value='Declined'>Declined</option>
        </select>
      </div>
    </div>
  );
}
