const desktopPaddingSides = 'px-16';

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
  primaryButton,
  secondaryButton,
  desktopPaddingSides,
};
