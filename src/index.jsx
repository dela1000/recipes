import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from './contexts/context';

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
);
