import { classNames, keyDownA11y } from 'cpts-javascript-utilities';
import { FC, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Flipper, Flipped } from 'react-flip-toolkit';

const PortalExample: FC<{ icons: string[]; portalKey: string; title: string }> = ({ icons, portalKey, title }) => {
    const [focusedIcon, setFocusedIcon] = useState<number | boolean>(false);
    const [modalAnimatingOut, setModalAnimatingOut] = useState(false);

    function closeModal() {
        setFocusedIcon(false);
        setModalAnimatingOut(true);

        setTimeout(() => {
            setModalAnimatingOut(false);
        }, 1000);
    }

    const modalContainer_Ref = useRef<HTMLDivElement>(document.createElement('div'));

    useEffect(() => {
        const modalContainer = modalContainer_Ref.current;
        document.querySelector('body')?.appendChild(modalContainer);

        return () => {
            document.querySelector('body')?.removeChild(modalContainer);
        };
    }, []);

    return (
        <div className="icon-grid">
            <Flipper flipKey={focusedIcon} portalKey={portalKey}>
                <div>
                    <h2>{title}</h2>
                    <ul className="m-0 grid list-none grid-cols-2 gap-8 p-0">
                        {icons.map((icon, i) => {
                            if (i === focusedIcon && !modalAnimatingOut) {
                                return null;
                            } else {
                                return (
                                    <li key={icon + i} className="flex items-center justify-center">
                                        <Flipped flipId={`icon-${i}`} onStart={(el) => (el.style.zIndex = `${10}`)} onComplete={(el) => (el.style.zIndex = '')}>
                                            <img
                                                src={icon}
                                                className="h-auto w-full cursor-pointer"
                                                alt=""
                                                role="button"
                                                tabIndex={-1}
                                                onClick={() => {
                                                    setFocusedIcon(i);
                                                }}
                                                onKeyDown={keyDownA11y(() => {
                                                    setFocusedIcon(i);
                                                })}
                                            />
                                        </Flipped>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                </div>

                {(typeof focusedIcon === 'number' || modalAnimatingOut) && (
                    <Modal
                        type={portalKey}
                        icon={typeof focusedIcon === 'number' ? icons[focusedIcon] : undefined}
                        iconIndex={focusedIcon}
                        container={modalContainer_Ref.current}
                        animatingOut={modalAnimatingOut}
                        onClick={closeModal}
                    />
                )}
            </Flipper>
        </div>
    );
};

const Modal: FC<{
    type: string;
    icon: string | undefined;
    iconIndex: number | boolean;
    container: HTMLDivElement;
    animatingOut: boolean;
    onClick: () => void;
}> = ({ type, icon, iconIndex, container, animatingOut, onClick }) => {
    return createPortal(
        <div
            className={classNames(
                'fixed bottom-0 left-0 right-0 top-0 flex cursor-pointer items-center justify-center',
                'after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:z-0 after:bg-green-300',
                animatingOut ? 'after:animate-spin' : 'after:animate-pulse',
            )}
            role="button"
            tabIndex={-1}
            onClick={onClick}
            onKeyDown={keyDownA11y(onClick)}
        >
            {!animatingOut && (
                <Flipped flipId={`icon-${iconIndex}`} onStart={(el) => (el.style.zIndex = `${10}`)} onComplete={(el) => (el.style.zIndex = '')}>
                    <img src={icon} alt="" className="relative z-[2] h-auto w-[500px]" />
                </Flipped>
            )}
        </div>,
        container,
    );
};

export default PortalExample;
