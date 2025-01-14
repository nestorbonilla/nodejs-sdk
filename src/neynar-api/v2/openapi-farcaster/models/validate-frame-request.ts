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



/**
 * 
 * @export
 * @interface ValidateFrameRequest
 */
export interface ValidateFrameRequest {
    /**
     * Hexadecimal string of message bytes.
     * @type {string}
     * @memberof ValidateFrameRequest
     */
    'message_bytes_in_hex': string;
    /**
     * Adds viewer_context inside the cast object to indicate whether the interactor reacted to the cast housing the frame.
     * @type {boolean}
     * @memberof ValidateFrameRequest
     */
    'cast_reaction_context'?: boolean;
    /**
     * Adds viewer_context inside the user (interactor) object to indicate whether the interactor follows or is followed by the cast author.
     * @type {boolean}
     * @memberof ValidateFrameRequest
     */
    'follow_context'?: boolean;
}

