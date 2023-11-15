import { type AppType } from 'next/app';
import { api } from '~/utils/api';
import '~/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { EventFormProvider } from '~/contexts/event-form-context';
import { GuestFormProvider } from '~/contexts/guest-form-context';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <EventFormProvider>
        <GuestFormProvider>
          <Component {...pageProps} />
        </GuestFormProvider>
      </EventFormProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
