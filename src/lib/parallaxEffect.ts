export const parallaxEffect = (elem: HTMLDivElement, smoothing: number, zRem?: string) => {
    smoothing /= 100;
    elem.style.setProperty('--parallax-translateZ', `${zRem ?? 0}rem`);

    const handleMouseMove = (ev: MouseEvent) => {
        // calculate transformation values
        const rotateHoriz = (ev.clientY - window.innerHeight / 2) * smoothing;
        const rotateVert = ((ev.clientX - window.innerWidth / 2) * -smoothing) / 2;

        // set CSS variables
        elem.style.setProperty('--parallax-rotateX', `${rotateHoriz}deg`);
        elem.style.setProperty('--parallax-rotateY', `${rotateVert}deg`);
    };

    document.documentElement.addEventListener('mousemove', handleMouseMove, false);
    return () => document.documentElement.removeEventListener('mousemove', handleMouseMove, false);
};
