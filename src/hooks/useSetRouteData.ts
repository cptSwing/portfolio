import { useParams } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { useLayoutEffect } from 'react';
import { ROUTE } from '../types/enums';
import { database } from '../types/exportTyped';
import isNumber from '../lib/isNumber';

const categories = Object.values(database);

const { store_setRouteData, store_setPostIndexAndTransitionTrue } = useZustand.getState().methods;

function useSetRouteData() {
    const { param_categoryId, param_postId } = useParams();

    useLayoutEffect(() => {
        if (param_categoryId) {
            const category = categories.find((category) => parseInt(param_categoryId) === category.id);
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
    }, [param_categoryId, param_postId]);
}

export default useSetRouteData;
