import { FC, useEffect, useRef, useState } from 'react';
import Resume from './Resume';
import Code from './Code';
import Art from './Art';
import Settings from './Settings';
import ViewCode from './ViewCode';
import { CSSTransition } from 'react-transition-group';
import Default from './Default';
import { usePrevious } from '../hooks/usePrevious';
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
    const menuState = useZustand((state) => state.menuState);
    const menuLastUpdated = useZustand((state) => state.menuLastUpdated);

    const [inProp, setInProp] = useState(true);
    const [childComponent, setChildComponent] = useState(menuContentPairings[menuLastUpdated]);

    useEffect(() => {
        setInProp(false);
    }, [menuLastUpdated]);

    // useEffect(() => {
    //     const menuCheckedKeys = Object.keys(menuState) as MENUTARGET[];

    //     menuCheckedKeys.length &&
    //         menuCheckedKeys.every((key) => {
    //             if (menuState[key]) {
    //                 setActiveMenuItem(key);
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         });
    // }, [menuState, previousMenuItem, inProp]);

    const nodeRef = useRef(null);

    return (
        <>
            <div className='pointer-events-auto flex w-full items-center justify-center'>
                <button className='bg-blue-200' onClick={() => setInProp((inProp) => !inProp)}>{`${inProp}`}</button>
            </div>

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
                <main ref={nodeRef} className='pointer-events-auto size-full overflow-x-hidden overflow-y-scroll p-12' /* bg-black/10 */>
                    {childComponent}
                </main>
            </CSSTransition>
        </>
    );
};

export default Main;
