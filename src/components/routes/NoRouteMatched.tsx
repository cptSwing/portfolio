import { Link } from 'react-router-dom';

// Return 404 ?
const NoRouteMatched = () => {
    return (
        <p className="text-center">
            <h3>Uh-oh, no matching routeData found!</h3>

            <br />
            <Link to="/">Home</Link>
        </p>
    );
};

export default NoRouteMatched;
