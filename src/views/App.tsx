import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Main from '../components/routes/Home';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/:catId?/:postId?' element={<Main />} />

                <Route path='/bundles/:bundlePath' element={<BundleRoutes />} />

                <Route path='*' element={<NoRouteMatched />} />
            </Routes>
        </BrowserRouter>
    );
};

const BundleRoutes = () => {
    const { bundlePath } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        navigate(`/bundles/${bundlePath}/index.html`);
        // window.location.assign(`${window.location.protocol}//${window.location.host}/bundles/${bundlePath}/index.html`);
    }, [bundlePath, navigate]);

    return <h3> Redirecting to {bundlePath}.... </h3>;
};

export default App;

// Return 404 ?
const NoRouteMatched = () => {
    return (
        <p className='text-center'>
            <h3>Uh-oh, no matching route found!</h3>

            <br />
            <Link to='/'>Home</Link>
        </p>
    );
};
