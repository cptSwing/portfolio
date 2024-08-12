import ReactDOM from 'react-dom/client';
import App from './views/App.tsx';
// import './styles/style_main.css';
import { StrictMode } from 'react';

// WARN Get rid of before deploying
const useStrict = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
    useStrict ? (
        <StrictMode>
            <App />
        </StrictMode>
    ) : (
        <App />
    ),
);
