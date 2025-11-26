import { useParams } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { ROUTE } from '../types/enums';
import isNumber from '../lib/isNumber';
import { useEffect } from 'react';

const { store_setRouteData, store_setPostIndexAndTransitionTrue } = useZustand.getState().methods;

function useSetRouteData() {
    const { param_categoryId, param_postId } = useParams();
    const apiContent = useZustand((store) => store.apiContent);

    useEffect(() => {
        if (apiContent && param_categoryId) {
            const category = Object.values(apiContent).find((category) => parseInt(param_categoryId) === category.id);
            if (category) {
                if (param_postId) {
                    let postIndex: number | null = null;
                    const post = category.posts.find((postElement, idx) => {
                        if (postElement.id.toString() === param_postId) {
                            postIndex = idx;
                            return true;
                        }
                    });
                    isNumber(postIndex) && store_setPostIndexAndTransitionTrue(postIndex!);

                    if (post) {
                        store_setRouteData({ name: ROUTE.post, content: { category, post } });
                    }
                } else {
                    store_setRouteData({ name: ROUTE.category, content: { category } });
                }
            }
        } else {
            store_setRouteData({ name: ROUTE.home, content: {} });
        }
    }, [apiContent, param_categoryId, param_postId]);
}

export default useSetRouteData;
