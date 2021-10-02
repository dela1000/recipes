import { useHistory } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import {
  currentUserState,
  dbState,
  recipeState,
  recipeIdState,
  allRecipesState,
  alertModalState,
  loadingOverlayState,
  updatingFavoriteState,
  updatingShoppingState,
  numberOfItemsOnShoppingListState,
} from '../../contexts/atoms/atoms';
import IconButton from '../IconButton';
import TextButton from '../TextButton';
import addItemsToShoppingListTotal from '../../contexts/addItemsToShoppingListTotal';
import AlertModal from '../AlertModal';
import { updateRecipe } from '../../adapters/recipeAdapters';

export default function RecipeOptions() {
  const history = useHistory();
  const [updatingFavorite, setUpdatingFavorite] = useRecoilState(updatingFavoriteState);
  const [updatingShopping, setUpdatingShopping] = useRecoilState(updatingShoppingState);

  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const setRecipeId = useSetRecoilState(recipeIdState);
  const setNumberOfItemsOnShoppingList = useSetRecoilState(numberOfItemsOnShoppingListState);
  const [recipe, setRecipe] = useRecoilState(recipeState);
  const [allRecipes, setAllRecipes] = useRecoilState(allRecipesState);
  const setAlertModal = useSetRecoilState(alertModalState);
  const setLoading = useSetRecoilState(loadingOverlayState);

  const editRecipe = (recipeToUpdate) => {
    setRecipe(recipeToUpdate);
    setRecipeId(recipeToUpdate.id);
    history.push(`/editrecipe`);
  };

  const determineOnShoppingList = (recipesToSee) => {
    const itemsOnShoppingList = addItemsToShoppingListTotal(recipesToSee);
    setNumberOfItemsOnShoppingList(itemsOnShoppingList);
  };

  const updateAllRecipesData = (updatedRecipe) => {
    const recipeIndex = allRecipes.findIndex((savedRecipe) => savedRecipe.id === recipe.id);
    const newRecipesArray = [...allRecipes];
    newRecipesArray[recipeIndex] = updatedRecipe;
    setRecipe(updatedRecipe);
    setRecipeId(updatedRecipe.id);
    setAllRecipes([...newRecipesArray]);
    determineOnShoppingList(newRecipesArray);
  };

  const handleUpdateRecipe = async (updateType) => {
    const parsedRecipe = JSON.parse(JSON.stringify(recipe));
    let dataToUpdate = {};
    if (updateType === 'favorite') {
      setUpdatingFavorite(true);
      dataToUpdate = {
        favorite: !parsedRecipe.favorite,
      };
    }
    if (updateType === 'shopping') {
      setUpdatingShopping(true);
      dataToUpdate = {
        onShoppingList: !parsedRecipe.onShoppingList,
      };

      if (parsedRecipe.onShoppingList) {
        parsedRecipe.ingredients.forEach((ingredientsGroup) => {
          ingredientsGroup.ingredients.forEach((ingredient) => {
            ingredient.purchased = false;
          });
        });
      }
      dataToUpdate.ingredients = parsedRecipe.ingredients;
    }
    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: parsedRecipe.id,
      payload: dataToUpdate,
    });
    setUpdatingFavorite(false);
    setUpdatingShopping(false);
    updateAllRecipesData(updatedRecipe);
  };

  const deleteRecipe = async () => {
    setLoading(true);
    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: recipe.id,
      payload: {
        deleted: true,
      },
    });
    updateAllRecipesData(updatedRecipe);
    setLoading(false);
    setAlertModal(false);
    history.push(`/`);
  };

  const handleDeleteRecipe = () => {
    setAlertModal(true);
  };

  return (
    <div className="flex pt-3">
      <AlertModal handleFunction={deleteRecipe} />
      <IconButton
        type="favorite"
        itemToUpdate={recipe.favorite}
        updating={updatingFavorite}
        handleFunction={() => handleUpdateRecipe('favorite')}
      />
      <IconButton
        type="onShoppingList"
        itemToUpdate={recipe.onShoppingList}
        updating={updatingShopping}
        handleFunction={() => handleUpdateRecipe('shopping')}
      />
      <TextButton text="edit recipe" handleFunction={() => editRecipe(recipe)} />
      <TextButton text="delete recipe" handleFunction={() => handleDeleteRecipe()} />
    </div>
  );
}
