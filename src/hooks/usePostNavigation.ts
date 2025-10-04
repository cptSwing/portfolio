import { useNavigate } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { useEffect } from 'react';
import { cycleThrough } from 'cpts-javascript-utilities';

const store_setPostNavigationState = useZustand.getState().methods.store_setPostNavigationState;

function usePostNavigation() {
    const postNavigationState = useZustand((store) => store.values.postNavigationState);
    const { category, post } = useZustand((store) => store.values.routeData.content);

    const navigate = useNavigate();

    useEffect(() => {
        if (postNavigationState && category && post) {
            const previousId = cycleThrough(category.posts, post, 'previous').id;
            const nextId = cycleThrough(category.posts, post, 'next').id;

            switch (postNavigationState) {
                case 'previous':
                    store_setPostNavigationState(null);
                    navigate(`/${category.id}/${previousId}`);

                    break;
                case 'next':
                    store_setPostNavigationState(null);
                    navigate(`/${category.id}/${nextId}`);

                    break;
                case 'close':
                    store_setPostNavigationState(null);
                    navigate(`/${category.id}`);

                    break;
                default:
                    break;
            }
        }
    }, [navigate, postNavigationState, category, post]);
}

export default usePostNavigation;
