import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import SocialsFooter from '../components/SocialsFooter';
import Background from '../components/Background';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import BarWrapped from '../components/BarWrapped';

const App = () => {
    return (
        <BrowserRouter>
            <div className='nav-checked-width relative mx-auto flex h-[98dvh] flex-col items-center justify-start [--header-transition-duration:300ms]'>
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
            <SocialsFooter />
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
