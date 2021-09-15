import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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

  const sortAllRecipes = (order) => {
    console.log('+++ 24: src/components/RecipesList/RecipesList.jsx - HERE');
    setRecipes(orderBy(recipesData, [(data) => data.title.toLowerCase()], order));
  };

  const navigate = () => {
    history.push(`/recipe`);
  };

  useEffect(() => {
    console.log(
      '+++ 33: src/components/RecipesList/RecipesList.jsx - categorySelected: ',
      categorySelected,
    );
    if (categorySelected === '') {
      console.log('+++ 38: src/components/RecipesList/RecipesList.jsx - HERE');
    }
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
          <div>
            <FormControl className="w-32 min-w-full">
              <InputLabel>Categories</InputLabel>
              <Select
                onChange={handleCategoryChange}
                value={categorySelected}
                className="capitalize"
              >
                <MenuItem value="''" className="capitalize">
                  <em>Categories</em>
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
