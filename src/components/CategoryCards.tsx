import { CSSProperties, FC, useContext, useMemo } from 'react';
import { calcCSSVariables, degToRad, postCardHexagons } from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { HexagonRouteData, Post } from '../types/types';
import { classNames } from 'cpts-javascript-utilities';
import { ROUTE } from '../types/enums';
import { config } from '../types/exportTyped';

const { clipPathWidth, clipPathHeight } = config.ui.hexMenu;

const numExtraHexagons = 9;
const tan60 = Math.tan(degToRad(60));

const CategoryCards: FC<{ posts: Post[] }> = ({ posts }) => {
    const containerSize = useContext(GetChildSizeContext);
    const routeName = useZustand((store) => store.values.routeData.name);

    const postCards_Memo = useMemo(() => {
        if (posts.length > 1 && postCardHexagons[0]) {
            const newPostCards = [postCardHexagons[0]];

            const { position, scale } = postCardHexagons[0][routeName];

            const activeHexagonWidthInViewBox = clipPathWidth * scale;
            const activeHexagonHeightInViewBox = clipPathHeight * scale;

            const activeHexagonQuarterWidth = activeHexagonWidthInViewBox / 4;
            const activeHexagonHalfHeight = activeHexagonHeightInViewBox / 2;

            const inactiveHexagonWidth = clipPathWidth * (scale / numExtraHexagons);
            const inactiveHexagonHeight = clipPathHeight * (scale / numExtraHexagons);

            const inactiveHexagonOffset = Math.min(inactiveHexagonHeight, (activeHexagonHalfHeight - inactiveHexagonHeight) / (posts.length - 1));

            for (let i = 1; i < posts.length; i++) {
                const additionalHexagonStartingPositionY = inactiveHexagonOffset * (i - 1);
                const additionalHexagonStartingPositionX =
                    additionalHexagonStartingPositionY / tan60 + position.x + activeHexagonQuarterWidth + inactiveHexagonWidth;

                newPostCards.push({
                    [ROUTE.home]: {
                        position: {
                            x: 275,
                            y: 186.6,
                        },
                        rotation: 60,
                        isHalf: false,
                        scale: 0,
                        shouldOffset: false,
                    },
                    [ROUTE.category]: {
                        position: {
                            x: additionalHexagonStartingPositionX,
                            y: additionalHexagonStartingPositionY,
                        },
                        rotation: 0,
                        isHalf: false,
                        scale: scale / numExtraHexagons,
                        shouldOffset: false,
                    },
                    [ROUTE.post]: {
                        position: {
                            x: 75,
                            y: 173.2,
                        },
                        rotation: 0,
                        isHalf: false,
                        scale: 0,
                        shouldOffset: false,
                    },
                });
            }

            return newPostCards;
        }

        return postCardHexagons;
    }, [posts.length, routeName]);

    return postCards_Memo.map((hexagonPostCardData, idx) =>
        posts[idx] ? (
            <PostHexagonDiv
                key={`hex-post-card-index-${idx}`}
                shapeData={hexagonPostCardData}
                post={posts[idx]}
                containerSize={containerSize}
                cardIndex={idx}
            />
        ) : null,
    );
};

export default CategoryCards;

const PostHexagonDiv: FC<{
    shapeData: HexagonRouteData;
    post: Post;
    containerSize: {
        width: number;
        height: number;
    };
    cardIndex: number;
}> = ({ shapeData, post, containerSize, cardIndex }) => {
    const routeName = useZustand((store) => store.values.routeData.name);
    const { position, rotation, scale } = shapeData[routeName];
    const { id, title, subTitle, cardImage } = post;

    const cssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(position, rotation, scale, containerSize, {
                strokeWidth: 0,
            }),
        [position, rotation, scale, containerSize],
    );

    return (
        <div
            className={classNames(
                'before:pointer-events-none before:absolute before:left-0 before:top-0 before:size-full before:bg-theme-secondary-lighter before:[clip-path:--hexagon-clip-path]',
                'pointer-events-auto absolute inset-[1px] aspect-hex-flat w-[--hexagon-clip-path-width] origin-center transform-gpu drop-shadow-omni-lg transition-transform duration-[--ui-animation-menu-transition-duration]',
                cardIndex === 0 ? 'cursor-pointer grayscale-0' : 'cursor-zoom-in grayscale hover-active:z-50 hover-active:grayscale-0',
            )}
            style={
                {
                    ...cssVariables_Memo,
                } as CSSProperties
            }
        >
            <img
                src={cardImage}
                alt={title}
                className={classNames(
                    'size-full transform-gpu object-cover [clip-path:--hexagon-clip-path]',
                    cardIndex === 0 ? 'scale-[0.98]' : 'scale-[0.925]',
                )}
            />
        </div>
    );
};
