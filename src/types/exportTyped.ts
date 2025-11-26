import { DataBase, Config } from '../types/types';
import configUntyped from '../config/config.json';

function _getDatabaseSynchronous(): DataBase {
    const request = new XMLHttpRequest();
    request.open('GET', '/queries/testDb.json', false);
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        // eslint-disable-next-line no-console
        console.error('Json not loaded!');
        return {
            'code': {
                id: 0,
                title: '',
                posts: [],
                categoryBlurb: '',
            },
            '3d': {
                id: 0,
                title: '',
                posts: [],
                categoryBlurb: '',
            },
            'log': {
                id: 0,
                title: '',
                posts: [],
                categoryBlurb: '',
            },
        };
    }
}

export const config = configUntyped as Config;
