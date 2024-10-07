import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import SocialsFooter from '../components/SocialsFooter';
import Background from '../components/Background';
import BarWrapped from '../components/BarWrapped';

const App = () => {
    return (
        <>
            <div className='nav-checked-width relative mx-auto flex h-[98dvh] flex-col items-center justify-start [--header-height:10dvh] [--header-transition-duration:300ms]'>
                <LogoHeader />
                <BarWrapped>
                    <Nav />
                    <Content />
                </BarWrapped>
                <SocialsFooter />
            </div>

            {/* Fixed Position, Background: */}
            <Background />
        </>
    );
};

// ;

export default App;
