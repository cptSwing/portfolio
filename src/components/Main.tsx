import { FC, useEffect, useRef, useState } from 'react';
import Resume from './Resume';
import Code from './Code';
import Art from './Art';
import Settings from './Settings';
import ViewCode from './ViewCode';
import { CSSTransition } from 'react-transition-group';
import Default from './Default';
import { MENUTARGET } from '../types/types';
import { useZustand } from '../lib/zustand';

const menuContentPairings: Record<MENUTARGET, JSX.Element> = {
    default: <Default />,
    home: <></>,
    back: <>Back</>,
    forward: <>Forward</>,
    settings: <Settings />,
    viewCode: <ViewCode />,
    resume: <Resume />,
    code: <Code />,
    art: <Art />,
};

const Main: FC = () => {
    // const menuState = useZustand((state) => state.menuState);
    const menuLastUpdated = useZustand((state) => state.menuLastUpdated);

    const nodeRef = useRef(null);
    const [inProp, setInProp] = useState(true);
    const [childComponent, setChildComponent] = useState(menuContentPairings[menuLastUpdated]);

    useEffect(() => {
        setInProp(false);
    }, [menuLastUpdated]);

    return (
        <>
            <CSSTransition
                in={inProp}
                nodeRef={nodeRef}
                classNames='frame-transition'
                /* appear={true} */
                timeout={{
                    enter: 600,
                    exit: 400,
                }}
                onExited={() => {
                    setChildComponent(menuContentPairings[menuLastUpdated]);
                    setInProp(true);
                }}
            >
                <main ref={nodeRef} className='scrollbar-gutter pointer-events-auto size-full overflow-y-auto overflow-x-hidden p-12' /* bg-black/10 */>
                    {childComponent}
                </main>
            </CSSTransition>
        </>
    );
};

export default Main;
