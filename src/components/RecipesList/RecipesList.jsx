import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import { Context } from '../../contexts/context';
import recipesData from '../../adapters/recipesData';

export default function RecipesList() {
  const history = useHistory();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState('');
  const [{ setRecipeId, setRecipe }] = useContext(Context);

  const handleCategoryChange = (event) => {
    setCategorySelected(event.target.value);
  };

  const sortAllRecipes = (order: 'asc') => {
    setRecipes(orderBy(recipesData, [(data) => data.title.toLowerCase()], order));
  };

  const filterList = (event) => {
    if (event.target.value.length > 0) {
      let updatedList = recipesData;

      updatedList = updatedList.filter(
        (recipe) => recipe.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1,
      );

      setRecipes(updatedList);
    } else {
      sortAllRecipes('asc');
    }
  };

  const navigate = () => {
    history.push(`/recipe`);
  };

  useEffect(() => {
    console.log(
      '+++ 38: src/components/RecipesList/RecipesList.jsx - categorySelected: ',
      categorySelected,
    );
  }, [categorySelected]);

  useEffect(() => {
    let allCategories = [];
    forEach(recipesData, (recipe) => {
      allCategories = [...allCategories, ...recipe.categories];
    });
    const unsortedCategories = [...new Set(allCategories)];
    setCategories(unsortedCategories.sort());

    sortAllRecipes('asc');
  }, []);

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <div className="text-3xl mb-5">RECIPES</div>
          <div className="col-2">
            <Input
              className="mx-4 pt-4"
              id="filter"
              name="filter"
              placeholder="Filter"
              type="text"
              onChange={filterList}
            />
            <FormControl className="w-32 min-w-full py-20">
              <InputLabel>Categories</InputLabel>
              <Select
                onChange={handleCategoryChange}
                value={categorySelected}
                className="capitalize"
              >
                <MenuItem value="''" className="capitalize text-gray-200">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category} className="capitalize">
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <button
            className="uppercase"
            type="button"
            onClick={() => {
              setRecipe(recipe);
              setRecipeId(recipe.id);
              navigate();
            }}
          >
            {recipe.title}
          </button>
        </div>
      ))}
    </div>
  );
}
