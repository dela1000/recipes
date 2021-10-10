import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { useRecoilValue } from 'recoil';

import { allRecipesState } from '../../contexts/atoms/atoms';

export default function AddToShoppingListInput() {
  const [filterText, setFilterText] = useState('');
  const recipesData = useRecoilValue(allRecipesState);
  // const db = useRecoilValue(dbState);
  // const currentUser = useRecoilValue(currentUserState);
  const handleItemInput = (event) => {
    setFilterText(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(
        '+++ 17: src/components/AddToShoppingListInput/AddToShoppingListInput.jsx - filterText: ',
        filterText,
      );
      console.log(
        '+++ 23: src/components/AddToShoppingListInput/AddToShoppingListInput.jsx - recipesData: ',
        recipesData,
      );
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
