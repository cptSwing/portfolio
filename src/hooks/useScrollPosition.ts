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
    cardHeight_Pixel: number,
    containerHeight_Pixel: number,
    postCardsParentHeight: number,
    containerScrollTop: number,
) => {
    const styleState = useMemo(() => {
        const thisOffsetTop = cardHeight_Pixel * cardNumber - containerScrollTop;
        const topWaiting = postCardsParentHeight - cardHeight_Pixel;
        const paddingValue = 30;

        let positionState: PostCardPositionState;
        let styleProperties: CSSProperties;

        if (thisOffsetTop > postCardsParentHeight - cardHeight_Pixel) {
            positionState = PostCardPositionState.WAITING;
        } else if (
            thisOffsetTop >= postCardsParentHeight - (cardHeight_Pixel - paddingValue) ||
            thisOffsetTop >= postCardsParentHeight - (cardHeight_Pixel + paddingValue)
        ) {
            console.log(
                '%c[useScrollPosition]',
                'color: #f92994',
                `index ${cardNumber} --> ${thisOffsetTop} === ${postCardsParentHeight} - ${cardHeight_Pixel} = ${thisOffsetTop === postCardsParentHeight - cardHeight_Pixel} --> thisOffsetTop, postCardsParentHeight, cardHeight_Pixel :`,
                thisOffsetTop,
                postCardsParentHeight,
                cardHeight_Pixel,
            );
            positionState = PostCardPositionState.MOVETO;
        } else if (thisOffsetTop < postCardsParentHeight - cardHeight_Pixel) {
            positionState = PostCardPositionState.FINISHED;
        } else {
            positionState = PostCardPositionState.NONE;
        }

        switch (positionState) {
            case PostCardPositionState.WAITING:
                styleProperties = { left: 'calc(var(--card-width) * -1)', top: topWaiting };
                break;
            case PostCardPositionState.MOVETO:
                styleProperties = { left: 'calc(100% - (var(--card-width) + (3 * var(--card-outline-width)))', top: topWaiting };
                break;
            case PostCardPositionState.FINISHED:
                styleProperties = { left: 'calc(100% - (var(--card-width) + (3 * var(--card-outline-width)))', top: thisOffsetTop };
                break;
        }

        return [styleProperties, positionState];
    }, [cardHeight_Pixel, cardNumber, postCardsParentHeight, containerScrollTop]);

    return styleState as [CSSProperties, PostCardPositionState];
};

export default useScrollPosition;

enum PostCardPositionState {
    NONE = 'None',
    WAITING = 'Waiting',
    MOVETO = 'MoveTo',
    FINISHED = 'Finished',
}
