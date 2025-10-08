import { functionalButtons } from '../lib/hexagonElements';
import { useZustand } from '../lib/zustand';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { FC, memo, useContext, useMemo } from 'react';
import { FunctionalButtonRouteData } from '../types/types';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { calcCSSVariables } from '../lib/shapeFunctions';
import { useNavigate } from 'react-router-dom';
import { MenuButtonSvg } from './HexagonShapes';

const FunctionalButtons = () => {
    return (
        <div className="absolute z-20 size-[inherit]">
            {functionalButtons.map((functionalButtonData, idx) => (
                <FunctionalButton key={`hex-functional-button-index-${idx}`} buttonData={functionalButtonData} />
            ))}
        </div>
    );
};

export default FunctionalButtons;

const FunctionalButton: FC<{
    buttonData: FunctionalButtonRouteData;
}> = memo(({ buttonData }) => {
    const { name, target, svgIconPath } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);
    const { position, rotation, scale, isHalf, counterRotate } = buttonData[routeName];

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(() => {
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize);
        // }
    }, [position, rotation, scale, isHalf, containerSize]);

    return (
        <GlassmorphicButtonWrapper
            name={name}
            style={{ ...cssVariables_Memo }}
            isRouteNavigation={false}
            clickHandler={handleClick}
            lightingGradient
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
