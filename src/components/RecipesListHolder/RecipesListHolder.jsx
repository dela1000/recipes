import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import StarIcon from '@material-ui/icons/Star';
import random from 'lodash/random';
import RecipeListItem from '../RecipeListItem';

import { Context } from '../../contexts/context';

export default function RecipesListHolder({ recipesData }) {
  const [{ setRecipeId, setRecipe }] = useContext(Context);
  const history = useHistory();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState('none');
  const [sort, setSort] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const [favoriteSelected, setFavoriteSelected] = useState(false);

  const sortAllRecipes = (listToSet) => {
    setRecipes(orderBy(listToSet, [(data) => data.title.toLowerCase()], sort));
  };

  const updateList = () => {
    if (!filterText && categorySelected === 'none' && !favoriteSelected) {
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

    if (favoriteSelected) {
      recipesToFilter = recipesToFilter.filter((recipe) => recipe.favorite);
    }

    recipesToFilter = recipesToFilter.filter(
      (recipe) => recipe.title.toLowerCase().search(filterText.toLowerCase()) !== -1,
    );

    return setRecipes(orderBy(recipesToFilter, [(data) => data.title.toLowerCase()], sort));
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
    const randomRecipeSelected = recipesData[random(0, recipesData.length - 1)];
    setRecipe(randomRecipeSelected);
    setRecipeId(randomRecipeSelected.id);
    history.push('/recipe');
  };

  useEffect(() => {
    updateList();
  }, [categorySelected, filterText, sort, favoriteSelected]);

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
        <div className="lg:flex justify-between mx-3 mb-5">
          <div className="text-5xl pt-1 mr-12">RECIPES</div>
          <div className="lg:flex">
            <div>
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
            </div>
            <div className="mt-3 ml-3">
              <button
                className="uppercase rounded px-4 py-2 text-xs bg-blue-600 text-blue-100 hover:bg-blue-600 duration-300 w-16 mx-1 h-9"
                type="button"
                onClick={() => {
                  handleSortChange();
                }}
              >
                {sort}
              </button>
              <button
                className="uppercase rounded px-4 py-2 text-xs bg-blue-600 text-blue-100 hover:bg-blue-600 duration-300 w-16 mx-1 h-9"
                type="button"
                onClick={() => {
                  handleFavoriteSelected();
                }}
              >
                <StarIcon
                  fontSize="small"
                  className={`${favoriteSelected ? `text-yellow-400` : 'text-white'} fill-current`}
                />
              </button>
              <button
                className="uppercase rounded px-4 py-2 text-xs bg-blue-600 text-blue-100 hover:bg-blue-600 duration-300 w-26 mx-1 h-9"
                type="button"
                onClick={() => {
                  handleRandomSelected();
                }}
              >
                Random
              </button>
            </div>
          </div>
        </div>
      </div>
      {recipes.map((recipe) => (
        <RecipeListItem
          key={recipe.id}
          recipe={recipe}
          handleCategoryChange={handleCategoryChange}
        />
      ))}
    </div>
  );
}

RecipesListHolder.propTypes = {
  recipesData: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      favorite: PropTypes.bool,
      originalURL: PropTypes.string,
      source: PropTypes.string,
      categories: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  ).isRequired,
};
