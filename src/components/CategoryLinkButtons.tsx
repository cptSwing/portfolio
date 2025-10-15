import { classNames } from 'cpts-javascript-utilities';
import { CSSProperties, FC, useState } from 'react';
import { CategoryName, TransitionTargetReached, RotateShortestDistance } from '../types/types';
import { categoryLinkButtonElements } from '../lib/hexagonElements';
import { CategoryLinkButton } from './HexagonShapeButtons';

const CategoryLinkButtons: FC<{
    homeMenuTransitionStateUpdates: [
        [CategoryName | null, TransitionTargetReached, RotateShortestDistance],
        React.Dispatch<React.SetStateAction<[CategoryName | null, TransitionTargetReached, RotateShortestDistance]>>,
    ];
}> = ({ homeMenuTransitionStateUpdates }) => {
    const [positionOnCategoryLinks, setPositionOnCategoryLinks] = useState<[string, string]>(['-100px', '-86.6px']);

    return (
        <div
            className={classNames('absolute z-20 size-[inherit]')}
            style={
                {
                    '--menu-bar-mask-marker-position-x': positionOnCategoryLinks[0],
                    '--menu-bar-mask-marker-position-y': positionOnCategoryLinks[1],
                } as CSSProperties
            }
        >
            {categoryLinkButtonElements.map((categoryLinkButtonData, idx) => (
                <CategoryLinkButton
                    key={`hex-category-link-button-index-${idx}`}
                    buttonData={categoryLinkButtonData}
                    homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates}
                    setPositionOnCategoryLinks={setPositionOnCategoryLinks}
                />
            ))}
        </div>
    );
};

export default CategoryLinkButtons;
