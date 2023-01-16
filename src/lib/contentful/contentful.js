import * as contentful from 'contentful/dist/contentful.browser.min';
//import {CONTENTFUL_SPACE_ID,CONTENTFUL_ACCESS_TOKEN} from '../../constants/CommonConstants';
import {AlertUtil} from './../../utilities/AlertUtil';
import Config from 'react-native-config';

const SPACE_ID = Config.CONTENTFUL_SPACE_ID ?? "a";
const ACCESS_TOKEN = Config.CONTENTFUL_ACCESS_TOKEN ?? "a";
const HOST = 'cdn.contentful.com';
export const ContentfulClient = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN,
    host: HOST,
});

const queryMethod = ContentfulClient.getEntries;
ContentfulClient.getEntries = function (query) {
    return queryMethod.apply(this, [query]).catch(e => {
        AlertUtil.showErrorMessage('Unable to load contentful');
        console.log(e);
        return {
            total: 0,
            items: [],
        };
    });

};
