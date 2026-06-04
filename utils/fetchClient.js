import {useRuntimeConfig} from "nuxt/app";
import json from '~/jsConfig.json'


export const prepareGetUrl = (params) => {
     return new URLSearchParams(Object?.entries(params)?.filter(([key, value]) => value !== null && value !== undefined))?.toString();
}

export const createFetchClient = (headers, defaultHeaders = {
    Accept: 'application/json',
    "Content-type": "application/json; charset=UTF-8"
}) => {
    return async (url, options = {}) => {
        const mergedOptions = {
            ...options,
            headers: {
                ...headers,
                ...defaultHeaders,
                ...options.headers,
            },
        };

        const config = useRuntimeConfig();
        const baseUrl = config.public.apiBase + json.api.url;
        return await fetch(`${baseUrl}${url}`, mergedOptions);
    };
};
