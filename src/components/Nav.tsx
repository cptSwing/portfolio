import { DataBase, Post } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.ts';
import { PostCards } from './PostCards.tsx';
import { useDebugButton } from '../hooks/useDebugButton.ts';
import { MENU_CATEGORY } from '../types/enums.ts';
import Markdown from 'react-markdown';
import { CodeBracketSquareIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';

const themeBgBase = resolveConfig(tailwindConfig).theme.colors.theme.bg.base;
const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Nav = () => {
    const { catId, postId } = useParams();

    return (
        <nav
            className={classNames(
                'mx-auto grid h-full transition-[width,grid-template-columns,column-gap] duration-700',
                catId ? 'nav-checked-width gap-x-px' : 'nav-unchecked-width gap-x-1',
                postId ? 'absolute left-0 right-0 -z-10' : 'z-0 block',
            )}
            style={{
                gridTemplateColumns: categoriesArray.map(({ id }) => (id.toString() === catId ? '15fr' : '1fr')).join(' '),
            }}
        >
            {categoriesArray.map((cardData) => (
                <CategoryCard key={cardData.categoryTitle} cardData={cardData} />
            ))}
        </nav>
    );
};

export default Nav;

const CategoryCard: FC<{
    cardData: DataBase[MENU_CATEGORY];
}> = ({ cardData }) => {
    const { id, categoryTitle, posts, categoryCardBackgroundImage, categoryBackgroundColor, categoryBlurb } = cardData;

    const navigate = useNavigate();
    const { catId } = useParams();

    const refCb = useCallback(
        (elem: HTMLDivElement | null) => {
            if (elem) {
                setTimeout(() => {
                    /* Mount sequentially for staggered dropdown */
                    elem.style.removeProperty('display');
                    elem.style.setProperty('animation', '1s 1s forwards streak-down');
                    elem.addEventListener('animationend', () => {
                        elem.style.removeProperty('animation');
                        elem.style.removeProperty('opacity');
                    });
                }, 500 * id);
            }
        },
        [id],
    );

    const isThisCategoryOpen = useMemo(() => (catId ? parseInt(catId) === id : false), [catId, id]);

    const paddingStyle_Memo = useMemo(() => {
        if (catId && !isThisCategoryOpen) {
            const openedIndex = catId ? parseInt(catId) : null;
            if (id < openedIndex!) {
                return { paddingRight: 0 };
            } else if (id > openedIndex!) {
                return { paddingLeft: 0 };
            }
        }
    }, [isThisCategoryOpen, catId, id]);

    const [bgColorSwitch, setBgColorSwitch] = useState(false);
    useDebugButton(`Toggle Category BG Color Switch ${categoryTitle}`, () => setBgColorSwitch((state) => !state), !!categoryBackgroundColor);

    /* Change background color, possibly later also parts of header (and turn into a hook then?) */
    useEffect(() => {
        const docStyle = document.body.style;

        if (catId && bgColorSwitch) {
            if (isThisCategoryOpen) {
                if (categoryBackgroundColor) {
                    docStyle.setProperty('--bg-color', categoryBackgroundColor);
                } else {
                    docStyle.setProperty('--bg-color', themeBgBase);
                }
            }
        } else {
            docStyle.setProperty('--bg-color', themeBgBase);
        }
    }, [bgColorSwitch, catId, isThisCategoryOpen, categoryBackgroundColor]);

    return (
        <div
            ref={refCb}
            /* NOTE Fixed Widths (opened) of Category Card here! */
            className={classNames(
                'group/category pointer-events-auto relative flex transform-gpu cursor-pointer items-end justify-between gap-x-4 overflow-hidden p-6 transition-[background-color,margin,transform] duration-[50ms,500ms,500ms]',
                isThisCategoryOpen
                    ? '!scale-y-100 bg-theme-primary-300'
                    : catId
                      ? 'scale-y-[.99] bg-theme-primary-600 hover:bg-theme-primary-500'
                      : 'scale-y-100 bg-theme-primary-600 hover:bg-theme-primary-200',
            )}
            onClick={() => {
                navigate(catId === id.toString() ? '/' : `/${id}`);
            }}
            style={{
                ...paddingStyle_Memo,
                // Both removed after initial mount:
                display: 'none',
                opacity: 0,
            }}
        >
            <h1
                className={classNames(
                    'writing-mode-vert-lr mx-auto -mb-1 min-h-full rotate-180 transform-gpu select-none whitespace-nowrap font-protest-riot text-5xl leading-none drop-shadow-lg transition-[transform,color] duration-300',
                    isThisCategoryOpen
                        ? 'text-theme-secondary-400'
                        : catId
                          ? 'translate-y-0 scale-90 text-theme-secondary-700 group-hover/category:text-theme-secondary-400 group-hover/category:!duration-0'
                          : 'translate-y-0 text-theme-secondary-100 group-hover/category:text-theme-secondary-400 group-hover/category:!duration-0',
                )}
            >
                {categoryTitle}
            </h1>

            {/* Testimonials etc: */}
            <div
                className={classNames(
                    'relative -my-2 flex basis-1/2 items-end overflow-hidden border-l-[6px] border-theme-neutral-50 transition-[height] duration-300',
                    isThisCategoryOpen ? 'h-full' : catId ? 'h-0' : 'h-0 group-hover/category:!h-1/4',
                )}
            >
                <div
                    className={classNames(
                        'z-10 select-none text-pretty px-4 font-besley text-4xl italic text-theme-accent-400 transition-transform duration-300',
                        isThisCategoryOpen ? 'translate-x-0 delay-500 duration-300' : '-translate-x-[200%] delay-0 duration-0',
                    )}
                >
                    <Markdown className='mrkdwn'>{categoryBlurb}</Markdown>
                </div>
                <div className='absolute opacity-10 mask-edges-24'>
                    <div className='bg-cover' style={{ backgroundImage: `url('${categoryCardBackgroundImage}')` }} />
                </div>
            </div>

            {isThisCategoryOpen && <PostCards posts={posts} />}
        </div>
    );
};

/** Used in Content.tsx */
export const MenuOpenedPost: FC<{
    hasImages: boolean;
    codeLink: Post['codeLink'];
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
    classNames?: string;
}> = ({ hasImages, codeLink, setLightboxTo, classNames }) => {
    const navigate = useNavigate();

    return (
        <div className={`pointer-events-auto ml-auto flex h-6 justify-end space-x-1 ${classNames}`}>
            {hasImages && (
                <button
                    type='button'
                    className='cursor-pointer bg-theme-primary-500 px-2 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-1 before:leading-none before:text-theme-secondary-50 before:transition-transform before:duration-100 first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:before:translate-y-0 hover:before:content-["Gallery"]'
                    onClick={() => setLightboxTo(0)}
                >
                    <PhotoIcon className='aspect-square h-full stroke-theme-accent-600 hover:stroke-theme-accent-800' />
                </button>
            )}

            {codeLink && (
                <a
                    className='group inline-block cursor-pointer bg-theme-primary-500 px-2 py-0.5 transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-1 before:text-sm before:uppercase before:leading-none before:text-theme-secondary-50 before:transition-transform before:duration-100 after:content-none first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:no-underline hover:before:translate-y-0 hover:before:content-["View_Code"]'
                    href={codeLink.href}
                    target='_blank'
                    rel='noreferrer'
                >
                    <CodeBracketSquareIcon className='aspect-square h-full stroke-theme-accent-600 hover:stroke-theme-accent-800' />
                    <span className='absolute right-4 top-full z-50 mt-2 -translate-y-full cursor-default whitespace-nowrap text-right text-sm leading-tight text-theme-primary-50 transition-[transform,clip-path] delay-200 duration-500 clip-inset-t-full group-hover:translate-y-0 group-hover:clip-inset-t-0'>
                        {codeLink.alt}
                    </span>
                </a>
            )}

            {/* TODO fade out instead of instantly closing */}
            <button
                type='button'
                className='cursor-pointer bg-theme-primary-500 p-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-1 before:leading-none before:text-theme-secondary-50 before:transition-transform before:duration-100 first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:before:translate-y-0 hover:before:content-["Close"]'
                onClick={() => {
                    navigate(-1);
                }}
            >
                <XMarkIcon className='aspect-square h-full stroke-theme-accent-600 hover:stroke-theme-accent-800' />
            </button>
        </div>
    );
};
