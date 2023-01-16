let _appId = null;

export const setSendbirdAppId = (appId) => {
    console.log('Initializing Sendbird AppId');
    _appId = appId;
};

export const getSendbirdAppId = () => {
    return _appId;
};
export const APP_ID = _appId;
export const QUERY_LIMIT = 50;
