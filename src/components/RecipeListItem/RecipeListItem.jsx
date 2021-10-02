import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {
  // useRecoilValue,
  useSetRecoilState,
  // useRecoilState,
} from 'recoil';
import {
  // dbState,
  // currentUserState,
  recipeState,
  // numberOfItemsOnShoppingListState,
} from '../../contexts/atoms/atoms';
// import IconButton from '../IconButton';
// import { updateRecipe } from '../../adapters/recipeAdapters';

export default function RecipeListItem({
  recipe,
  // handleCategoryChange,
  // updateSingleRecipe
}) {
  // const db = useRecoilValue(dbState);
  // const currentUser = useRecoilValue(currentUserState);
  const setRecipe = useSetRecoilState(recipeState);
  // const [numberOfItemsOnShoppingList, setNumberOfItemsOnShoppingList] = useRecoilState(
  //   numberOfItemsOnShoppingListState,
  // );

  const history = useHistory();

  const navigate = () => {
    history.push('/recipe');
  };

  const selectRecipe = () => {
    setRecipe(recipe);
    navigate();
  };

  // const handleFavoriteSelected = async () => {
  //   setUpdatingFavorite(true);
  //   const updatedRecipe = await updateRecipe({
  //     db,
  //     currentUserId: currentUser.uid,
  //     recipeId: listRecipe.id,
  //     payload: {
  //       favorite: !listRecipe.favorite,
  //     },
  //   });
  //   setUpdatingFavorite(false);
  //   // setListRecipe(updatedRecipe);
  //   // updateSingleRecipe(listRecipe.id);
  // };

  // const handleAddToShoppingList = async () => {
  //   setUpdatingShopping(true);

  //   const dataToUpdate = {
  //     onShoppingList: !listRecipe.onShoppingList,
  //   };

  //   let itemsToRemove = 0;
  //   listRecipe.ingredients.forEach((ingredientsGroup) => {
  //     itemsToRemove += ingredientsGroup.ingredients.length;
  //     ingredientsGroup.ingredients.forEach((ingredient) => {
  //       ingredient.purchased = false;
  //     });
  //   });

  //   dataToUpdate.ingredients = listRecipe.ingredients;

  //   const updatedRecipe = await updateRecipe({
  //     db,
  //     currentUserId: currentUser.uid,
  //     recipeId: listRecipe.id,
  //     payload: dataToUpdate,
  //   });

  //   if (dataToUpdate.onShoppingList) {
  //     setNumberOfItemsOnShoppingList(numberOfItemsOnShoppingList + itemsToRemove);
  //   } else {
  //     setNumberOfItemsOnShoppingList(numberOfItemsOnShoppingList - itemsToRemove);
  //   }
  //   setUpdatingShopping(false);
  //   // setListRecipe(updatedRecipe);
  //   // updateSingleRecipe(listRecipe.id);
  // };

  return (
    <div key={recipe.id}>
      <hr />
      <div className="flex">
        {/* <div className="mt-3 mx-1">
          <div className="lg:flex flex-col">
            <div className="mb-1">
              <IconButton
                type="favorite"
                itemToUpdate={recipe.favorite}
                updating={updatingFavorite}
                handleFunction={handleFavoriteSelected}
              />
            </div>
            <div>
              <IconButton
                type="onShoppingList"
                itemToUpdate={recipe.onShoppingList}
                updating={updatingShopping}
                handleFunction={handleAddToShoppingList}
              />
            </div>
          </div>
        </div> */}
        <div className="flex-initial mt-3 mr-3">
          <button type="button" onClick={selectRecipe} className="w-32 h-32">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt="food"
                className="object-cover min-h-full min-w-full w-32 h-32"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200" />
            )}
          </button>
        </div>
        <div className="flex-initial mt-6">
          <div>
            <div>
              <a
                className="text-xs text-blue-400"
                href={recipe.originalURL}
                target="_blank"
                rel="noreferrer"
              >
                {recipe.source}
              </a>
            </div>
          </div>
          <div className="flex">
            <div className="flex-initial">
              <button
                className="capitalize text-xl italic text-left"
                type="button"
                onClick={selectRecipe}
              >
                {recipe.title}
              </button>
            </div>
          </div>
          <div>
            {/* <div className="pt-1">
              {recipe.categories.length > 0 && (
                <div className="text-xs flex">
                  {recipe.categories.map((category, idx) => (
                    <button
                      type="button"
                      key={category}
                      className="capitalize mr-1"
                      onClick={() => handleCategoryChange({ target: { value: category } })}
                    >
                      {category}
                      {idx + 1 < recipe.categories.length ? ',' : null}
                    </button>
                  ))}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

RecipeListItem.propTypes = {
  recipe: PropTypes.shape({
    image: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    favorite: PropTypes.bool,
    originalURL: PropTypes.string,
    source: PropTypes.string,
    onShoppingList: PropTypes.bool,
    ingredients: PropTypes.arrayOf(PropTypes.shape({})),
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  // handleCategoryChange: PropTypes.func.isRequired,
  // updateSingleRecipe: PropTypes.func.isRequired,
};
