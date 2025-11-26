import { useLayoutEffect } from 'react';
import { useZustand } from '../lib/zustand';
import { DataBase } from '../types/types';

const store_apiContent = useZustand.getState().methods.store_apiContent;

const useFetchApiContent = () => {
    useLayoutEffect(() => {
        fetch('/queries/testDb.json')
            .then((response) => response.text())
            .then((text) => {
                store_apiContent(JSON.parse(text) as DataBase);
            });
    }, []);
};

export default useFetchApiContent;
