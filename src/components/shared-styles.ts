const desktopPaddingSides = 'px-48';
const verticalDivider = 'px-3 text-neutral-300';
const primaryColor = 'pink-400';
const primaryColorHex = '#f472b6';

type ButtonOptions = {
  px?: string;
  py?: string;
  isLoading?: boolean;
};

const primaryButton = (options: ButtonOptions) => {
  options = { px: 'px-12', py: 'py-3', isLoading: false, ...options };
  const { px, py, isLoading } = options;
  const hover = isLoading ? '' : 'hover:bg-[#d700a0]';
  const bg = isLoading ? 'bg-pink-200' : 'bg-pink-400';
  const cursor = isLoading ? 'cursor-not-allowed' : '';

  return `rounded-full font-semibold text-white ${px} ${py} ${hover} ${bg} ${cursor}`;
};

const secondaryButton = (options: ButtonOptions) => {
  options = { px: 'px-12', py: 'py-3', isLoading: false, ...options };
  const { px, py, isLoading } = options;
  const hover = isLoading ? '' : 'hover:bg-pink-100';
  const cursor = isLoading ? 'cursor-not-allowed' : '';
  const border = isLoading ? 'border-pink-200' : 'border-pink-400';

  return `rounded-full border font-semibold text-pink-400 ${px} ${py} ${hover} ${cursor} ${border}`;
};

export const sharedStyles = {
  desktopPaddingSides,
  verticalDivider,
  primaryColor,
  primaryColorHex,
  primaryButton,
  secondaryButton,
};
