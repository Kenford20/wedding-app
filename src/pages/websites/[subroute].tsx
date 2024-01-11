import { useEffect, useState } from 'react';
import { LoadingPage } from '~/components/loader';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import PasswordPage from './password-page';
import WeddingWebsite from './wedding';

export default function SubrouteHandler() {
  const router = useRouter();
  const [submittedPassword, setSubmittedPassword] = useState('');
  useEffect(() => {
    setSubmittedPassword(
      sessionStorage.getItem('wws_password') ?? submittedPassword ?? ''
    );
  }, [submittedPassword]);

  const { data: website, isLoading } = api.website.getByUrl.useQuery({
    websiteUrl: router.query.subroute as string,
  });

  if (isLoading) return <LoadingPage />;

  console.log('web', website);

  return !website?.isPasswordEnabled ||
    submittedPassword === website?.password ? (
    <WeddingWebsite />
  ) : (
    <PasswordPage
      password={website.password!}
      setSubmittedPassword={setSubmittedPassword}
    />
  );
}
