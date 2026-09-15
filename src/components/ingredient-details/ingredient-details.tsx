import { useParams } from 'react-router-dom';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  // ✅ Берём ингредиент из store по id
  const ingredientData = useSelector((state) =>
    state.ingredients.ingredients.find((item) => item._id === id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};