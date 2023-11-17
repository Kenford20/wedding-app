import { useEffect } from 'react';

const useDisablePageScroll = () => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, []);
};

export { useDisablePageScroll };
