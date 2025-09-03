import { CSSProperties, FC, useEffect, useState } from 'react';
import { Post } from '../types/types';
import CatCard from './CategoryCard';
import { usePreviousPersistent } from '../hooks/usePrevious';

const Carousel: FC<{ posts: Post[]; flipIndexState: [number, React.Dispatch<React.SetStateAction<number>>]; direction: 'down' | 'up' | null }> = ({
    posts,
    flipIndexState,
}) => {
    const [flipIndex] = flipIndexState;
    const prevFlipIndex = usePreviousPersistent(flipIndex);

    const cellCount = posts.length;
    const cellSize = 200;
    const radius = Math.round(cellSize / 2 / Math.tan(Math.PI / cellCount));

    const [rotation, setRotation] = useState(0);
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        if (prevFlipIndex !== null && prevFlipIndex !== flipIndex) {
            setRotation((oldRotation) => {
                const directionDistance = getDirection(prevFlipIndex, flipIndex, cellCount);

                if (directionDistance) {
                    const [direction, distance] = directionDistance;
                    setDistance(distance);
                    const theta = 360 / cellCount;

                    return oldRotation + (direction === 'down' ? -distance : distance) * theta;
                } else {
                    return oldRotation;
                }
            });
        }
    }, [flipIndex, prevFlipIndex, cellCount]);

    return (
        <div
            className="relative size-full [perspective-origin:center_180%] [perspective:2000px]"
            style={
                {
                    // width: cellSize * 1 + 'px',
                } as CSSProperties
            }
        >
            <div
                className="absolute h-4/5 w-full transition-transform [transform-style:preserve-3d]"
                style={
                    {
                        // '--carousel-radius': radius + 'px',
                        '--carousel-radius': 35 + 'vw',
                        'transform': 'translateZ(calc(var(--carousel-radius) * -1)) translateY(12.5%) rotateY(var(--carousel-rotation)) ',
                        // '--carousel-radius': 100 + '%',
                        // 'transform': 'translateY(calc(var(--carousel-radius) * -0.75)) rotateZ(var(--carousel-rotation)) ',

                        '--carousel-card-percentage': 1 / Math.ceil(posts.length / 2),
                        '--carousel-rotation': `${rotation}deg`,
                        'transitionDuration': `calc(var(--ui-animation-menu-transition-duration) + ${distance} * 50ms)`,
                    } as CSSProperties
                }
            >
                {posts.map((post, idx, arr) => (
                    <CatCard key={post.id} post={post} cardIndex={idx} cardCount={arr.length} flipIndexState={flipIndexState} />
                ))}
            </div>
        </div>
    );
};

export default Carousel;

function getDirection(previousIndex: number, nextIndex: number, length: number): ['up' | 'down', number] {
    const forwardDistance = (nextIndex - previousIndex + length) % length;
    const backwardDistance = (previousIndex - nextIndex + length) % length;

    const direction = forwardDistance <= length / 2 ? 'down' : 'up';
    const distance = direction === 'down' ? forwardDistance : backwardDistance;
    return [direction, distance];
}

function _getFlipIndexFromRotation(rotation: number, cellCount: number) {
    const theta = 360 / cellCount;
    return Math.abs(rotation / theta) % cellCount;
}
