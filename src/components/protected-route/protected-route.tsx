import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  if (!isAuthChecked) {
    return <div />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && onlyUnAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};