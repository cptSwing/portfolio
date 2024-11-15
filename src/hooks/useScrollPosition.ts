import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useScroll } from 'react-use';

/**
 * states:
 *
 * name 				| desc					| how?
 * -----------------------------------------------------------------------------------------------------------
 * waiting				| off-view				| !intersecting, left: parent.left (-width), parent.bottom 0
 * start 				| start pos 			| intersecting, left: parent.left 0, "
 * Moving				| end pos 				| intersecting, left: parent.left 100% - width, "
 * Finished				| back 2 regular flow	| hasIntersected (set when outside of observer window), top: parent.top + (height * index)
 */

const useScrollPosition = (cardNumber: number, cardHeight_Pixel: number, containerRef: React.MutableRefObject<HTMLDivElement | null>) => {
    const { y } = useScroll(containerRef);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        if (containerRef.current && !containerHeight) {
            setContainerHeight(containerRef.current?.getBoundingClientRect().height);
        }
    });

    const style = useMemo(() => {
        const distanceToTopWithOwnHeight_Memo = cardHeight_Pixel * (cardNumber + 1);
        const top_Memo = containerHeight - cardHeight_Pixel;

        if (typeof top_Memo === 'number' && typeof containerHeight === 'number') {
            let positionState = PostCardPositionState.WAITING;
            let styleProperties: CSSProperties;

            if (cardHeight_Pixel * distanceToTopWithOwnHeight_Memo < containerHeight - cardHeight_Pixel) {
                positionState = PostCardPositionState.FINISHED;
            } else if (cardHeight_Pixel * distanceToTopWithOwnHeight_Memo < containerHeight - 10) {
                positionState = PostCardPositionState.MOVETO;
            } else if (cardHeight_Pixel * distanceToTopWithOwnHeight_Memo < containerHeight) {
                positionState = PostCardPositionState.START;
            }

            switch (positionState) {
                case PostCardPositionState.START:
                    styleProperties = { left: 0, top: top_Memo };
                    break;
                case PostCardPositionState.MOVETO:
                    styleProperties = { left: 'calc(100% - var(--card-width))', top: top_Memo };
                    break;
                case PostCardPositionState.FINISHED:
                    styleProperties = { left: 'calc(100% - var(--card-width))', bottom: 'auto', top: distanceToTopWithOwnHeight_Memo };
                    break;

                // WAITING
                default:
                    styleProperties = { left: 'calc(var(--card-width) * -1)', top: top_Memo };
                    break;
            }
            return styleProperties;
        }
    }, [cardHeight_Pixel, cardNumber, containerHeight]);

    return style;
};

export default useScrollPosition;

enum PostCardPositionState {
    WAITING = 'Waiting',
    START = 'Start',
    MOVETO = 'MoveTo',
    FINISHED = 'Finished',
}
