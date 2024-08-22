import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import SocialsFooter from '../components/SocialsFooter';
import Background from '../components/Background';

const App = () => {
    return (
        <>
            {/* Fixed Position, Background: */}
            <Background />

            <div className='relative flex size-full min-h-screen flex-col items-center justify-start text-left'>
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
