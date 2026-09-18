import { useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/ordersSlice';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-medium">
        Не удалось загрузить историю: {error}
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};