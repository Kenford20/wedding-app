type GuestSearchFilterProps = object;

export default function GuestSearchFilter({}: GuestSearchFilterProps) {
  return (
    <div className='flex'>
      <div>
        <input
          className='w-64 border-2 px-3 py-2'
          placeholder='Find Guests'
        ></input>
        <button className='h-11 w-24 bg-pink-500'>
          <i className='text-white'>Search</i>
        </button>
      </div>
      <div className='pl-7'>
        <select
          className='h-11 w-36 border-2 px-2 py-2'
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
