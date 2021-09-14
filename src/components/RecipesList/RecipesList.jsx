import recipesData from '../../adapters/recipesData';

export default function Recipeslist() {
  return (
    <div>
      {recipesData.map((recipe) => (
        <div key={recipe.title}>
          <div>{recipe.title}</div>
        </div>
      ))}
    </div>
  );
}
