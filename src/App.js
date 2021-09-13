import './App.css';
import recipesData from './adapters/recipesData';

export default function App() {
  return (
    <div>
      <div>
        {recipesData.map((recipe) => {
          return <div>{recipe.title}</div>;
        })}
      </div>
    </div>
  );
}
