import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import Background from '../components/Background';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import BarWrapped from '../components/BarWrapped';
import classNames from '../lib/classNames';

const App = () => {
    return (
        <BrowserRouter>
            <div
                className={classNames(
                    'group/app relative mx-auto flex w-fit flex-col items-center justify-start',
                    '[--header-transition-duration:300ms]',
                    '[--unchecked-width:80dvw] sm:[--unchecked-width:66.666667dvw] md:[--unchecked-width:55dvw] lg:[--unchecked-width:42.5dvw] xl:[--unchecked-width:35dvw]',
                    '[--checked-width:95dvw] sm:[--checked-width:90dvw] md:[--checked-width:80dvw] lg:[--checked-width:75dvw] xl:[--checked-width:60dvw] 2xl:[--checked-width:50dvw]',
                    '[--post-width:100dvw] sm:[--post-width:90dvw] md:[--post-width:80dvw] lg:[--post-width:75dvw] xl:[--post-width:66.666666dvw]',
                    '[--color-bars-no-post:theme(colors.theme.secondary.400)] [--color-bars-post:theme(colors.theme.primary.500)] [--color-primary-active-cat-bg:theme(colors.theme.primary.300)] [--color-primary-content-bg:theme(colors.theme.primary.50)] [--color-primary-inactive-cat-bg:theme(colors.theme.primary.600)] [--color-secondary-active-cat:theme(colors.theme.secondary.400)] [--color-secondary-inactive-cat:theme(colors.theme.secondary.600)]',
                )}
            >
                <Routes>
                    <Route element={<RouteOutlet />}>
                        <Route path='/:catId?' element={<NavOutlet />}>
                            <Route path='/:catId/:postId' element={<Content />} />
                        </Route>
                    </Route>
                </Routes>
            </div>

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
    return (
        <>
            <LogoHeader />
            <BarWrapped>
                <Outlet />
            </BarWrapped>
        </>
    );
};

export default App;
