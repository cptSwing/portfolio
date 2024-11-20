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
    cardWidth_Pixel: number,
    cardHeight_Pixel: number,
    postCardsParentWidth: number,
    postCardsParentHeight: number,
    containerScrollTop: number,
    containerHeight_Pixel: number,
) => {
    const positionTopStart = useMemo(() => cardHeight_Pixel * cardNumber, [cardHeight_Pixel, cardNumber]);
    const positionTopEnd = useMemo(() => positionTopStart + cardHeight_Pixel, [positionTopStart, cardHeight_Pixel]);
    const leftOffscreen = useMemo(() => -1000, [cardWidth_Pixel]);
    const leftEnd = useMemo(() => postCardsParentWidth - cardWidth_Pixel, [postCardsParentWidth, cardWidth_Pixel]);
    const leftStart = useMemo(() => postCardsParentWidth - cardWidth_Pixel * 2, [cardWidth_Pixel]);
    const topWaiting = useMemo(() => postCardsParentHeight - cardHeight_Pixel, [postCardsParentHeight, cardHeight_Pixel]);

    const isMoving = useRef(false);

    const styleState = useMemo(() => {
        const thisOffsetTop = positionTopStart - containerScrollTop;

        let topProgressPercentage = 0;
        let leftProgress = 0;

        let positionState;

        if (thisOffsetTop > postCardsParentHeight - cardHeight_Pixel && thisOffsetTop < postCardsParentHeight) {
            positionState = PostCardPositionState.MOVETO;

            isMoving.current = true;

            topProgressPercentage = Math.round(percentageFromValue(positionTopStart, positionTopEnd, containerScrollTop));
            leftProgress = Math.round(valueFromPercentage(leftStart, leftEnd, topProgressPercentage));

            console.log(
                '%c[useScrollPosition]',
                'color: #78fe1f',
                `${cardNumber} (${positionState}) --> topProgressPercentage, leftProgress :`,
                topProgressPercentage,
                leftProgress,
            );

            if (topProgressPercentage >= 100) {
                isMoving.current = false;
            }
        } else if (thisOffsetTop < postCardsParentHeight - cardHeight_Pixel) {
            positionState = PostCardPositionState.FINISHED;
        } else {
            positionState = PostCardPositionState.WAITING;
        }

        let styleProperties: CSSProperties = {};

        switch (positionState) {
            case PostCardPositionState.WAITING:
                styleProperties = { left: leftOffscreen + 'px', top: topWaiting };
                break;
            case PostCardPositionState.MOVETO:
                styleProperties = { left: leftProgress + 'px', top: topWaiting };
                break;
            case PostCardPositionState.FINISHED:
                styleProperties = { left: leftEnd + 'px', top: thisOffsetTop };
                break;
        }

        return [styleProperties, positionState];
    }, [cardNumber, positionTopStart, topWaiting, positionTopEnd, containerScrollTop, postCardsParentHeight, cardHeight_Pixel, leftStart, leftEnd]);

    return styleState as [CSSProperties, PostCardPositionState];
};

export default useScrollPosition;

const percentageFromValue = (rangeMin: number, rangeMax: number, value: number) => ((value - rangeMin) / (rangeMax - rangeMin)) * 100;
const valueFromPercentage = (rangeMin: number, rangeMax: number, percentage: number) => ((rangeMax - rangeMin) / 100) * percentage + rangeMin;

enum PostCardPositionState {
    WAITING = 'Waiting',
    MOVETO = 'MoveTo',
    FINISHED = 'Finished',
}
