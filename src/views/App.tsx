import Content from '../components/Content';
import Nav from '../components/Nav';
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { MutableRefObject, useEffect, useState } from 'react';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';

const App = () => {
    return (
        <div className='flex h-dvh w-dvw items-center justify-center overflow-hidden bg-slate-800 font-mariam-libre text-white scrollbar-track-transparent scrollbar-thumb-neutral-50'>
            <BrowserRouter>
                <Routes>
                    <Route path='/:catId?' element={<NavOutlet />}>
                        <Route path='/:catId/:postId' element={<Content />} />
                    </Route>

                    <Route path='/bundles/:bundlePath' element={<BundleRoutes />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

const NavOutlet = () => {
    const { catId } = useParams();
    const navigate = useNavigate();

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (catId) {
            setIsExpanded(true);
        }
    }, [catId]);

    /* Contract Contact when click outside */
    const ref = useOutsideClick(() => {
        navigate('/');
        setIsExpanded(false);
    }) as MutableRefObject<HTMLDivElement | null>;

    return (
        <div
            key='content-wrapper'
            ref={ref}
            className={classNames(
                '*: relative mx-auto grid h-3/4 w-1/2 items-start justify-center transition-[grid-template-columns] duration-500 *:transition-[min-height] *:duration-1000',
                isExpanded ? 'grid-cols-[auto_1fr] *:min-h-full' : 'grid-cols-[auto_0fr] *:min-h-0',
            )}
        >
            <Nav />
            <Category />
        </div>
    );
};

const BundleRoutes = () => {
    const { bundlePath } = useParams();

    useEffect(() => {
        window.location.href = `https://jbrandenburg.de/bundles/${bundlePath}/index.html`;
    }, [bundlePath]);

    return <h3> Redirecting.... </h3>;
};

export default App;
