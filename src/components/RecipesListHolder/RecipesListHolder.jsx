import { useSetRecoilState, useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import StarIcon from '@material-ui/icons/Star';
import random from 'lodash/random';
import {
  recipeIdState,
  recipeState,
  allRecipesState,
  allCategoriesState,
} from '../../contexts/atoms/atoms';
import RecipeListItem from '../RecipeListItem';

export default function RecipesListHolder() {
  const history = useHistory();

  const setRecipeId = useSetRecoilState(recipeIdState);
  const setRecipe = useSetRecoilState(recipeState);
  const [allCategories, setAllCategories] = useRecoilState(allCategoriesState);
  const [allRecipes, setAllRecipes] = useRecoilState(allRecipesState);
  const [listRecipes, setListRecipes] = useState([]);

  const [categorySelected, setCategorySelected] = useState('none');
  const [sort, setSort] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const [favoriteSelected, setFavoriteSelected] = useState(false);

  const sortAllRecipes = (listToSet) => {
    setAllRecipes(orderBy(listToSet, [(data) => data.title.toLowerCase()], sort));
  };

  const updateList = () => {
    if (!filterText && categorySelected === 'none' && !favoriteSelected) {
      return sortAllRecipes(allRecipes);
    }

    let recipesToFilter = [];
    if (categorySelected !== 'none') {
      allRecipes.forEach((recipe) => {
        if (recipe.categories.length > 0) {
          if (recipe.categories.includes(categorySelected)) {
            recipesToFilter.push(recipe);
          }
        }
      });
    } else {
      recipesToFilter = allRecipes;
    }

    if (favoriteSelected) {
      recipesToFilter = recipesToFilter.filter((recipe) => recipe.favorite);
    }

    recipesToFilter = recipesToFilter.filter(
      (recipe) => recipe.title.toLowerCase().search(filterText.toLowerCase()) !== -1,
    );

    return setListRecipes(orderBy(recipesToFilter, [(data) => data.title.toLowerCase()], sort));
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

  const handleFavoriteSelected = () => {
    setFavoriteSelected(!favoriteSelected);
  };

  const handleRandomSelected = () => {
    const randomRecipeSelected = allRecipes[random(0, allRecipes.length - 1)];
    setRecipe(randomRecipeSelected);
    setRecipeId(randomRecipeSelected.id);
    history.push('/recipe');
  };

  const groupCategories = () => {
    let allCategoriesTemp = [];
    forEach(allRecipes, (recipe) => {
      allCategoriesTemp = [...allCategoriesTemp, ...recipe.categories];
    });
    const unsortedCategories = [...new Set(allCategoriesTemp)];
    setAllCategories(unsortedCategories.sort());
  };

  const reset = () => {
    setCategorySelected('none');
    setFilterText('');
    setFavoriteSelected(false);
    setSort('asc');
  };

  useEffect(() => {
    updateList();
  }, [categorySelected, filterText, sort, favoriteSelected]);

  useEffect(() => {
    sortAllRecipes(allRecipes);
  }, []);

  useEffect(() => {
    groupCategories();
    setListRecipes(allRecipes);
    if (filterText || categorySelected !== 'none' || favoriteSelected) {
      updateList();
    }
  }, [allRecipes]);

  return (
    <div>
      <div>
        <div className="lg:flex justify-between mx-3 mb-5">
          <div className="text-5xl pt-1 mr-12 uppercase pt-9">my recipes</div>
          <div>
            <div className="lg:flex">
              <div className="mx-3">
                <Paper className="p-0.5 background-color" style={{ boxShadow: 'none' }}>
                  <Input
                    className="mx-0.5 pt-4"
                    id="filter"
                    name="filter"
                    placeholder="Search"
                    type="text"
                    autoComplete="off"
                    value={filterText}
                    onChange={handleFilterListChange}
                  />
                </Paper>
              </div>
              <div className="ml-4 mt-3 mb-4 lg:ml-0 lg:mt-0 lg:mb-0">
                <Paper className="p-0.5 background-color" style={{ boxShadow: 'none' }}>
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
                      {allCategories.map((category) => (
                        <MenuItem key={category} value={category} className="capitalize">
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </div>
            </div>
            <div className="lg:float-right">
              <div className="lg:flex justify-between">
                <div className="mt-3 ml-3">
                  <button
                    className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-16 mx-1 h-9"
                    type="button"
                    onClick={() => {
                      handleSortChange();
                    }}
                  >
                    {sort}
                  </button>
                  <button
                    className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-16 mx-1 h-9"
                    type="button"
                    onClick={() => {
                      handleFavoriteSelected();
                    }}
                  >
                    <StarIcon
                      fontSize="small"
                      className={`${
                        favoriteSelected ? `text-yellow-400` : 'text-white'
                      } fill-current`}
                    />
                  </button>
                  <button
                    className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-26 mx-1 h-9"
                    type="button"
                    onClick={() => {
                      handleRandomSelected();
                    }}
                  >
                    Random
                  </button>
                  <button
                    className="uppercase px-4 text-xs bg-red-500 text-blue-100 hover:bg-red-400 duration-300 mx-1 h-9"
                    type="button"
                    onClick={() => {
                      reset();
                    }}
                  >
                    clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {listRecipes.map((recipe) => (
        <RecipeListItem
          key={recipe.id}
          recipe={recipe}
          handleCategoryChange={handleCategoryChange}
        />
      ))}
    </div>
  );
}
