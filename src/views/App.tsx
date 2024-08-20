import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import SocialsFooter from '../components/SocialsFooter';
import Background from '../components/Background';

const App = () => {
    return (
        <>
            <Background />

            <div className='relative flex size-full flex-col items-center justify-start'>
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
