import { useParams } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { useLayoutEffect } from 'react';
import { ROUTE } from '../types/enums';
import { database } from '../types/exportTyped';

const categories = Object.values(database);

const store_setRouteData = useZustand.getState().methods.store_setRouteData;

function useSetRouteData() {
    const { param_categoryId, param_postId } = useParams();

    useLayoutEffect(() => {
        if (param_categoryId) {
            const category = categories.find((category) => parseInt(param_categoryId) === category.id);
            if (category) {
                if (param_postId) {
                    const post = category.posts.find((postElement) => postElement.id.toString() === param_postId);
                    post && store_setRouteData({ name: ROUTE.post, content: { category, post } });
                    return;
                } else {
                    store_setRouteData({ name: ROUTE.category, content: { category } });
                }
            }
        } else {
            store_setRouteData({ name: ROUTE.home, content: {} });
        }
    }, [param_categoryId, param_postId]);
}

export default useSetRouteData;
