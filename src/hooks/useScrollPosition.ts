import { CSSProperties, useMemo } from 'react';

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

const useScrollPosition = (
    cardNumber: number,
    cardWidth: number,
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
    const leftOffscreen = useMemo(() => -(cardWidth + paddingRight + cardOutline), [cardWidth, paddingRight, cardOutline]);
    const leftEnd = useMemo(() => postCardsParentWidth - cardWidth - cardOutline - paddingRight, [postCardsParentWidth, cardOutline, cardWidth, paddingRight]);
    const topWaiting = useMemo(() => postCardsParentHeight - (totalCardHeight - paddingTop), [postCardsParentHeight, paddingTop, totalCardHeight]);

    const thisOffsetTop = useMemo(() => positionTopStart - scrollContainerTop, [positionTopStart, scrollContainerTop]);

    const [positionState, leftProgress] = useMemo(() => {
        // How far this card is from postCardsParent.top
        let topProgressPercentage = 0;
        let leftProgress = 0;

        let positionState = PostCardPositionState.WAITING;
        if (thisOffsetTop < topWaiting) {
            // ^ this card fits into postCardsParent, one card.height distance to postCardsParent.bottom
            positionState = PostCardPositionState.FINISHED;
        } else if (thisOffsetTop < postCardsParentHeight) {
            // ^ this card sits at postCardsParent.bottom
            positionState = PostCardPositionState.MOVETO;
            topProgressPercentage = Math.round(percentageFromValue(postCardsParentHeight, topWaiting, thisOffsetTop));
            leftProgress = Math.round(valueFromPercentage(leftOffscreen, leftEnd, topProgressPercentage));
        }

        return [positionState, leftProgress];
    }, [thisOffsetTop, topWaiting, postCardsParentHeight, leftOffscreen, leftEnd]);

    const waitingStyle_Memo = useMemo(() => ({ left: leftOffscreen, top: topWaiting }), [leftOffscreen, topWaiting]);
    const moveToStyle_Memo = useMemo(() => ({ left: leftProgress, top: topWaiting }), [leftProgress, topWaiting]);
    const finishedStyle_Memo = useMemo(() => ({ left: leftEnd, top: thisOffsetTop }), [leftEnd, thisOffsetTop]);

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
