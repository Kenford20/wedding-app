import { sharedStyles } from '../shared-styles';
import { BiCollapseVertical } from 'react-icons/bi';
import { HiOutlineArrowsUpDown } from 'react-icons/hi2';

export default function DashboardControls() {
  return (
    <div className='flex items-center'>
      <div className='flex cursor-pointer'>
        <HiOutlineArrowsUpDown size={21} color={sharedStyles.primaryColorHex} />
        <button className={`text-${sharedStyles.primaryColor} mx-2`}>
          Reorder
        </button>
      </div>
      <div className='flex cursor-pointer'>
        <BiCollapseVertical size={21} color={sharedStyles.primaryColorHex} />
        <button className={`text-${sharedStyles.primaryColor}`}>
          Collapse All
        </button>
      </div>
    </div>
  );
}
