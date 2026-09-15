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

  // Пока не проверили авторизацию — ничего не рендерим
  if (!isAuthChecked) {
    return <div />;
  }

  // Защищённый маршрут, но не авторизован
  if (!user && !onlyUnAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Только для неавторизованных, но уже авторизован
  if (user && onlyUnAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};