import { CSSProperties, useMemo, useRef } from 'react';

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
const paddingValue = 0;

const useScrollPosition = (
    cardNumber: number,
    cardWidth: number,
    cardHeight: number,
    postCardsParentWidth: number,
    postCardsParentHeight: number,
    scrollContainerTop: number,
    scrollContainerHeight: number,
) => {
    const positionTopStart = useMemo(() => cardHeight * cardNumber, [cardHeight, cardNumber]);
    const positionTopEnd = useMemo(() => positionTopStart + cardHeight, [positionTopStart, cardHeight]);
    const leftOffscreen = useMemo(() => -cardWidth, [cardWidth]);
    const leftEnd = useMemo(() => postCardsParentWidth - cardWidth, [postCardsParentWidth, cardWidth]);
    const leftStart = useMemo(() => postCardsParentWidth - cardWidth * 2, [postCardsParentWidth, cardWidth]);
    const topWaiting = useMemo(() => postCardsParentHeight - cardHeight, [postCardsParentHeight, cardHeight]);

    const isMoving = useRef(false);

    const styleState = useMemo(() => {
        const thisOffsetTop = positionTopStart - scrollContainerTop;

        let topProgressPercentage = 0;
        let leftProgress = 0;

        let positionState;
        if (thisOffsetTop < postCardsParentHeight - cardHeight) {
            positionState = PostCardPositionState.FINISHED;
        } else if (thisOffsetTop < scrollContainerTop) {
            positionState = PostCardPositionState.MOVETO;

            isMoving.current = true;

            topProgressPercentage = Math.round(percentageFromValue(positionTopStart, positionTopEnd, scrollContainerTop));
            leftProgress = Math.round(valueFromPercentage(leftStart, leftEnd, topProgressPercentage));

            if (topProgressPercentage >= 100) {
                isMoving.current = false;
            }
        } else {
            positionState = PostCardPositionState.WAITING;
        }

        let styleProperties: CSSProperties = {};

        switch (positionState) {
            case PostCardPositionState.WAITING:
                styleProperties = { left: leftOffscreen + 'px', top: topWaiting };
                break;
            case PostCardPositionState.MOVETO:
                styleProperties = { left: leftStart + 'px', top: topWaiting };
                break;
            case PostCardPositionState.FINISHED:
                styleProperties = { left: leftEnd + 'px', top: thisOffsetTop };
                break;
        }

        if (cardNumber === 3) {
            console.log(
                '%c[useScrollPosition]',
                'color: #39539d',
                `${cardNumber} (${positionState}) --> positionTopStart: ${positionTopStart}, positionTopEnd: ${positionTopEnd}, scrollContainerTop:`,
                scrollContainerTop,
            );

            console.log(
                '%c[useScrollPosition]',
                'color: #aa589a',
                `${cardNumber} (${positionState}) --> postCardsParentHeight: ${postCardsParentHeight}, scrollContainerHeight ${scrollContainerHeight}, thisOffsetTop :`,
                thisOffsetTop,
            );
        }

        return [styleProperties, positionState];
    }, [
        cardNumber,
        cardHeight,
        positionTopStart,
        topWaiting,
        positionTopEnd,
        leftOffscreen,
        scrollContainerTop,
        scrollContainerHeight,
        postCardsParentHeight,
        leftStart,
        leftEnd,
    ]);

    return styleState as [CSSProperties, PostCardPositionState];
};

export default useScrollPosition;

const percentageFromValue = (rangeMin: number, rangeMax: number, value: number) => ((value - rangeMin) / (rangeMax - rangeMin)) * 100;
const valueFromPercentage = (rangeMin: number, rangeMax: number, percentage: number) => ((rangeMax - rangeMin) / 100) * percentage + rangeMin;

console.log('%c[useScrollPosition]', 'color: #d86f53', `percentageFromValue() :`, percentageFromValue(100, 300, 150));

enum PostCardPositionState {
    WAITING = 'Waiting',
    MOVETO = 'MoveTo',
    FINISHED = 'Finished',
}
