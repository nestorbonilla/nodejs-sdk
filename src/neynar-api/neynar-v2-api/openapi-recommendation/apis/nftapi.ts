/* tslint:disable */
/* eslint-disable */
/**
 * Recommendation API V2
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Configuration } from "../configuration";
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from "axios";
import globalAxios from "axios";
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  assertParamExists,
  setApiKeyToObject,
  setBasicAuthToObject,
  setBearerAuthToObject,
  setOAuthToObject,
  setSearchParams,
  serializeDataIfNeeded,
  toPathString,
  createRequestFunction,
} from "../common";
// @ts-ignore
import {
  BASE_PATH,
  COLLECTION_FORMATS,
  RequestArgs,
  BaseAPI,
  RequiredError,
} from "../base";
// @ts-ignore
import { ErrorRes } from "../models";
// @ts-ignore
import { FetchRelevantMints200Response } from "../models";
/**
 * NFTApi - axios parameter creator
 * @export
 */
export const NFTApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     * Fetches all mint actions relevant for a contract address (and optionally tokenId for ERC1155s) given a user\'s ethereum address
     * @summary Relevant Mints for a User
     * @param {string} address
     * @param {string} contractAddress
     * @param {string} [tokenId]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    fetchRelevantMints: async (
      address: string,
      contractAddress: string,
      tokenId?: string,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'address' is not null or undefined
      assertParamExists("fetchRelevantMints", "address", address);
      // verify required parameter 'contractAddress' is not null or undefined
      assertParamExists(
        "fetchRelevantMints",
        "contractAddress",
        contractAddress
      );
      const localVarPath = `/nft/relevant_mints`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      if (address !== undefined) {
        localVarQueryParameter["address"] = address;
      }

      if (contractAddress !== undefined) {
        localVarQueryParameter["contract_address"] = contractAddress;
      }

      if (tokenId !== undefined) {
        localVarQueryParameter["token_id"] = tokenId;
      }

      // authentication ApiKeyAuth required
      await setApiKeyToObject(
        localVarHeaderParameter,
        "api_key",
        configuration
      );

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * NFTApi - functional programming interface
 * @export
 */
export const NFTApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = NFTApiAxiosParamCreator(configuration);
  return {
    /**
     * Fetches all mint actions relevant for a contract address (and optionally tokenId for ERC1155s) given a user\'s ethereum address
     * @summary Relevant Mints for a User
     * @param {string} address
     * @param {string} contractAddress
     * @param {string} [tokenId]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async fetchRelevantMints(
      address: string,
      contractAddress: string,
      tokenId?: string,
      options?: AxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<FetchRelevantMints200Response>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.fetchRelevantMints(
          address,
          contractAddress,
          tokenId,
          options
        );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
  };
};

/**
 * NFTApi - factory interface
 * @export
 */
export const NFTApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = NFTApiFp(configuration);
  return {
    /**
     * Fetches all mint actions relevant for a contract address (and optionally tokenId for ERC1155s) given a user\'s ethereum address
     * @summary Relevant Mints for a User
     * @param {NFTApiGetRelaventMintsRequest} [requestParameters] Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    fetchRelevantMints(
      requestParameters: NFTApiGetRelaventMintsRequest,
      options?: any
    ): AxiosPromise<FetchRelevantMints200Response> {
      return localVarFp
        .fetchRelevantMints(
          requestParameters.address,
          requestParameters.contractAddress,
          requestParameters.tokenId,
          options
        )
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * Request parameters to fetch relevant mints operation in NFTApi.
 * @export
 * @interface NFTApiGetRelaventMintsRequest
 */
export interface NFTApiGetRelaventMintsRequest {
  /**
   * Ethereum address
   * @type {string}
   * @memberof NFTApiGetRelaventMints
   */
  readonly address: string;

  /**
   * Ethereum address
   * @type {string}
   * @memberof NFTApiGetRelaventMints
   */
  readonly contractAddress: string;

  /**
   * @type {string}
   * @memberof NFTApiGetRelaventMints
   */
  readonly tokenId?: string;
}

/**
 * NFTApi - object-oriented interface
 * @export
 * @class NFTApi
 * @extends {BaseAPI}
 */
export class NFTApi extends BaseAPI {
  /**
   * Fetches all mint actions relevant for a contract address (and optionally tokenId for ERC1155s) given a user\'s ethereum address
   * @summary Relevant Mints for a User
   * @param {NFTApiGetRelaventMintsRequest} [requestParameters] Request parameters.
   * @param {string} [tokenId]
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof NFTApi
   */
  public fetchRelevantMints(
    requestParameters: NFTApiGetRelaventMintsRequest,
    options?: AxiosRequestConfig
  ) {
    return NFTApiFp(this.configuration)
      .fetchRelevantMints(
        requestParameters.address,
        requestParameters.contractAddress,
        requestParameters.tokenId,
        options
      )
      .then((request) => request(this.axios, this.basePath));
  }
}
