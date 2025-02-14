import ReactDOM from 'react-dom/client';
import App from './views/App.tsx';
import './styles/style_main.css';
import { StrictMode } from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
