import { functionalButtonHamburgerOffsets, functionalButtons } from '../lib/hexagonElements';
import { useZustand } from '../lib/zustand';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { FC, memo, useContext, useMemo } from 'react';
import { FunctionalButtonRouteData } from '../types/types';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { calcCSSVariables, offsetHexagonTransforms } from '../lib/shapeFunctions';
import { useNavigate } from 'react-router-dom';
import { MenuButtonSvg } from './HexagonShapes';
import { ROUTE } from '../types/enums';

const FunctionalButtons: FC<{ homeMenuTransitionStates: ['code' | '3d' | 'log' | null, boolean] }> = ({ homeMenuTransitionStates }) =>
    functionalButtons.map((functionalButtonData, idx) => (
        <FunctionalButton
            key={`hex-functional-button-index-${idx}`}
            buttonData={functionalButtonData}
            homeMenuTransitionStates={functionalButtonData.name === 'hamburger' ? homeMenuTransitionStates : undefined}
        />
    ));

export default FunctionalButtons;

const FunctionalButton: FC<{
    buttonData: FunctionalButtonRouteData;
    homeMenuTransitionStates?: ['code' | '3d' | 'log' | null, boolean];
}> = memo(({ buttonData, homeMenuTransitionStates }) => {
    const { name, target, svgIconPath } = buttonData;
    const [homeMenuTransitionTarget, homeMenuTransitionTargetReached] = homeMenuTransitionStates ?? [];
    const routeName = useZustand((store) => store.values.routeData.name);
    const counterRotate = buttonData[routeName].counterRotate;

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(() => {
        let routeTransforms;
        if (routeName === ROUTE.home && homeMenuTransitionTarget && homeMenuTransitionTargetReached) {
            routeTransforms = offsetHexagonTransforms(buttonData, functionalButtonHamburgerOffsets[homeMenuTransitionTarget])[routeName];
        } else {
            routeTransforms = buttonData[routeName];
        }

        const { position, rotation, scale, isHalf } = routeTransforms;
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize);
    }, [buttonData, containerSize, homeMenuTransitionTarget, homeMenuTransitionTargetReached, routeName]);

    return (
        <GlassmorphicButtonWrapper
            name={name}
            style={{
                ...cssVariables_Memo,
                zIndex: 20,
            }}
            isRouteNavigation={false}
            clickHandler={handleClick}
            lightingGradient={routeName === ROUTE.home}
            strokeRadius={1}
            innerShadowRadius={6}
        >
            <MenuButtonSvg svgIconPath={svgIconPath} counterRotate={counterRotate} />
        </GlassmorphicButtonWrapper>
    );

    function handleClick(ev?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent> | undefined) {
        const targetResult = (target as (ev?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent> | undefined) => string | void)(ev);
        targetResult && navigate(targetResult);
    }
});
