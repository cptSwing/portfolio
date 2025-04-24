import Nav from '../components/Nav';
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { MutableRefObject, useEffect, useState } from 'react';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';
import DisplayPost from '../components/DisplayPost';

const App = () => {
    return (
        <div className='flex h-dvh w-dvw items-center justify-center overflow-hidden bg-[--bg-color] font-miriam-libre text-[--theme-text] scrollbar-track-transparent scrollbar-thumb-neutral-50'>
            <BrowserRouter>
                <Routes>
                    <Route path='/:catId?/:postId?' element={<NavOutlet />} />

                    <Route path='/bundles/:bundlePath' element={<BundleRoutes />} />

                    <Route path='*' element={<NoRouteMatched />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

const NavOutlet = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (catId) {
            setIsExpanded(true);
        }
    }, [catId]);

    /* Contract Contact when click outside */
    const ref = useOutsideClick(() => {
        // should not trigger when post is displayed
        if (!postId) {
            navigate('/');
            setIsExpanded(false);
        }
    }) as MutableRefObject<HTMLDivElement | null>;

    return (
        <div
            key='content-wrapper'
            ref={ref}
            className={classNames(
                '[--nav-category-common-color-1:theme(colors.gray.700)] [--nav-divider-width:theme(spacing.1)] [--nav-gap-x:theme(spacing.2)]',
                '[--category-padding:theme(spacing.4)]',
                'mx-auto grid h-3/4 w-2/3 items-start justify-center transition-[grid-template-columns] duration-500',
                isExpanded ? 'grid-cols-[auto_1fr_auto] *:min-h-full' : 'grid-cols-[auto_0fr_auto] *:min-h-0',
            )}
        >
            <Nav />
            <Category />

            {/* <Outlet /> */}
            <DisplayPost />
        </div>
    );
};

const BundleRoutes = () => {
    const { bundlePath } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        navigate(`/bundles/${bundlePath}/index.html`);
        // window.location.assign(`${window.location.protocol}//${window.location.host}/bundles/${bundlePath}/index.html`);
    }, [bundlePath, navigate]);

    return <h3> Redirecting to {bundlePath}.... </h3>;
};

export default App;

// Return 404 ?
const NoRouteMatched = () => {
    return (
        <p className='text-center'>
            <h3>Uh-oh, no matching route found!</h3>

            <br />
            <Link to='/'>Home</Link>
        </p>
    );
};
