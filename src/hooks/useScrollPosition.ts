import { CSSProperties, useMemo } from 'react';

/**
 * states:
 *
 * name 				| desc					| how?
 * -----------------------------------------------------------------------------------------------------------
 * waiting				| off-view				| !intersecting, left: parent.left (-width), parent.outlineByFour 0
 * start 				| start pos 			| intersecting, left: parent.left 0, "
 * Moving				| end pos 				| intersecting, left: parent.left 100% - width, "
 * Finished				| back 2 regular flow	| hasIntersected (set when outside of observer window), top: parent.top + (height * index)
 */

const useScrollPosition = (
    cardNumber: number,
    cardHeight: number,
    cardOutline: number,
    spacingY: number,
    paddingTop: number,
    paddingRight: number,
    postCardsParentWidth: number,
    postCardsParentHeight: number,
    scrollContainerTop: number,
) => {
    const totalCardHeight = useMemo(() => cardHeight + spacingY + cardOutline, [cardHeight, cardOutline, spacingY]);
    const positionTopStart = useMemo(() => paddingTop + (cardOutline + totalCardHeight * cardNumber), [paddingTop, cardOutline, totalCardHeight, cardNumber]);
    const topWaiting = useMemo(() => postCardsParentHeight - (totalCardHeight - paddingTop), [postCardsParentHeight, paddingTop, totalCardHeight]);

    const outlineByFour = useMemo(() => cardOutline * 4, [cardOutline]);
    const rightOffScreen = useMemo(() => postCardsParentWidth + paddingRight + outlineByFour, [postCardsParentWidth, paddingRight, outlineByFour]);

    const thisOffsetTop = useMemo(() => positionTopStart - scrollContainerTop, [positionTopStart, scrollContainerTop]);

    const [positionState, topProgressPercentage] = useMemo(() => {
        // How far this card is from postCardsParent.top
        let topProgressPercentage = 0;

        let positionState = PostCardPositionState.WAITING;
        if (thisOffsetTop < topWaiting) {
            // ^ this card fits into postCardsParent, one card.height distance to postCardsParent.bottom
            positionState = PostCardPositionState.FINISHED;
        } else if (thisOffsetTop < postCardsParentHeight) {
            // ^ this card sits at postCardsParent.bottom
            positionState = PostCardPositionState.MOVETO;

            topProgressPercentage = percentageFromValue(postCardsParentHeight, topWaiting, thisOffsetTop);
        }

        return [positionState, topProgressPercentage];
    }, [thisOffsetTop, topWaiting, postCardsParentHeight]);

    const waitingStyle_Memo = useMemo(
        () => ({
            right: rightOffScreen,
            bottom: outlineByFour,
            position: 'absolute',
            // pointerEvents: 'none',
            opacity: 0.2,
            filter: 'blur(2px) brightness(.85)',
        }),
        [rightOffScreen, outlineByFour],
    );
    const moveToStyle_Memo = useMemo(
        () => ({
            right: valueFromPercentage(rightOffScreen, paddingRight + cardOutline, topProgressPercentage),
            bottom: outlineByFour,
            position: 'absolute',
            // pointerEvents: 'none',
            opacity: Math.max(0.2, Math.min(topProgressPercentage / 100, 0.75)),
            filter: 'blur(2px) brightness(.85)',
        }),
        [topProgressPercentage, rightOffScreen, paddingRight, cardOutline, outlineByFour],
    );
    const finishedStyle_Memo = useMemo(
        () => ({ paddingTop: (cardNumber === 0 ? 0 : spacingY) + outlineByFour, paddingRight: cardOutline * 2 }),
        [cardNumber, cardOutline, outlineByFour, spacingY],
    );

    const styles = useMemo(() => {
        switch (positionState) {
            case PostCardPositionState.WAITING:
                return waitingStyle_Memo;
            case PostCardPositionState.MOVETO:
                return moveToStyle_Memo;
            case PostCardPositionState.FINISHED:
                return finishedStyle_Memo;
        }
    }, [finishedStyle_Memo, moveToStyle_Memo, positionState, waitingStyle_Memo]) as CSSProperties;

    return styles;
};

export default useScrollPosition;

const percentageFromValue = (rangeMin: number, rangeMax: number, value: number) => ((value - rangeMin) / (rangeMax - rangeMin)) * 100;
const valueFromPercentage = (rangeMin: number, rangeMax: number, percentage: number) => ((rangeMax - rangeMin) / 100) * percentage + rangeMin;

enum PostCardPositionState {
    WAITING = 'Waiting',
    MOVETO = 'MoveTo',
    FINISHED = 'Finished',
}
