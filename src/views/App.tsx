import { useEffect } from 'react';
import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav from '../components/Nav';
import SocialsFooter from '../components/SocialsFooter';

const App = () => {
    useEffect(() => {
        parallaxEffect(0.333);
    }, []);

    return (
        <div className='perspective-1000 fixed h-dvh w-dvw overflow-hidden bg-gray-400 text-white'>
            <div className='-translate-z-4 svg-background-image parallax-transform transform-style-3d fixed bottom-0 left-0 right-0 top-0 transform-gpu' />

            <LogoHeader />
            <Content />
            <Nav />
            <SocialsFooter />
        </div>
    );
};

export default App;

const parallaxEffect = (smoothing: number) => {
    const root = document.documentElement;
    smoothing /= 100;

    root.addEventListener('mousemove', (event) => {
        // calculate transformation values
        const rotateHoriz = (event.clientY - window.innerHeight / 2) * smoothing;
        const rotateVert = ((event.clientX - window.innerWidth / 2) * -smoothing) / 2;

        // set CSS variables
        root.style.setProperty('--parallax-horizontal', `${rotateHoriz}deg`);
        root.style.setProperty('--parallax-vertical', `${rotateVert}deg`);
    });
};
