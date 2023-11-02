import {
  CastApi,
  SignerApi,
  Signer,
  Cast,
  CastParamType,
  PostCastResponseCast,
  DeleteCastReqBody,
  ReactionApi,
  ReactionReqBody,
  ReactionType,
  OperationResponse,
  FollowReqBody,
  BulkFollowResponse,
  EmbeddedCast,
  Configuration,
  ErrorRes,
  FeedApi,
  UserApi,
  CastApiPostCastRequest,
  CastWithInteractions,
  SearchedUser,
  FeedType,
  FilterType,
  FeedResponse,
  SignerApiRegisterSignedKeyRequest,
} from "./openapi-farcaster";
import axios, { AxiosError, AxiosInstance } from "axios";
import { silentLogger, Logger } from "../common/logger";
import type { SetRequired } from "type-fest";

const BASE_PATH = "https://api.neynar.com/v2";

export class NeynarV2APIClient {
  private readonly logger: Logger;

  public readonly apis: {
    signer: SignerApi;
    cast: CastApi;
    reaction: ReactionApi;
    feed: FeedApi;
  };

  /**
   * Instantiates a NeynarV1APIClient
   *
   * Note: A Wallet must be provided if the API client is to mint new AuthTokens
   */
  constructor(
    apiKey: string,
    {
      logger = silentLogger,
      axiosInstance,
    }: { logger?: Logger; axiosInstance?: AxiosInstance } = {}
  ) {
    this.logger = logger;

    if (apiKey === "") {
      throw new Error(
        "Attempt to use an authenticated API method without first providing an api key"
      );
    }

    if (axiosInstance === undefined) {
      axiosInstance = axios.create();
    }
    axiosInstance.defaults.decompress = true;
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (NeynarV2APIClient.isApiErrorResponse(error)) {
          const apiErrors = error.response.data;
          this.logger.warn(`API errors: ${JSON.stringify(apiErrors)}`);
        }
        throw error;
      }
    );

    const config: Configuration = new Configuration({
      basePath: BASE_PATH,
      apiKey: apiKey,
    });
    this.apis = {
      signer: new SignerApi(config, undefined, axiosInstance),
      cast: new CastApi(config, undefined, axiosInstance),
      reaction: new ReactionApi(config, undefined, axiosInstance),
      feed: new FeedApi(config, undefined, axiosInstance),
    };
  }

  /**
   * Utility for parsing errors returned by the Neynar API servers. Returns true
   * if the given error is caused by an error response from the server, and
   * narrows the type of `error` accordingly.
   */
  public static isApiErrorResponse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any
  ): error is SetRequired<AxiosError<ErrorRes>, "response"> {
    if (!(error instanceof AxiosError)) return false;
    return (
      error.response?.data !== undefined && "message" in error.response.data
    );
  }

  // ------------ Signer ------------

  /**
   * Creates a Signer.
   * See [Neynar documentation](https://docs.neynar.com/reference/create-signer)
   *
   */
  public async createSigner(): Promise<Signer> {
    const response = await this.apis.signer.createSigner();
    return response.data;
  }

  /**
   * Fetches an existing Signer.
   * See [Neynar documentation](https://docs.neynar.com/reference/signer)
   *
   */
  public async fetchSigner(signerUuid: string): Promise<Signer | null> {
    try {
      const response = await this.apis.signer.signer({ signerUuid });
      return response.data;
    } catch (error) {
      if (NeynarV2APIClient.isApiErrorResponse(error)) {
        const status = error.response.status;
        if (status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  /**
   * Registers a Signer with an fid.
   * See [Neynar documentation](https://docs.neynar.com/reference/register-signed-key)
   *
   */
  public async registerSigner(
    signerUuid: string,
    fid: number,
    deadline: number,
    signature: string
  ): Promise<Signer> {
    const request: SignerApiRegisterSignedKeyRequest = {
      registerSignerKeyReqBody: {
        signer_uuid: signerUuid,
        app_fid: fid,
        deadline: deadline,
        signature: signature,
      },
    };
    const response = await this.apis.signer.registerSignedKey(request);
    return response.data;
  }

  // ------------ Cast ------------

  /**
   * Gets information about an individual cast.
   * See [Neynar documentation](https://docs.neynar.com/reference/cast)
   *
   */
  public async fetchCast(
    castHashOrUrl: string,
    type: CastParamType
  ): Promise<Cast | null> {
    try {
      const response = await this.apis.cast.cast({
        type,
        identifier: castHashOrUrl,
      });
      return response.data.cast;
    } catch (error) {
      if (NeynarV2APIClient.isApiErrorResponse(error)) {
        const status = error.response.status;
        if (status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  /**
   * Gets information about an array of casts.
   * See [Neynar documentation](https://docs.neynar.com/reference/casts)
   *
   */
  public async fetchCasts(castHashes: string[]): Promise<Cast[] | null> {
    try {
      const response = await this.apis.cast.casts({
        getCastsReqBody: {
          casts: castHashes.map((hash) => ({ hash })),
        },
      });
      return response.data.result.casts;
    } catch (error) {
      if (NeynarV2APIClient.isApiErrorResponse(error)) {
        const status = error.response.status;
        if (status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  /**
   * Publishes a cast for the currently authenticated user.
   * See [Neynar documentation](https://docs.neynar.com/reference/post-cast)
   *
   */
  public async publishCast(
    signerUuid: string,
    text: string,
    options?: { embeds?: EmbeddedCast[]; replyTo?: string }
  ): Promise<PostCastResponseCast> {
    const request: CastApiPostCastRequest = {
      postCastReqBody: {
        signer_uuid: signerUuid,
        text: text,
        embeds: options?.embeds,
        parent: options?.replyTo,
      },
    };
    const response = await this.apis.cast.postCast(request);
    return response.data.cast;
  }

  /**
   * Delete a cast.
   * See [Neynar documentation](https://docs.neynar.com/reference/delete-cast)
   *
   */
  public async deleteCast(
    signerUuid: string,
    castOrCastHash: Cast | string
  ): Promise<OperationResponse> {
    let castHash: string;
    if (typeof castOrCastHash === "string") {
      castHash = castOrCastHash;
    } else {
      castHash = castOrCastHash.hash;
    }
    const body: DeleteCastReqBody = {
      signer_uuid: signerUuid,
      target_hash: castHash,
    };
    const response = await this.apis.cast.deleteCast({
      deleteCastReqBody: body,
    });
    return response.data;
  }

  // ------------ Rection ------------

  /**
   * React to a cast.
   * See [Neynar documentation](https://docs.neynar.com/reference/post-reaction)
   *
   */
  public async reactToCast(
    signerUuid: string,
    reaction: ReactionType,
    castOrCastHash: Cast | string
  ): Promise<OperationResponse> {
    let castHash: string;
    if (typeof castOrCastHash === "string") {
      castHash = castOrCastHash;
    } else {
      castHash = castOrCastHash.hash;
    }
    const body: ReactionReqBody = {
      signer_uuid: signerUuid,
      reaction_type: reaction,
      target: castHash,
    };
    const response = await this.apis.reaction.postReaction({
      reactionReqBody: body,
    });
    return response.data;
  }

  /**
   * Remove a reaction to a cast. See [Neynar documentation](https://docs.neynar.com/reference/delete-reaction)
   */
  public async removeReactionToCast(
    signerUuid: string,
    reaction: ReactionType,
    castOrCastHash: Cast | string
  ): Promise<OperationResponse> {
    let castHash: string;
    if (typeof castOrCastHash === "string") {
      castHash = castOrCastHash;
    } else {
      castHash = castOrCastHash.hash;
    }
    const body: ReactionReqBody = {
      signer_uuid: signerUuid,
      reaction_type: reaction,
      target: castHash,
    };
    const response = await this.apis.reaction.deleteReaction({
      reactionReqBody: body,
    });
    return response.data;
  }

  // ------------ Feed ------------

  /**
   * Get reverse chronological feed page for a user based on their follow graph.
   * See [Neynar documentation](https://docs.neynar.com/reference/feed)
   *
   */
  public async fetchFeedPage(
    fid: number,
    options?: {
      feedType?: FeedType;
      filterType?: FilterType;
      fids?: string;
      parentUrl?: string;
      limit?: number;
      cursor?: string;
    }
  ): Promise<FeedResponse> {
    const response = await this.apis.feed.feed({
      feedType: options?.feedType,
      filterType: options?.filterType,
      fid: fid,
      fids: options?.fids,
      parentUrl: options?.parentUrl,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    // Return the current page of casts and the next cursor
    return response.data;
  }
}
