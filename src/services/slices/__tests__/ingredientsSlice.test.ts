import { ingredientsReducer, fetchIngredients } from '../ingredientsSlice';
import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png',
  },
];

describe('ingredientsSlice', () => {
  test('возвращает initial state при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(undefined, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const result = ingredientsReducer(undefined, action);
    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка' },
    };
    const result = ingredientsReducer(undefined, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка');
  });
});