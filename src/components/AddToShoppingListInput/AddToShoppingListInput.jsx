import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { useRecoilValue, useRecoilState } from 'recoil';
import { allShoppingItemsState, dbState, currentUserState } from '../../contexts/atoms/atoms';
import { updateShoppingList, addShoppingListInitialItems } from '../../adapters/recipeAdapters';

export default function AddToShoppingListInput() {
  const [filterText, setFilterText] = useState('');
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const [extraShoppingItems, setExtraShoppingItems] = useRecoilState(allShoppingItemsState);
  const handleItemInput = (event) => {
    setFilterText(event.target.value);
  };

  const handleAddToShoppingList = async (itemsToAdd) => {
    if (extraShoppingItems.id) {
      await updateShoppingList({
        db,
        currentUserId: currentUser.uid,
        extraShoppingItemsId: extraShoppingItems.id,
        payload: itemsToAdd,
      });
    } else {
      const addedShoppingList = await addShoppingListInitialItems({
        db,
        currentUserId: currentUser.uid,
        payload: itemsToAdd,
      });
      setExtraShoppingItems(addedShoppingList);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const newObject = JSON.parse(JSON.stringify(extraShoppingItems));
      if (!newObject.manualShoppingListItems) {
        newObject.manualShoppingListItems = [];
      }
      newObject.manualShoppingListItems.push({
        purchased: false,
        item: filterText,
        id: newObject.manualShoppingListItems.length + 1,
      });
      handleAddToShoppingList(newObject);
      setExtraShoppingItems(newObject);
      setFilterText('');
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
