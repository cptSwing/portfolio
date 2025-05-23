import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import { BrowserRouter, Outlet, Route, Routes, useParams } from 'react-router-dom';
import BarWrapped from '../components/BarWrapped';
import classNames from '../lib/classNames';
import { useEffect } from 'react';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<RouteOutlet />}>
                    <Route path='/:catId?' element={<NavOutlet />}>
                        <Route path='/:catId/:postId' element={<Content />} />
                    </Route>
                    <Route path='/bundles/:bundlePath' element={<BundleRoutes />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

const NavOutlet = () => {
    return (
        <>
            <Nav />
            <Outlet />
        </>
    );
};

const RouteOutlet = () => {
    const { postId } = useParams();

    return (
        <div
            className={classNames(
                'group/app relative mx-auto flex w-fit flex-col items-center justify-start',
                postId
                    ? '[--header-height:theme(spacing.10)] sm:[--header-height:theme(spacing.10)]'
                    : '[--header-height:theme(spacing.20)] sm:[--header-height:theme(spacing.28)]',
                '[--header-transition-duration:300ms]',
                '[--unchecked-width:80vw] sm:[--unchecked-width:66.666667vw] md:[--unchecked-width:55vw] lg:[--unchecked-width:42.5vw] xl:[--unchecked-width:35vw]',
                '[--checked-width:95vw] sm:[--checked-width:90vw] md:[--checked-width:80vw] lg:[--checked-width:75vw] xl:[--checked-width:60vw] 2xl:[--checked-width:50vw]',
                '[--post-width:100vw] sm:[--post-width:90vw] md:[--post-width:80vw] lg:[--post-width:75vw] xl:[--post-width:66.666666vw]',
            )}
        >
            <LogoHeader />
            <BarWrapped>
                <Outlet />
            </BarWrapped>
        </div>
    );
};

const BundleRoutes = () => {
    const { bundlePath } = useParams();

    useEffect(() => {
        window.location.href = `https://jbrandenburg.de/bundles/${bundlePath}/index.html`;
    }, []);

    return <h3> Redirecting.... </h3>;
};

export default App;
