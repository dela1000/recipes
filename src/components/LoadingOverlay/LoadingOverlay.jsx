import { useContext } from 'react';
import loadingGif from '../../assets/images/loading.gif';
import './LoadingOverlay.css';

import { Context } from '../../contexts/context';

export default function LoadingOverlay() {
  const [{ loading }] = useContext(Context);
  return (
    <div>
      {loading && (
        <div className="loading-background-color flex h-full absolute w-full -pt-12 z-50">
          <div className="m-auto">
            <img src={loadingGif} alt="loading..." />
          </div>
        </div>
      )}
    </div>
  );
}
