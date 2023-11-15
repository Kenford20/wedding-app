const desktopPaddingSides = 'px-56';
const verticalDivider = 'px-3 text-neutral-300';
const primaryColor = 'pink-400';
const primaryColorHex = '#f472b6';

type ButtonOptions = {
  px: string;
  py: string;
};

const primaryButton = (options: ButtonOptions = { px: 'px-12', py: 'py-3' }) =>
  `rounded-full bg-pink-400 ${options.px} ${options.py} font-semibold text-white hover:bg-[#d700a0]`;

const secondaryButton = (
  options: ButtonOptions = { px: 'px-12', py: 'py-3' }
) =>
  `rounded-full border border-pink-400 ${options.px} ${options.py} font-semibold text-pink-400 hover:bg-pink-100`;

export const sharedStyles = {
  desktopPaddingSides,
  verticalDivider,
  primaryColor,
  primaryColorHex,
  primaryButton,
  secondaryButton,
};
