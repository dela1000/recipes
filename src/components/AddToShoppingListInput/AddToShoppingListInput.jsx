import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import {
  dbState,
  currentUserState,
  allRecipesState,
  onShoppingListState,
  loadingOverlayState,
  numberOfItemsOnShoppingListState,
} from '../../contexts/atoms/atoms';
import { addRecipe, updateRecipe } from '../../adapters/recipeAdapters';
import addItemsToShoppingListTotal from '../../contexts/addItemsToShoppingListTotal';

export default function AddToShoppingListInput() {
  const [filterText, setFilterText] = useState('');
  const setLoading = useSetRecoilState(loadingOverlayState);
  const [allRecipes, setAllRecipes] = useRecoilState(allRecipesState);
  const [recipesOnShoppingList, setRecipesOnShoppingList] = useRecoilState(onShoppingListState);
  const setNumberOfItemsOnShoppingList = useSetRecoilState(numberOfItemsOnShoppingListState);
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const handleItemInput = (event) => {
    setFilterText(event.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      let docRef;
      const manualListFound = allRecipes.filter((recipe) => recipe.manualList === true);
      const newItem = {
        purchased: false,
        string: filterText,
      };
      const parsedAllRecipes = JSON.parse(JSON.stringify(allRecipes));
      const newRecipesOnShoppingList = JSON.parse(JSON.stringify(recipesOnShoppingList));

      if (!manualListFound[0]) {
        newItem.index = 0;
        const manualRecipeObj = {
          title: 'Manual Items',
          ingredients: [
            {
              index: 0,
              ingredients: [newItem],
              groupName: 'standard',
            },
          ],
          onShoppingList: true,
          deleted: false,
          manualList: true,
          categories: [],
        };
        docRef = await addRecipe({
          db,
          currentUserId: currentUser.uid,
          payload: manualRecipeObj,
        });
        newRecipesOnShoppingList.push(docRef);
        parsedAllRecipes.push(docRef);
      } else {
        const newManualList = JSON.parse(JSON.stringify(manualListFound));
        newItem.index = newManualList[0].ingredients[0].ingredients.length;
        newManualList[0].ingredients[0].ingredients.push(newItem);
        docRef = await updateRecipe({
          db,
          currentUserId: currentUser.uid,
          recipeId: newManualList[0].id,
          payload: newManualList[0],
        });
        const foundIndex = newRecipesOnShoppingList.findIndex((x) => x.id === docRef.id);
        [newRecipesOnShoppingList[foundIndex]] = [newManualList[0]];
        const foundAllIndex = parsedAllRecipes.findIndex((x) => x.id === docRef.id);
        [parsedAllRecipes[foundAllIndex]] = [newManualList[0]];
      }
      setRecipesOnShoppingList(newRecipesOnShoppingList);
      setAllRecipes(parsedAllRecipes);
      const itemsOnShoppingList = addItemsToShoppingListTotal(parsedAllRecipes);
      setNumberOfItemsOnShoppingList(itemsOnShoppingList);
      setFilterText('');
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex">
      <Paper className="p-0.5 background-color" style={{ boxShadow: 'none' }}>
        <Input
          className="mx-0.5 pt-4 w-60"
          id="addItem"
          name="Add Item"
          placeholder="Add Item to List"
          type="text"
          autoComplete="off"
          value={filterText}
          onChange={handleItemInput}
          onKeyDown={handleKeyDown}
        />
      </Paper>
    </div>
  );
}
