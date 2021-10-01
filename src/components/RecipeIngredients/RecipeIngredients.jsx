/* eslint no-eval: 0 */
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { recipeState } from '../../contexts/atoms/atoms';

export default function RecipeIngredients() {
  const recipe = useRecoilValue(recipeState);
  const [selectedScale, setSelectedScale] = useState(1);
  const [listRecipe, setListRecipe] = useState({
    ingredients: [],
  });
  const scaleOptions = [
    { name: '1/4', value: 0.25 },
    { name: '1/3', value: 0.3333 },
    { name: '1/2', value: 0.5 },
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
  ];

  const scaleRecipe = (scaleValue) => {
    const ev = eval;
    setSelectedScale(scaleValue);
    const tempRecipe = JSON.parse(JSON.stringify(recipe));
    tempRecipe.ingredients.forEach((ingredientGroup) => {
      if (ingredientGroup.ingredients.length > 0) {
        ingredientGroup.ingredients.forEach((ingredient) => {
          if (ingredient.quantity) {
            const asNumber = ev(ingredient.quantity);
            if (!Number.isNaN(asNumber)) {
              let newQuantity = scaleValue * asNumber;
              if (newQuantity % 1 !== 0) {
                newQuantity = Number.parseFloat(newQuantity).toFixed(2);
              }
              ingredient.quantity = newQuantity;
            }
          }
        });
      }
    });
    setListRecipe(tempRecipe);
  };

  useEffect(() => {
    setListRecipe(recipe);
  }, []);

  return (
    <div className="my-5 pl-3 lg:pl-0">
      <div className="mt-5 mb-1 text-xs font-bold">SCALE</div>
      <div className="flex justify-between text-xs">
        {scaleOptions.map((me) => (
          <button
            key={me.name}
            type="button"
            className={selectedScale === me.value ? 'text-black font-bold' : 'text-blue-600'}
            onClick={() => scaleRecipe(me.value)}
          >
            {me.name}
          </button>
        ))}
      </div>
      <div className="mt-5 mb-2 text-2xl">INGREDIENTS</div>
      {listRecipe.ingredients.map((item) => (
        <div key={item.index}>
          {item.ingredients.length > 0 && (
            <div className="text-1xl font-bold capitalize">{item.groupName}</div>
          )}
          {item.ingredients.map((ingredient) => (
            <div className="mb-2" key={ingredient.index}>
              {ingredient.quantity && <span className="mr-2 font-bold">{ingredient.quantity}</span>}
              <span>{ingredient.string}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
