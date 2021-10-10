import { useRecoilValue } from 'recoil';
import { recipeState } from '../../contexts/atoms/atoms';

export default function RecipeInstructions() {
  const recipe = useRecoilValue(recipeState);
  return (
    <div className="my-5 mb-20 lg:pl-3 lg:pl-0">
      <div className="my-5 pl-3 lg:pl-0">
        <div className="mt-5 mb-2 text-2xl">INSTRUCTIONS</div>
        {recipe.instructions.map((item) => (
          <div key={item.index}>
            {item.instructions.length > 0 && (
              <div className="text-1xl font-bold capitalize">{item.groupName}</div>
            )}
            {item.instructions.map((instruction, idx) => (
              <div className="flex mb-2" key={instruction}>
                <div className="font-bold mr-2">{idx + 1} </div>
                <div>{instruction}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
