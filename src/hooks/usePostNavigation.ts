import { useNavigate, useParams } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { useEffect } from 'react';

const store_setPostNavigationState = useZustand.getState().methods.store_setPostNavigationState;

function usePostNavigation(postId: number) {
    const param_categoryId = useParams().param_categoryId;
    const postNavigationState = useZustand((store) => store.values.postNavigationState);
    const posts = useZustand((store) => store.values.routeData.content.category?.posts);
    const navigate = useNavigate();

    useEffect(() => {
        if (postNavigationState && posts) {
            const postIds = posts.map((post) => post.id);
            const currentIndex = postIds.findIndex((index) => index === postId);
            const previousInArray = postIds[currentIndex - 1 >= 0 ? currentIndex - 1 : postIds.length - 1];
            const nextInArray = postIds[currentIndex + 1 < postIds.length ? currentIndex + 1 : 0];

            switch (postNavigationState) {
                case 'prev':
                    store_setPostNavigationState(null);
                    navigate(`/${param_categoryId}/${previousInArray}`);

                    break;
                case 'next':
                    store_setPostNavigationState(null);
                    navigate(`/${param_categoryId}/${nextInArray}`);

                    break;
                case 'close':
                    store_setPostNavigationState(null);
                    navigate(`/${param_categoryId}`);

                    break;
                default:
                    break;
            }
        }
    }, [postId, posts, navigate, postNavigationState, param_categoryId]);
}

export default usePostNavigation;
