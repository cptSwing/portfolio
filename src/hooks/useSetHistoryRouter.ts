import { useLocation, useNavigate } from 'react-router-dom';
import { historyRouter } from '../lib/historyRouter';

const useSetHistoryRouter = () => {
    historyRouter.navigate = useNavigate();
    historyRouter.location = useLocation();
};

export default useSetHistoryRouter;
