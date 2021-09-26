import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Typography, Paper, Box, Grid, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';

import recipeToEdit from './utilities/recipeToEdit';

import { addRecipe, updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function RecipeForm({ type }) {
  const [{ db, currentUser, setRecipeId, setRecipe, recipe, setLoading }] = useContext(Context);
  const history = useHistory();
  let dataToEdit = {};
  if (type === 'edit') {
    if (!recipe.id) {
      history.push(`/`);
    } else {
      dataToEdit = recipeToEdit(recipe);
    }
  }
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: dataToEdit });

  const navigate = (recipeData, navigateTo) => {
    setRecipe(recipeData);
    setRecipeId(recipeData.id);
    history.push(`/${navigateTo}`);
  };

  const submitData = async (dataToSubmit) => {
    setLoading(true);
    let docRef;
    if (type === 'new') {
      docRef = await addRecipe({
        db,
        currentUserId: currentUser.uid,
        payload: dataToSubmit,
      });
    }

    if (type === 'edit') {
      docRef = await updateRecipe({
        db,
        currentUserId: currentUser.uid,
        recipeId: recipe.id,
        payload: dataToSubmit,
      });
    }
    setLoading(false);
    navigate(docRef, 'recipe');
  };

  const combine = (array) => {
    let string = '';
    array.forEach((item) => {
      string += item;
    });
    return string;
  };

  const splitLineIntoArray = (lineData) => {
    const lines = lineData.split('\n');
    return lines;
  };

  const onlyString = (string) => string.substring(1).slice(0, -1);

  const defineFinalObject = (array, arrayType) => {
    let index = 0;
    const finalObject = [{ groupName: 'standard', [arrayType]: [], index }];
    array.forEach((item) => {
      const trimmedItem = item.trim();
      if (trimmedItem.charAt(0) === '[' && trimmedItem.charAt(trimmedItem.length - 1) === ']') {
        index += 1;
        const cleanedUpString = onlyString(trimmedItem);
        finalObject.push({ groupName: cleanedUpString, [arrayType]: [], index });
      }
    });
    return finalObject;
  };

  const defineIngredients = (lineData) => {
    // separate each line from te TextField into an array of strings
    const ingredientsArray = splitLineIntoArray(lineData);
    // select each item defined as header (by using [])
    const finalIngredientsObject = defineFinalObject(ingredientsArray, 'ingredients');

    let groupIndex = 0;
    ingredientsArray.forEach((ingredient, index) => {
      const trimIngredient = ingredient.trim();
      const splitString = trimIngredient.split('');

      let foundIngredientGroup = false;
      if (splitString[0] === '[') {
        foundIngredientGroup = true;
        groupIndex += 1;
      }

      const numbers = [];
      const letters = [];
      const separated = {
        index,
        purchased: false,
      };

      let isLetter = false;
      if (!foundIngredientGroup) {
        splitString.forEach((item) => {
          if (item.match(/[a-z]/i) && !isLetter) isLetter = true;
          if (isLetter) {
            letters.push(item);
          } else {
            numbers.push(item);
          }
        });
        const numberPart = combine(numbers);
        const stringPart = combine(letters);

        if (numberPart) {
          separated.quantity = numberPart.trim();
        }

        if (stringPart) {
          separated.string = stringPart.trim();
        }

        finalIngredientsObject[groupIndex].ingredients.push(separated);
      }
    });
    return finalIngredientsObject;
  };

  const defineInstructions = (lineData) => {
    const instructionsArray = splitLineIntoArray(lineData);
    const finalInstructionsObject = defineFinalObject(instructionsArray, 'instructions');

    let groupIndex = 0;
    instructionsArray.forEach((instruction) => {
      let foundInstructionGroup = false;
      const trimmedInstruction = instruction.trim();
      if (trimmedInstruction.charAt(0) === '[') {
        foundInstructionGroup = true;
        groupIndex += 1;
      }
      if (!foundInstructionGroup) {
        finalInstructionsObject[groupIndex].instructions.push(trimmedInstruction);
      }
    });
    return finalInstructionsObject;
  };

  const defineCategores = (categories) => {
    const categoriesFinal = [];
    const categoriesHolder = categories.trim().split(',');

    categoriesHolder.forEach((category) => {
      const item = category.trim().toLowerCase();
      categoriesFinal.push(item);
    });
    return categoriesFinal.filter(String);
  };

  const onSubmit = (recipeFormData) => {
    const dataToSubmit = JSON.parse(JSON.stringify(recipeFormData));
    dataToSubmit.favorite = false;

    dataToSubmit.ingredients = defineIngredients(recipeFormData.ingredients.trim());
    dataToSubmit.instructions = defineInstructions(recipeFormData.instructions.trim());

    if (recipeFormData.categories.length > 0) {
      dataToSubmit.categories = defineCategores(recipeFormData.categories.trim());
    } else {
      dataToSubmit.categories = [];
    }

    submitData(dataToSubmit);
  };

  const helperInputs = ['1/4', '1/3', '1/2', '3/4', '°', '[', ']'];

  const addHelperInput = (value, string) => {
    let singleValue = getValues(string);
    singleValue += `${value} `;
    setValue(string, singleValue);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper>
          <Box px={3} py={2}>
            <Typography variant="h6" align="center" margin="dense">
              {type === 'new' ? 'Add a New Recipe' : 'Edit Recipe'}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="title"
                  label="Title"
                  {...register('title', { required: true })}
                />
                {errors.exampleRequired && (
                  <span className="text-red-500">This field is required</span>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="description"
                  label="Description"
                  multiline
                  rows={3}
                  {...register('description')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="ingredients"
                  label="Ingredients"
                  multiline
                  rows={16}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register('ingredients')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} className="text-xs">
                Optional: Use brackets for Ingredient Groups. Example: <b>[Crust]</b> and{'  '}
                <b>[Filling]</b>
              </Grid>
              <Grid item xs={12} sm={6} className="text-xs">
                <div className="flex justify-between">
                  {helperInputs.map((me) => (
                    <button
                      key={me}
                      type="button"
                      className="text-blue-600"
                      onClick={() => addHelperInput(me, 'ingredients')}
                    >
                      {me}
                    </button>
                  ))}
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="instructions"
                  label="Instructions"
                  multiline
                  rows={16}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register('instructions')}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} className="text-xs">
                Optional: Use brackets for Instruction Groups. Example: <b>[Crust]</b> and{'  '}
                <b>[Filling]</b>
              </Grid>
              <Grid item xs={12} sm={6} className="text-xs">
                <div className="flex justify-between">
                  {helperInputs.map((me) => (
                    <button
                      key={me}
                      type="button"
                      className="text-blue-600"
                      onClick={() => addHelperInput(me, 'instructions')}
                    >
                      {me}
                    </button>
                  ))}
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="yield"
                  label="Yield"
                  {...register('yield')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="categories"
                  label="Categories"
                  {...register('categories')}
                />
                <span className="text-xs">Separate with commas</span>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="active"
                  label="Active Time"
                  {...register('active')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="totalTime"
                  label="Total Time"
                  {...register('totalTime')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="source"
                  label="Source"
                  {...register('source')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="originalURL"
                  label="Original URL"
                  {...register('originalURL')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="image"
                  label="Image URL"
                  {...register('image')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  id="notes"
                  label="Notes"
                  multiline
                  rows={4}
                  {...register('notes')}
                />
              </Grid>
            </Grid>

            <Box mt={3} justify="flex-end" textAlign="right">
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-32 mx-1 h-14"
              >
                {type === 'new' ? 'Add Recipe' : 'Save Changes'}
              </button>
            </Box>
          </Box>
        </Paper>
      </form>
    </div>
  );
}

RecipeForm.propTypes = {
  type: PropTypes.string.isRequired,
};
