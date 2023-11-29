/* tslint:disable */
/* eslint-disable */
/**
 * Farcaster API V2
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { ErrorRes } from '../models';
// @ts-ignore
import { FeedResponse } from '../models';
// @ts-ignore
import { FeedType } from '../models';
// @ts-ignore
import { FilterType } from '../models';
/**
 * FeedApi - axios parameter creator
 * @export
 */
export const FeedApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Retrieve casts based on filters
         * @param {string} apiKey API key required for authentication.
         * @param {FeedType} feedType Defaults to following (requires fid or address). If set to filter (requires filter_type)
         * @param {FilterType} [filterType] Used when feed_type&#x3D;filter. Can be set to fids (requires fids) or parent_url (requires parent_url)
         * @param {number} [fid] (Optional) fid of user whose feed you want to create. By default, the API expects this field, except if you pass a filter_type
         * @param {string} [fids] Used when filter_type&#x3D;fids . Create a feed based on a list of fids. Max array size is 250. Requires feed_type and filter_type.
         * @param {string} [parentUrl] Used when filter_type&#x3D;parent_url can be used to fetch content under any parent url e.g. FIP-2 channels on Warpcast. Requires feed_type and filter_type
         * @param {boolean} [withRecasts] Include recasts in the response, true by default
         * @param {number} [limit] Number of results to retrieve (default 25, max 100)
         * @param {string} [cursor] Pagination cursor.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        feed: async (apiKey: string, feedType: FeedType, filterType?: FilterType, fid?: number, fids?: string, parentUrl?: string, withRecasts?: boolean, limit?: number, cursor?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'apiKey' is not null or undefined
            assertParamExists('feed', 'apiKey', apiKey)
            // verify required parameter 'feedType' is not null or undefined
            assertParamExists('feed', 'feedType', feedType)
            const localVarPath = `/farcaster/feed`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (feedType !== undefined) {
                localVarQueryParameter['feed_type'] = feedType;
            }

            if (filterType !== undefined) {
                localVarQueryParameter['filter_type'] = filterType;
            }

            if (fid !== undefined) {
                localVarQueryParameter['fid'] = fid;
            }

            if (fids !== undefined) {
                localVarQueryParameter['fids'] = fids;
            }

            if (parentUrl !== undefined) {
                localVarQueryParameter['parent_url'] = parentUrl;
            }

            if (withRecasts !== undefined) {
                localVarQueryParameter['with_recasts'] = withRecasts;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (cursor !== undefined) {
                localVarQueryParameter['cursor'] = cursor;
            }

            if (apiKey != null) {
                localVarHeaderParameter['api_key'] = String(apiKey);
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * FeedApi - functional programming interface
 * @export
 */
export const FeedApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = FeedApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Retrieve casts based on filters
         * @param {string} apiKey API key required for authentication.
         * @param {FeedType} feedType Defaults to following (requires fid or address). If set to filter (requires filter_type)
         * @param {FilterType} [filterType] Used when feed_type&#x3D;filter. Can be set to fids (requires fids) or parent_url (requires parent_url)
         * @param {number} [fid] (Optional) fid of user whose feed you want to create. By default, the API expects this field, except if you pass a filter_type
         * @param {string} [fids] Used when filter_type&#x3D;fids . Create a feed based on a list of fids. Max array size is 250. Requires feed_type and filter_type.
         * @param {string} [parentUrl] Used when filter_type&#x3D;parent_url can be used to fetch content under any parent url e.g. FIP-2 channels on Warpcast. Requires feed_type and filter_type
         * @param {boolean} [withRecasts] Include recasts in the response, true by default
         * @param {number} [limit] Number of results to retrieve (default 25, max 100)
         * @param {string} [cursor] Pagination cursor.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async feed(apiKey: string, feedType: FeedType, filterType?: FilterType, fid?: number, fids?: string, parentUrl?: string, withRecasts?: boolean, limit?: number, cursor?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<FeedResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.feed(apiKey, feedType, filterType, fid, fids, parentUrl, withRecasts, limit, cursor, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * FeedApi - factory interface
 * @export
 */
export const FeedApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = FeedApiFp(configuration)
    return {
        /**
         * 
         * @summary Retrieve casts based on filters
         * @param {string} apiKey API key required for authentication.
         * @param {FeedType} feedType Defaults to following (requires fid or address). If set to filter (requires filter_type)
         * @param {FilterType} [filterType] Used when feed_type&#x3D;filter. Can be set to fids (requires fids) or parent_url (requires parent_url)
         * @param {number} [fid] (Optional) fid of user whose feed you want to create. By default, the API expects this field, except if you pass a filter_type
         * @param {string} [fids] Used when filter_type&#x3D;fids . Create a feed based on a list of fids. Max array size is 250. Requires feed_type and filter_type.
         * @param {string} [parentUrl] Used when filter_type&#x3D;parent_url can be used to fetch content under any parent url e.g. FIP-2 channels on Warpcast. Requires feed_type and filter_type
         * @param {boolean} [withRecasts] Include recasts in the response, true by default
         * @param {number} [limit] Number of results to retrieve (default 25, max 100)
         * @param {string} [cursor] Pagination cursor.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        feed(apiKey: string, feedType: FeedType, filterType?: FilterType, fid?: number, fids?: string, parentUrl?: string, withRecasts?: boolean, limit?: number, cursor?: string, options?: any): AxiosPromise<FeedResponse> {
            return localVarFp.feed(apiKey, feedType, filterType, fid, fids, parentUrl, withRecasts, limit, cursor, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * FeedApi - object-oriented interface
 * @export
 * @class FeedApi
 * @extends {BaseAPI}
 */
export class FeedApi extends BaseAPI {
    /**
     * 
     * @summary Retrieve casts based on filters
     * @param {string} apiKey API key required for authentication.
     * @param {FeedType} feedType Defaults to following (requires fid or address). If set to filter (requires filter_type)
     * @param {FilterType} [filterType] Used when feed_type&#x3D;filter. Can be set to fids (requires fids) or parent_url (requires parent_url)
     * @param {number} [fid] (Optional) fid of user whose feed you want to create. By default, the API expects this field, except if you pass a filter_type
     * @param {string} [fids] Used when filter_type&#x3D;fids . Create a feed based on a list of fids. Max array size is 250. Requires feed_type and filter_type.
     * @param {string} [parentUrl] Used when filter_type&#x3D;parent_url can be used to fetch content under any parent url e.g. FIP-2 channels on Warpcast. Requires feed_type and filter_type
     * @param {boolean} [withRecasts] Include recasts in the response, true by default
     * @param {number} [limit] Number of results to retrieve (default 25, max 100)
     * @param {string} [cursor] Pagination cursor.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FeedApi
     */
    public feed(apiKey: string, feedType: FeedType, filterType?: FilterType, fid?: number, fids?: string, parentUrl?: string, withRecasts?: boolean, limit?: number, cursor?: string, options?: AxiosRequestConfig) {
        return FeedApiFp(this.configuration).feed(apiKey, feedType, filterType, fid, fids, parentUrl, withRecasts, limit, cursor, options).then((request) => request(this.axios, this.basePath));
    }
}
