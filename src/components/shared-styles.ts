const desktopPaddingSides = 'px-16';
const verticalDivider = 'px-3 text-neutral-300';
const primaryColor = 'pink-400';
const primaryColorHex = '#f472b6';

type ButtonOptions = {
  px: string;
  py: string;
};

const primaryButton = (options: ButtonOptions = { px: 'px-12', py: 'py-3' }) =>
  `rounded-full bg-${primaryColor} ${options.px} ${options.py} font-semibold text-white hover:bg-[#d700a0]`;

const secondaryButton = (
  options: ButtonOptions = { px: 'px-12', py: 'py-3' }
) =>
  `rounded-full border border-${primaryColor} ${options.px} ${options.py} font-semibold text-${primaryColor} hover:bg-pink-100`;

export const sharedStyles = {
  desktopPaddingSides,
  verticalDivider,
  primaryColor,
  primaryColorHex,
  primaryButton,
  secondaryButton,
};
