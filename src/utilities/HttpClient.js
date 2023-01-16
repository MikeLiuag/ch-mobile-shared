import VersionCheck from 'react-native-version-check';
let instance: HttpClient = null;

export class HttpClient {
    baseUrl: string;
    authStore: any;
    navigator: any;

    constructor() {
        if (instance) {
            return instance;
        }
    }

    static initialize(baseUrl, authStore, navigator) {
        instance = new HttpClient();
        instance.baseUrl = baseUrl;
        instance.authStore = authStore;
        instance.navigator = navigator;
    }

    static getInstance() {
        return instance;
    }

    /**
     * @function request
     * @description This method wraps the fetch API for invoking Backend APIs.
     * It further provides mock data if `__DEV__` is true and config.mock.enable is set to true in assets/config.json
     * @param endpoint Endpoint object containing path and method
     * @param pathParams Path parameters which are replaced in endpoint's path  (Optional)
     * @param queryParams Query string parameters supplied as an object.  (Optional)
     * @param headers Request Headers to be supplied within request (Optional)
     * @param requestBody Object representing request body. (Optional)
     * @param isMultipart Boolean value to check if request is a multipart request (Optional)
     * @param explicitAuthToken An auth token to supply as an authorization token (Optional)
     * @param formDataKey When isMultipart is set true, this is required for additional form data param name
     * @returns {Promise<T>} Promisified JSON response
     */
    async request(
        endpoint,
        pathParams?: any,
        queryParams?: any,
        headers?: any,
        requestBody?: any,
        isMultipart?: boolean,
        explicitAuthToken?: string,
        formDataKey?: string
    ): Promise<any> {
        const versionInfo = await VersionCheck.needUpdate();
        // generating fully qualified path for request
        let url = this.baseUrl + endpoint.path;
        if (pathParams) {
            // Replacing url path params with actual provided values.
            Object.keys(pathParams).forEach(key => {
                url = url.replace('{' + key + '}', pathParams[key]);
            });
        }
        if (url.includes('{')) {
            // Some path params aren't replaced with actual values.
            throw new Error(
                'Path parameters are required and their keys must match with the placeholder keys defined in endpoint declaration'
            );
        }
        if (queryParams) {
            // Appending Query params with url path
            url += HttpClient.generateQueryParams(queryParams);

        }
        const options = {
            method: endpoint.method,
            headers
        };

        if (isMultipart) {
            let formData = new FormData();


            formData.append(formDataKey, JSON.stringify(requestBody[formDataKey]));
            if (requestBody.file) {
                formData.append('file', requestBody.file);
            }
            requestBody = formData;
        }

        if (!options.headers) {
            options.headers = { appVersion : versionInfo?.latestVersion};
        }
        if (headers) {
            options.headers = {...headers, appVersion : versionInfo?.latestVersion};
        }
        if ((endpoint.method === 'POST' || endpoint.method === 'PUT') && requestBody) {
            options.body = isMultipart ? requestBody : JSON.stringify(requestBody);
            if (!isMultipart) {
                options.headers['Content-Type'] = 'application/json';
            }
        }
        if (explicitAuthToken) {
            options.headers['Authorization'] = explicitAuthToken;
        } else {
            const authToken = await this.authStore.getAuthToken();
            if (authToken) {
                options.headers['Authorization'] = authToken;
            }
        }

        console.log(url);
        return fetch(url, options)
            .then(async response => {
                if (response && response.status === 200 && response.headers && response.headers.map['authorization']) {
                    await this.authStore.setAuthToken(response.headers.map['authorization']);
                }
                return response;
            })
            .then(async response => {
                return await response.json().catch(e => {
                    console.log('Response cannot be parsed to JSON. Returning original response');
                    return response;
                });
            })
            .then(response => {
                if (response.status) {
                    if (response.status === 404) {
                        throw new Error(
                            '404 error occurred. Reason: ' +
                            response.error +
                            'ENDPOINT : ' +
                            response.path
                        );
                    } else if (response.status === 401) {
                        if (!this.authStore.isAuthenticationEndpoint(endpoint)) {
                            this.navigator.navigateTo('Auth');
                        }
                    } else if (response.status !== 200) {
                        throw new Error(
                            'An unexpected error occurred. Reason: ' + response.message
                        );
                    }
                }
                this.checkTokenExpiry(response, endpoint);
                return response;
            }).catch(error => {
                if (error.message === 'Network request failed') {
                    return {
                        errors: [{
                            endUserMessage: 'Internet connectivity issue',
                            errorCode: 'VALIDATION_FAILURE',
                        }],
                    };
                }
                throw error;
            });
    }


    checkTokenExpiry(response, endpoint) {
        if (response.errors && response.errors[0]
            && response.errors[0] && response.errors[0].errorCode
            && response.errors[0].errorCode === 'UNAUTHORIZED') {
            if (!this.authStore.isAuthenticationEndpoint(endpoint)) {
                console.log('Routing to Login');
                this.navigator.navigateTo('Auth');
            }
        }
    }

    /**
     * @function generateQueryParams
     * @description A helper for transforming params object into Encoded URL Query parameter string
     * @param queryParams Params object with parameters supplied as key-value pairs.
     * @returns {string} Encoded URL Query parameter string prepended with a ?
     */
    static generateQueryParams(queryParams: any) {
        let esc = encodeURIComponent;
        return (
            '?' +
            Object.keys(queryParams)
                .map(k => `${esc(k)}=${esc(queryParams[k])}`)
                .join('&')
        );
    }
}
