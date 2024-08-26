import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import SocialsFooter from '../components/SocialsFooter';
import Background from '../components/Background';
import classNames from '../lib/classNames';
import { useZustand } from '../lib/zustand';

const App = () => {
    const isOpened = useZustand((state) => state.nav.isOpened);

    return (
        <>
            {/* Fixed Position, Background: */}
            <Background />

            <div
                className={classNames(
                    'relative mx-auto flex h-full min-h-screen flex-col items-center justify-start text-left transition-[width]',
                    isOpened ? 'nav-checked-width' : 'nav-unchecked-width',
                )}
            >
                <LogoHeader />
                <Content />
                <Nav />
                <SocialsFooter />
            </div>
        </>
    );
};

// ;

export default App;
