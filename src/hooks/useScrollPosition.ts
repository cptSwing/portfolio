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

const useScrollPosition = (
    cardNumber: number,
    cardHeight_Pixel: number,
    containerHeight_Pixel: number,
    postCardsParentHeight: number,
    containerScrollTop: number,
) => {
    const style = useMemo(() => {
        const distanceToTopWithOwnHeight = cardHeight_Pixel * (cardNumber + 1);
        // const top = containerHeight_Pixel - cardHeight_Pixel;
        const top = postCardsParentHeight - cardHeight_Pixel;

        console.log(
            '%c[useScrollPosition]',
            'color: #f301e5',
            `cardNumber, cardHeight_Pixel, containerHeight_Pixel, postCardsParentHeight :`,
            cardNumber,
            cardHeight_Pixel,
            containerHeight_Pixel,
            postCardsParentHeight,
        );

        if (typeof top === 'number' && typeof containerHeight_Pixel === 'number') {
            let positionState = PostCardPositionState.WAITING;
            let styleProperties: CSSProperties;

            if (cardHeight_Pixel * distanceToTopWithOwnHeight < containerHeight_Pixel - cardHeight_Pixel) {
                positionState = PostCardPositionState.FINISHED;
            } else if (cardHeight_Pixel * distanceToTopWithOwnHeight < containerHeight_Pixel - 10) {
                positionState = PostCardPositionState.MOVETO;
            } else if (cardHeight_Pixel * distanceToTopWithOwnHeight < containerHeight_Pixel) {
                positionState = PostCardPositionState.START;
            }

            switch (positionState) {
                case PostCardPositionState.START:
                    styleProperties = { left: 0, top: top };
                    break;
                case PostCardPositionState.MOVETO:
                    styleProperties = { left: 'calc(100% - var(--card-width))', top: top };
                    break;
                case PostCardPositionState.FINISHED:
                    styleProperties = { left: 'calc(100% - var(--card-width))', bottom: 'auto', top: distanceToTopWithOwnHeight };
                    break;

                // WAITING
                default:
                    styleProperties = { left: 'calc(var(--card-width) * -1)', top: top };
                    break;
            }
            return styleProperties;
        }
    }, [cardHeight_Pixel, cardNumber, containerHeight_Pixel, postCardsParentHeight]);

    return style;
};

export default useScrollPosition;

enum PostCardPositionState {
    WAITING = 'Waiting',
    START = 'Start',
    MOVETO = 'MoveTo',
    FINISHED = 'Finished',
}
