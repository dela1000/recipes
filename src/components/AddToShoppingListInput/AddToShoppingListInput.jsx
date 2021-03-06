import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import {
  dbState,
  currentUserState,
  allRecipesState,
  onShoppingListState,
  numberOfItemsOnShoppingListState,
} from '../../contexts/atoms/atoms';
import { addRecipe, updateRecipe } from '../../adapters/recipeAdapters';
import addItemsToShoppingListTotal from '../../contexts/addItemsToShoppingListTotal';

export default function AddToShoppingListInput() {
  const [filterText, setFilterText] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
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
      setDisabledInput(true);
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
        const parsedManualList = JSON.parse(JSON.stringify(manualListFound));
        parsedManualList[0].onShoppingList = true;
        newItem.index = parsedManualList[0].ingredients[0].ingredients.length;
        parsedManualList[0].ingredients[0].ingredients.push(newItem);
        docRef = await updateRecipe({
          db,
          currentUserId: currentUser.uid,
          recipeId: parsedManualList[0].id,
          payload: parsedManualList[0],
        });
        const foundIndex = newRecipesOnShoppingList.findIndex((x) => x.id === docRef.id);
        if (foundIndex === -1) {
          newRecipesOnShoppingList.push(docRef);
        } else {
          [newRecipesOnShoppingList[foundIndex]] = [parsedManualList[0]];
        }
        const foundAllIndex = parsedAllRecipes.findIndex((x) => x.id === docRef.id);
        [parsedAllRecipes[foundAllIndex]] = [parsedManualList[0]];
      }
      const sortedNewShoppingList = newRecipesOnShoppingList.reduce((acc, element) => {
        if (element.manualList) {
          return [element, ...acc];
        }
        return [...acc, element];
      }, []);

      setRecipesOnShoppingList(sortedNewShoppingList);
      setAllRecipes(parsedAllRecipes);
      const itemsOnShoppingList = addItemsToShoppingListTotal(parsedAllRecipes);
      setNumberOfItemsOnShoppingList(itemsOnShoppingList);
      setFilterText('');
      setDisabledInput(false);
    }
  };

  return (
    <div className="mt-6 flex">
      <Paper className="p-0.5 background-color" style={{ boxShadow: 'none' }}>
        <Input
          className="mx-0.5 pt-4 w-60"
          disabled={disabledInput}
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
