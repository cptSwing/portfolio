import Content from '../components/Content';
import Nav from '../components/Nav';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Category from '../components/Category';

const App = () => {
    return (
        <div className='relative flex h-dvh w-dvw items-center justify-center overflow-hidden bg-slate-800 font-mariam-libre text-white'>
            <BrowserRouter>
                <Routes>
                    <Route path='/:catId?' element={<NavOutlet />}>
                        <Route path='/:catId/:postId' element={<Content />} />
                    </Route>

                    <Route path='/bundles/:bundlePath' element={<BundleRoutes />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

const NavOutlet = () => {
    return (
        <>
            <Nav />
            <Category />
        </>
    );
};

const BundleRoutes = () => {
    const { bundlePath } = useParams();

    useEffect(() => {
        window.location.href = `https://jbrandenburg.de/bundles/${bundlePath}/index.html`;
    }, [bundlePath]);

    return <h3> Redirecting.... </h3>;
};

export default App;
