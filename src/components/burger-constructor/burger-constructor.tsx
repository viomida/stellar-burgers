import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  createOrder,
  clearOrderModal,
} from '../../services/slices/ordersSlice';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();

  const constructorItems = useSelector((state) => state.burgerConstructor);
  const { orderRequest, orderModalData } = useSelector((state) => state.orders);

  const bun = constructorItems?.bun ?? null;
  const ingredients = constructorItems?.ingredients ?? [];

  const onOrderClick = (): void => {
    if (!bun || orderRequest) return;

    // Собираем массив ID ингредиентов: булка + начинки + булка
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id,
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};