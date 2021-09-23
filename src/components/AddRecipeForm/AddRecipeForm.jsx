import { Typography, Paper, Box, Grid, TextField, Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';

export default function AddRecipeForm() {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();

  const combine = (array) => {
    let string = '';
    array.forEach((item) => {
      string += item;
    });
    return string;
  };

  const defineIngredients = (lineData) => {
    const ingredientsArray = [];
    const lines = lineData.split('\n');

    lines.forEach((line) => ingredientsArray.push(line));
    const formattedIngredients = [];
    ingredientsArray.forEach((ingredient) => {
      const splitString = ingredient.split('');
      const numbers = [];
      const letters = [];
      const separated = {};

      let isLetter = false;

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

      formattedIngredients.push(separated);
    });
    return formattedIngredients;
  };

  const onSubmit = (recimeFormData) => {
    // console.log('+++ 12: src/components/AddRecipeForm/AddRecipeForm.jsx - data: ', data);
    if (recimeFormData.ingredients.length > 0) {
      const definedIngredients = defineIngredients(recimeFormData.ingredients);
      console.log(
        '+++ 33: src/components/AddRecipeForm/AddRecipeForm.jsx - definedIngredients: ',
        definedIngredients,
      );
    }
  };

  // console.log(watch('title')); // watch input value by passing the name of it

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper>
        <Box px={3} py={2}>
          <Typography variant="h6" align="center" margin="dense">
            Add a New Recipe
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                id="title"
                label="Title"
                // {...register('exampleRequired', { required: true })}
                {...register('title')}
              />
              {errors.exampleRequired && <span>This field is required</span>}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                id="description"
                label="Description"
                {...register('description')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                id="ingredients"
                label="Ingredients"
                multiline
                rows={20}
                {...register('ingredients')}
              />
            </Grid>
          </Grid>
          {/* <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <TextField fullWidth id="instructions" label="Instructions" multiline rows={20} />
            </Grid>
          </Grid> */}
          <Box mt={3} justify="end">
            <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
              Add Recipe
            </Button>
          </Box>
        </Box>
      </Paper>
    </form>
  );
}
