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
  const [categorySelected, setCategorySelected] = useState('none');
  const [sort, setSort] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const [{ setRecipeId, setRecipe }] = useContext(Context);

  const navigate = () => {
    history.push('/recipe');
  };

  const sortAllRecipes = (listToSet) => {
    setRecipes(orderBy(listToSet, [(data) => data.title.toLowerCase()], sort));
  };

  const updateList = () => {
    if (!filterText && categorySelected === 'none') {
      return sortAllRecipes(recipesData);
    }
    let recipesToFilter = [];
    if (categorySelected !== 'none') {
      recipesData.forEach((recipe) => {
        if (recipe.categories.length > 0) {
          if (recipe.categories.includes(categorySelected)) {
            recipesToFilter.push(recipe);
          }
        }
      });
    } else {
      recipesToFilter = recipesData;
    }

    const updatedList = recipesToFilter.filter(
      (recipe) => recipe.title.toLowerCase().search(filterText.toLowerCase()) !== -1,
    );
    return setRecipes(orderBy(updatedList, [(data) => data.title.toLowerCase()], sort));
  };

  const handleCategoryChange = (event) => {
    setCategorySelected(event.target.value);
  };

  const handleFilterListChange = (event) => {
    setFilterText(event.target.value);
  };
  const handleSortChange = () => {
    if (sort === 'asc') {
      setSort('desc');
    } else {
      setSort('asc');
    }
  };

  useEffect(() => {
    updateList();
  }, [categorySelected, filterText, sort]);

  const groupCategories = () => {
    let allCategories = [];
    forEach(recipesData, (recipe) => {
      allCategories = [...allCategories, ...recipe.categories];
    });
    const unsortedCategories = [...new Set(allCategories)];
    setCategories(unsortedCategories.sort());
  };

  useEffect(() => {
    groupCategories();
    sortAllRecipes(recipesData);
  }, []);

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <div className="text-3xl mb-5">RECIPES</div>
          <div className="col-3">
            <Input
              className="mx-4 pt-4"
              id="filter"
              name="filter"
              placeholder="Filter"
              type="text"
              autoComplete="off"
              onChange={handleFilterListChange}
            />
            <FormControl className="w-32 min-w-full py-20">
              <InputLabel>Categories</InputLabel>
              <Select
                onChange={handleCategoryChange}
                value={categorySelected}
                className="capitalize"
              >
                <MenuItem value="none" className="capitalize text-gray-200">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category} className="capitalize">
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <button
              className="uppercase rounded px-4 py-2 text-xs bg-blue-900 text-blue-100 hover:bg-blue-600 duration-300 w-16 mx-4"
              type="button"
              onClick={() => {
                handleSortChange();
              }}
            >
              {sort}
            </button>
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
          <div className="text-xs">
            {recipe.categories.map((category) => (
              <div key={category}>{category}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
