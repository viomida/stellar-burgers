import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector((state) => state.user.error);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (!email || !password) return;

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};