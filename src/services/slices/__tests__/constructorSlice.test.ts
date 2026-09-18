import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../constructorSlice';
import type { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
  _id: 'bun-1',
  id: 'id-bun-1',
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
};

const mockFilling: TConstructorIngredient = {
  ...mockBun,
  _id: 'main-1',
  id: 'id-main-1',
  name: 'Начинка',
  type: 'main',
};

describe('constructorSlice', () => {
  test('возвращает initial state при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('addIngredient — добавляет булку', () => {
    const result = constructorReducer(undefined, addIngredient(mockBun));
    expect(result.bun).toEqual(mockBun);
    expect(result.ingredients).toEqual([]);
  });

  test('addIngredient — добавляет начинку', () => {
    const result = constructorReducer(undefined, addIngredient(mockFilling));
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([mockFilling]);
  });

  test('removeIngredient — удаляет ингредиент по id', () => {
    const initialState = {
      bun: null,
      ingredients: [mockFilling],
    };
    const result = constructorReducer(
      initialState,
      removeIngredient('id-main-1')
    );
    expect(result.ingredients).toEqual([]);
  });

  test('moveIngredient — перемещает ингредиент', () => {
    const first = { ...mockFilling, id: 'id-1', name: 'Первый' };
    const second = { ...mockFilling, id: 'id-2', name: 'Второй' };
    const initialState = {
      bun: null,
      ingredients: [first, second],
    };
    const result = constructorReducer(
      initialState,
      moveIngredient({ from: 0, to: 1 })
    );
    expect(result.ingredients).toEqual([second, first]);
  });

  test('clearConstructor — очищает конструктор', () => {
    const initialState = {
      bun: mockBun,
      ingredients: [mockFilling],
    };
    const result = constructorReducer(initialState, clearConstructor());
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });
});