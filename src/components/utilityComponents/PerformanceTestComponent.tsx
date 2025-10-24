import { useMemo, useRef, useState } from 'react';
import PerformanceTest from '../../classes/PerformanceTest';

/** demonstration of how to use, keep this for inclusion in my cpts- repo's documentation */

const test1Fn = (load: number) => {
    const canvas = document.getElementById('performance-test-canvas')!;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = 'performance-test-canvas';
    canvas.parentNode!.replaceChild(g, canvas);

    for (let i = 1; i < load; i++) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100');
        rect.setAttribute('height', '100');
        rect.setAttribute('filter', 'url(#' + 'f1' + ')');
        rect.setAttribute('fill', 'rgba(128,128,128,0.8)');
        rect.setAttribute('x', (Math.random() * 300).toString());
        rect.setAttribute('y', (Math.random() * 300).toString());
        g.appendChild(rect);
    }
};

const test2Fn = (load: number) => {
    const canvas = document.getElementById('performance-test-canvas')!;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = 'performance-test-canvas';
    canvas.parentNode!.replaceChild(g, canvas);

    for (let i = 1; i < load; i++) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100');
        rect.setAttribute('height', '100');
        rect.setAttribute('filter', 'url(#' + 'f2' + ')');
        rect.setAttribute('fill', 'rgba(128,128,128,0.8)');
        rect.setAttribute('x', (Math.random() * 300).toString());
        rect.setAttribute('y', (Math.random() * 300).toString());
        g.appendChild(rect);
    }
};

const PerformanceTestComponent = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const results_Ref = useRef<HTMLDivElement | null>(null);

    const [test1, test2] =
        useMemo(() => {
            if (hasMounted && results_Ref.current) {
                return [new PerformanceTest(test1Fn, results_Ref.current), new PerformanceTest(test2Fn, results_Ref.current)];
            }
        }, [hasMounted]) ?? [];

    function mountCb(elem: HTMLDivElement | null) {
        if (elem) {
            // setClickHandlers([new PerformanceTest(test1Fn, elem), new PerformanceTest(test2Fn, elem)]);
            setHasMounted(true);
            results_Ref.current = elem;
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center bg-gray-600/50">
            <svg width="400" height="400" className="bg-red-400/50">
                <defs>
                    <filter id="f1">
                        <feColorMatrix
                            result="alphaOut"
                            in="SourceGraphic"
                            type="matrix"
                            values="0 0 0 0 1
                                0 0 0 0 1
                                0 0 0 0 1
                                0 0 0 1 0"
                        />
                    </filter>
                    <filter id="f2">
                        <feMerge>
                            <feMergeNode dx="1" dy="1" in="SourceAlpha" />
                        </feMerge>
                    </filter>
                </defs>

                <g id="performance-test-canvas"></g>
            </svg>

            <div className="flex w-1/4 items-center justify-between text-white">
                <button onClick={() => test1?.start()}>Filter 1</button>
                <button onClick={() => test2?.start()}>Filter 1</button>
            </div>
            <div id="performance-test-wrapper-results" ref={mountCb}></div>
        </div>
    );
};

export default PerformanceTestComponent;
