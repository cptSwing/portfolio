import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import Background from '../components/Background';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import BarWrapped from '../components/BarWrapped';

const App = () => {
    return (
        <BrowserRouter>
            <div className='relative mx-auto flex flex-col items-center justify-start [--checked-width:95dvw] [--header-transition-duration:300ms] [--post-width:95dvw] [--unchecked-width:75dvw] sm:[--checked-width:90dvw] sm:[--post-width:90dvw] sm:[--unchecked-width:66.666667dvw] md:[--checked-width:80dvw] md:[--post-width:80dvw] md:[--unchecked-width:50dvw] lg:[--checked-width:75dvw] lg:[--post-width:75dvw] lg:[--unchecked-width:33.333333dvw] xl:[--checked-width:45dvw] xl:[--post-width:66.666666dvw] xl:[--unchecked-width:25dvw]'>
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

const NavOutlet = () => {
    return (
        <>
            <Nav />
            <Outlet />
        </>
    );
};

export default App;
