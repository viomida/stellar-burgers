import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleAdd = (): void => {
    dispatch(addIngredient({ ...ingredient, id: nanoid() }));  
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});