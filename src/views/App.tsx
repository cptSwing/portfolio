import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import Background from '../components/Background';
import { BrowserRouter, Outlet, Route, Routes, useParams } from 'react-router-dom';
import BarWrapped from '../components/BarWrapped';
import classNames from '../lib/classNames';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<RouteOutlet />}>
                    <Route path='/:catId?' element={<NavOutlet />}>
                        <Route path='/:catId/:postId' element={<Content />} />
                    </Route>
                </Route>
            </Routes>

            {/* Fixed Position, Background: */}
            <Background />
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
                    ? '[--header-height:theme(spacing.8)] sm:[--header-height:theme(spacing.16)]'
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

export default App;
