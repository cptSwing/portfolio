import { NavigateFunction, Location } from 'react-router-dom';

// custom history object to allow navigation outside react components, https://jasonwatmore.com/react-router-6-navigate-outside-react-components
export const historyRouter: { navigate: NavigateFunction | null; location: Location | null } = {
    navigate: null,
    location: null,
};
