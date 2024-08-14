import { useCallback } from 'react';

const Background = () => {
    const bgRefCb = useCallback((node: HTMLDivElement | null) => {
        let removeEffect = () => {};

        // When DOM node is added, node is passed - and when it is removed, 'null' is passed. This is when we remove the eventlistener
        if (node) {
            removeEffect = parallaxEffect(node, 0.333);
        } else {
            removeEffect();
        }
    }, []);

    return (
        <div id='background' ref={bgRefCb} className='perspective-1000 pointer-events-none fixed size-full'>
            <div className='-translate-z-4 svg-background-image parallax-transform transform-style-3d size-full transform-gpu' />
        </div>
    );
};

export default Background;

const parallaxEffect = (elem: HTMLDivElement, smoothing: number) => {
    smoothing /= 100;

    const handleMouseMove = (ev: MouseEvent) => {
        // calculate transformation values
        const rotateHoriz = (ev.clientY - window.innerHeight / 2) * smoothing;
        const rotateVert = ((ev.clientX - window.innerWidth / 2) * -smoothing) / 2;

        // set CSS variables
        if (elem) {
            elem.style.setProperty('--parallax-horizontal', `${rotateHoriz}deg`);
            elem.style.setProperty('--parallax-vertical', `${rotateVert}deg`);
        }
    };

    document.documentElement.addEventListener('mousemove', handleMouseMove, false);
    return () => document.documentElement.removeEventListener('mousemove', handleMouseMove, false);
};
