import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';

const Content = () => {
    const isAnyChecked = useZustand((state) => state.menu.isAnyChecked);

    return (
        <div className='z-0 flex size-full flex-col items-center justify-center'>
            {/* TODO keyframe animation w-0 to w-fit */}
            <div
                className={classNames(
                    'size-4/5 transform-gpu rounded border-2 border-gray-800 bg-gray-700 transition-[transform,opacity] duration-300',
                    isAnyChecked ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0',
                )}
            ></div>
        </div>
    );
};

export default Content;
