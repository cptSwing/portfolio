import { FC } from 'react';
import classNames from '../lib/classNames';

const testHorizontal = false;

const MotionBlurImage: FC<{ isAtFront: boolean; imgUrl?: string; altText: string }> = ({ isAtFront, imgUrl = 'images/utility/1x1.png', altText }) => {
    return (
        <>
            {/* Blurred Image */}
            <div
                className={classNames(
                    'absolute size-full origin-center blur-lg',
                    testHorizontal ? 'scale-x-[4] scale-y-[0.001]' : 'scale-x-[0.001] scale-y-[4]',
                )}
                style={
                    {
                        // filter: `blur(${springValue_Ref.current > 0 ? 12 : 0}px)`,
                        // filter: `blur(${springValue_Ref.current * 12}px)`,
                        // transitionDuration: `${ 500 * ( 1 - springValue_Ref.current ) }ms`
                    }
                }
            >
                <LoadImage
                    imgUrl={imgUrl}
                    altText={altText}
                    additionalClassNames={classNames(
                        testHorizontal ? 'scale-x-[calc(1/4)] scale-y-[1000] clip-inset-l-1/4' : 'scale-y-[calc(1/4)] scale-x-[1000] clip-inset-t-1/4',
                    )}
                />
            </div>

            {/* Original Image */}
            <LoadImage
                imgUrl={imgUrl}
                altText={altText}
                additionalClassNames={classNames(
                    ' outline outline-1  transition-[outline-offset,outline-color]  delay-[--card-title-anim-delay] duration-[--card-title-anim-duration]',
                    'hover-active:-outline-offset-1 hover-active:outline-[--color-primary-inactive-cat-bg] hover-active:delay-0 hover-active:duration-[--card-image-anim-duration-hover]',
                    isAtFront
                        ? '-outline-offset-1 outline-[--color-primary-inactive-cat-bg]'
                        : 'outline-offset-[length:--card-titles-inset-padding] outline-transparent',
                )}
            />
        </>
    );
};

export default MotionBlurImage;

const LoadImage: FC<{ imgUrl: string; altText: string; additionalClassNames?: string }> = ({ imgUrl, altText, additionalClassNames = '' }) => {
    return (
        <img
            // TODO add fixed image sizes here?
            className={'absolute size-full rounded-[--card-border-radius] object-cover object-center drop-shadow-md' + ' ' + additionalClassNames}
            src={imgUrl}
            alt={altText}
        />
    );
};
