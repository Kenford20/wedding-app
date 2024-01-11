import { type Dispatch, type SetStateAction, useState } from 'react';
import { sharedStyles } from '~/components/shared-styles';

type PasswordPageProps = {
  password: string;
  setSubmittedPassword: Dispatch<SetStateAction<string>>;
};

export default function PasswordPage({
  password,
  setSubmittedPassword,
}: PasswordPageProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [showError, setShowError] = useState(false);

  const verifyPassword = () => {
    if (password === passwordInput) {
      setSubmittedPassword(passwordInput);
      sessionStorage.setItem('wws_password', passwordInput);
    } else {
      setShowError(true);
    }
  };

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='text-center'>
        <h1 className='mb-5 text-2xl'>Enter password to view this site</h1>
        <div className='flex gap-5'>
          <input
            type='password'
            value={passwordInput}
            placeholder='Password'
            className='rounded-full border-2 px-5 py-3'
            onChange={(e) => {
              setShowError(false);
              setPasswordInput(e.target.value);
            }}
          />
          <button
            className={`${sharedStyles.primaryButton()}`}
            onClick={() => verifyPassword()}
          >
            SUBMIT
          </button>
        </div>
        {showError && <p className='mt-5'>Incorrect Password</p>}
      </div>
    </div>
  );
}
