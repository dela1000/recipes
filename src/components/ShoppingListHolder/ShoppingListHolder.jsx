import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import {
  dbState,
  currentUserState,
  loadingOverlayState,
  recipeIdState,
  recipeState,
  onShoppingListState,
  numberOfItemsOnShoppingListState,
  allRecipesState,
} from '../../contexts/atoms/atoms';
import ShoppingListByRecipe from '../ShoppingListByRecipe';
import ShoppingListByGroup from '../ShoppingListByGroup';
import { updateRecipe, getRecipeById } from '../../adapters/recipeAdapters';
import addItemsToShoppingListTotal from '../../contexts/addItemsToShoppingListTotal';

export default function ShoppingListHolder({ getShoppingListRecipes }) {
  const [viewByRecipe, setViewByRecipe] = useState(false);
  const [recipesOnShoppingList, setRecipesOnShoppingList] = useRecoilState(onShoppingListState);
  const [allRecipes, setAllRecipes] = useRecoilState(allRecipesState);
  const history = useHistory();
  const [recipesNames, setRecipesNames] = useState([]);
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingOverlayState);
  const setRecipeId = useSetRecoilState(recipeIdState);
  const setRecipe = useSetRecoilState(recipeState);
  const setNumberOfItemsOnShoppingList = useSetRecoilState(numberOfItemsOnShoppingListState);

  const defineRecipeNames = () => {
    const recipesNamesTemp = [];
    const sortedArr = recipesOnShoppingList.reduce((acc, element) => {
      if (element.manualList) {
        return [element, ...acc];
      }
      return [...acc, element];
    }, []);
    sortedArr.forEach((recipe) => {
      recipesNamesTemp.push({ recipeTitle: recipe.title, id: recipe.id });
    });
    setRecipesNames([...recipesNamesTemp]);
  };

  const updateNumberOfItemsOnShoppingList = (dataToUpdate) => {
    if (dataToUpdate.length > 0) {
      const inShoppingList = [];
      dataToUpdate.forEach((doc) => {
        const item = JSON.parse(JSON.stringify(doc));
        inShoppingList.push(item);
      });
      const itemsOnShoppingList = addItemsToShoppingListTotal(inShoppingList);
      return setNumberOfItemsOnShoppingList(itemsOnShoppingList);
    }
    return setNumberOfItemsOnShoppingList(0);
  };

  const removeFromShoppingList = async (data) => {
    setLoading(true);
    const recipeFoundIndex = recipesOnShoppingList.findIndex((element) => element.id === data.id);
    const parsedRecipeFound = JSON.parse(JSON.stringify(recipesOnShoppingList[recipeFoundIndex]));
    if (parsedRecipeFound.manualList) {
      parsedRecipeFound.ingredients[0].ingredients = [];
    } else {
      parsedRecipeFound.ingredients.forEach((ingredientsGroup) => {
        ingredientsGroup.ingredients.forEach((ingredient) => {
          ingredient.purchased = false;
        });
      });
    }

    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: data.id,
      payload: {
        ingredients: parsedRecipeFound.ingredients,
        onShoppingList: false,
      },
    });
    // Remove from recipesOnShoppingList
    const parsedRecipesList = JSON.parse(JSON.stringify(recipesOnShoppingList));
    parsedRecipesList.splice(recipeFoundIndex, 1);
    await setRecipesOnShoppingList(parsedRecipesList);
    updateNumberOfItemsOnShoppingList(parsedRecipesList);
    // update in allRecipes
    const recipeFoundInAllRecipesIndex = allRecipes.findIndex((element) => element.id === data.id);
    const parsedAllRecipes = JSON.parse(JSON.stringify(allRecipes));
    parsedAllRecipes[recipeFoundInAllRecipesIndex] = updatedRecipe;
    setAllRecipes(parsedAllRecipes);
    setLoading(false);
  };

  const goToRecipe = async (data) => {
    setLoading(true);
    const recipeById = await getRecipeById({
      db,
      currentUserId: currentUser.uid,
      payload: { id: data.id },
    });
    setLoading(false);
    setRecipe(recipeById);
    setRecipeId(recipeById.id);
    history.push(`/recipe`);
  };

  const handleChangeView = () => {
    setViewByRecipe(!viewByRecipe);
  };

  useEffect(() => {
    defineRecipeNames();
  }, [recipesOnShoppingList]);

  return (
    <div className="mx-3">
      <div className="lg:flex flex-row">
        <div className="lg:w-3/12 pr-10">
          <div className="my-3">
            <button type="button" onClick={handleChangeView}>
              <div className="italic font-bold">
                {viewByRecipe ? 'View By Group' : 'View by Recipe'}
              </div>
            </button>
          </div>
          <div className="text-2xl mb-2 capitalize italic">Recipes in Shopping List</div>
          {recipesNames.length > 0 && (
            <div className="flex-grow">
              {recipesNames.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="flex justify-between center-align hover:bg-gray-200 w-full m-h-10 p-2"
                >
                  <button
                    type="button"
                    className="w-10/12 my-1 ml-1 text-left"
                    onClick={() => goToRecipe({ id: rec.id })}
                  >
                    {rec.recipeTitle}
                  </button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CloseIcon
                        type="button"
                        className="w-1/12 cursor-pointer mr-5"
                        onClick={() => removeFromShoppingList({ id: rec.id, idx })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:w-9/12 mt-8 lg:mt-0 px-3 lg:px-0">
          <div className="bg-gray-300 h-px lg:w-0 w-full mb-8 lg:mb-2" />
          {viewByRecipe && (
            <div>
              {recipesOnShoppingList.map((recipe) => (
                <ShoppingListByRecipe
                  key={recipe.id}
                  recipeId={recipe.id}
                  recipeData={recipe}
                  getShoppingListRecipes={getShoppingListRecipes}
                />
              ))}
            </div>
          )}
          {!viewByRecipe && (
            <div>
              <ShoppingListByGroup
                recipesOnShoppingList={recipesOnShoppingList}
                getShoppingListRecipes={getShoppingListRecipes}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ShoppingListHolder.propTypes = {
  getShoppingListRecipes: PropTypes.func.isRequired,
};
