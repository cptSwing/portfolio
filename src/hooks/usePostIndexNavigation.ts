import { useNavigate } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { usePrevious } from './usePrevious';
import isNumber from '../lib/isNumber';
import { useEffect } from 'react';

const usePostIndexNavigation = (isActive = true) => {
    const postIndex = useZustand((store) => store.values.postIndex);
    const { category, post } = useZustand((store) => store.values.routeData.content);

    const navigate = useNavigate();
    const previousPostIndex = usePrevious(postIndex);

    useEffect(() => {
        if (isActive) {
            if (category && post && isNumber(postIndex)) {
                if (postIndex !== previousPostIndex) {
                    const newId = category.posts[postIndex!].id;
                    navigate(`/${category.id}/${newId}`);
                }
            }
        }
    }, [category, isActive, navigate, post, postIndex, previousPostIndex]);
};

export default usePostIndexNavigation;
