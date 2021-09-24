import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Typography, Paper, Box, Grid, TextField, Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';

import recipeToEdit from './utilities/recipeToEdit';

import { addRecipe, updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function RecipeForm({ type }) {
  const [{ db, currentUser, setRecipeId, setRecipe, recipe }] = useContext(Context);
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

  const defineFinalObject = (array) => {
    const finalObject = {
      standard: [],
    };
    array.forEach((item) => {
      const trimmedItem = item.trim();
      if (trimmedItem.charAt(0) === '[' && trimmedItem.charAt(trimmedItem.length - 1) === ']') {
        const cleanedUpString = onlyString(trimmedItem);
        finalObject[cleanedUpString] = [];
      }
    });
    return finalObject;
  };

  const defineIngredients = (lineData) => {
    // separate each line from te TextField into an array of strings
    const ingredientsArray = splitLineIntoArray(lineData);
    // select each item defined as header (by using [])
    const finalIngredientsObject = defineFinalObject(ingredientsArray);

    let ingredientGroup = 'standard';
    ingredientsArray.forEach((ingredient) => {
      const splitString = ingredient.split('');
      let foundIngredientGroup = false;
      if (splitString[0] === '[' && splitString[splitString.length - 1] === ']') {
        foundIngredientGroup = true;
        const combinedIngredientGroup = combine(splitString);
        ingredientGroup = onlyString(combinedIngredientGroup);
      }
      const numbers = [];
      const letters = [];
      const separated = {
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
        finalIngredientsObject[ingredientGroup].push(separated);
      }
    });
    return finalIngredientsObject;
  };

  const defineInstructions = (lineData) => {
    const instructionsArray = splitLineIntoArray(lineData);
    const finalInnstructionsObject = defineFinalObject(instructionsArray);

    let instructionGroup = 'standard';
    instructionsArray.forEach((instruction) => {
      let foundInstructionGroup = false;
      const trimmedInstruction = instruction.trim();
      if (
        trimmedInstruction.charAt(0) === '[' &&
        trimmedInstruction.charAt(trimmedInstruction.length - 1) === ']'
      ) {
        foundInstructionGroup = true;
        instructionGroup = onlyString(trimmedInstruction);
      }
      if (!foundInstructionGroup) {
        finalInnstructionsObject[instructionGroup].push(trimmedInstruction);
      }
    });
    return finalInnstructionsObject;
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
    if (recipeFormData.ingredients.length > 0) {
      dataToSubmit.ingredients = defineIngredients(recipeFormData.ingredients.trim());
    }
    if (recipeFormData.instructions.length > 0) {
      dataToSubmit.instructions = defineInstructions(recipeFormData.instructions.trim());
    }
    if (recipeFormData.categories.length > 0) {
      dataToSubmit.categories = defineCategores(recipeFormData.categories.trim());
    } else {
      dataToSubmit.categories = [];
    }

    submitData(dataToSubmit);
  };

  const helperMeasurements = ['1/4', '1/3', '1/2', '3/4', '°', '[', ']'];

  const addValue = (value) => {
    let singleValue = getValues('ingredients');
    singleValue += `${value} `;
    setValue('ingredients', singleValue);
  };

  return (
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
                {helperMeasurements.map((me) => (
                  <button
                    key={me}
                    type="button"
                    className="text-blue-600"
                    onClick={() => addValue(me)}
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
                {helperMeasurements.map((me) => (
                  <button
                    key={me}
                    type="button"
                    className="text-blue-600"
                    onClick={() => addValue(me)}
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
            <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
              {type === 'new' ? 'Add' : 'Edit'} Recipe
            </Button>
          </Box>
        </Box>
      </Paper>
    </form>
  );
}

RecipeForm.propTypes = {
  type: PropTypes.string.isRequired,
};
