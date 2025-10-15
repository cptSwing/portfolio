import { useNavigate } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { useLayoutEffect } from 'react';
import { usePrevious } from './usePrevious';

const store_setPostIndex = useZustand.getState().methods.store_setPostIndex;

const usePostNavigation = () => {
    const postIndex = useZustand((store) => store.values.postIndex);
    const previousPostIndex = usePrevious(postIndex);

    const { category, post } = useZustand((store) => store.values.routeData.content);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (category && post) {
            if (postIndex === null) {
                // Close Post view
                navigate(`/${category.id}`);

                // Set back to last active post index
                const timer = setTimeout(() => {
                    store_setPostIndex(category.posts.findIndex((elem) => elem.id === post.id));
                    clearTimeout(timer);
                }, 10);
            } else {
                const newId = category.posts[postIndex].id;
                navigate(`/${category.id}/${newId}`);
            }
        }
    }, [category, navigate, post, postIndex, previousPostIndex]);
};

export default usePostNavigation;
