import { useRecoilValue } from 'recoil';
import { loadingOverlayState } from '../../contexts/atoms/atoms';
import loadingGif from '../../assets/images/loading.gif';
import './LoadingOverlay.css';

export default function LoadingOverlay() {
  const loading = useRecoilValue(loadingOverlayState);
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
