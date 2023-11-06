import {
  Cast,
  User,
  CastApi,
  UserApi,
  VerificationApi,
  NotificationsApi,
  ReactionsApi,
  FollowsApi,
  Configuration,
  ErrorRes,
  VerificationResponseResult,
  RecentUsersResponse,
  RecentCastsResponse,
  UserCastLikeResponse,
  CastsResponse,
  MentionsAndRepliesResponse,
  ReactionsAndRecastsResponse,
  CastLikesResponse,
  CastReactionsResponse,
  CastRecasterResponse,
  FollowResponse,
} from "./openapi";
import axios, { AxiosError, AxiosInstance } from "axios";
import { silentLogger, Logger } from "../common/logger";
import type { SetRequired } from "type-fest";

const BASE_PATH = "https://api.neynar.com/v1";

export class NeynarV1APIClient {
  private readonly logger: Logger;

  public readonly apis: {
    user: UserApi;
    cast: CastApi;
    follows: FollowsApi;
    verification: VerificationApi;
    notifications: NotificationsApi;
    reactions: ReactionsApi;
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
        if (NeynarV1APIClient.isApiErrorResponse(error)) {
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
      user: new UserApi(config, undefined, axiosInstance),
      cast: new CastApi(config, undefined, axiosInstance),
      follows: new FollowsApi(config, undefined, axiosInstance),
      verification: new VerificationApi(config, undefined, axiosInstance),
      notifications: new NotificationsApi(config, undefined, axiosInstance),
      reactions: new ReactionsApi(config, undefined, axiosInstance),
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

  // ------------ User ------------

  /**
   * A list of users in reverse chronological order based on sign up.
   * See [Neynar documentation](https://docs.neynar.com/reference/recent-users-v1)
   *
   */
  public async fetchRecentUsers(options?: {
    viewerFid?: number;
    limit?: number;
    cursor?: string;
  }): Promise<RecentUsersResponse> {
    const response = await this.apis.user.recentUsers({
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  /**
   * Fetch all likes by a given user.
   * See [Neynar documentation](https://docs.neynar.com/reference/user-cast-likes-v1)
   *
   */
  public async fetchAllCastsLikedByUser(
    fid: number,
    options?: { viewerFid?: number; limit?: number; cursor?: string }
  ): Promise<UserCastLikeResponse> {
    const response = await this.apis.user.userCastLikes({
      fid: fid,
      viewerFid: options?.viewerFid,
      limit: options?.limit,
      cursor: options?.cursor,
    });

    return response.data;
  }

  /**
   * Gets the specified user via their FID (if found).
   * See [Neynar documentation](https://docs.neynar.com/reference/user-v1)
   *
   */
  public async lookupUserByFid(
    fid: number,
    viewerFid?: number
  ): Promise<User | null> {
    try {
      const response = await this.apis.user.user({ fid, viewerFid });
      return response.data.result.user;
    } catch (error) {
      if (NeynarV1APIClient.isApiErrorResponse(error)) {
        if (error.response.status === 404) return null;
      }
      throw error;
    }
  }

  /**
   * Gets the specified user via their username (if found).
   * See [Neynar documentation](https://docs.neynar.com/reference/user-by-username-v1)
   *
   */
  public async lookupUserByUsername(
    username: string,
    viewerFid?: number
  ): Promise<User | null> {
    const response = await this.apis.user.userByUsername({
      username,
      viewerFid,
    });
    // result.user is undefined if not found
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return response.data.result.user ?? null;
  }

  /**
   * Gets the custody address for the specified user via their username (if found).
   * See [Neynar documentation](https://docs.neynar.com/reference/custody-address-v1)
   *
   */
  public async fetchCustodyAddressForUser(fid: number): Promise<string | null> {
    const response = await this.apis.user.custodyAddress({ fid });
    return response.data.result.custodyAddress;
  }

  // ------------ Cast ------------

  /**
   * Fetches a single cast by its hash.
   * See [Neynar documentation](https://docs.neynar.com/reference/cast-v1)
   *
   */
  public async lookUpCastByHash(
    hash: string,
    options?: { viewerFid?: number }
  ): Promise<Cast | null> {
    const response = await this.apis.cast.cast({
      hash,
      viewerFid: options?.viewerFid,
    });
    return response.data.result.cast;
  }

  /**
   * Gets all casts, including root cast and all replies for a given thread hash. No limit the depth of replies.
   * See [Neynar documentation](https://docs.neynar.com/reference/all-casts-in-thread-v1)
   * Note that the parent provided by the caller is included in the response.
   *
   */
  public async fetchAllCastsInThread(
    threadParent: Cast | { hash: string },
    viewerFid?: number
  ): Promise<Cast[] | null> {
    const response = await this.apis.cast.allCastsInThread({
      threadHash: threadParent.hash,
      viewerFid: viewerFid,
    });
    return response.data.result.casts;
  }

  /**
   * Gets all casts (including replies and recasts) created by the specified user.
   * See [Neynar documentation](https://docs.neynar.com/reference/casts-v1)
   *
   */
  public async fetchAllCastsCreatedByUser(
    fid: number,
    options?: {
      parentUrl?: string;
      viewerFid?: number;
      limit?: number;
      cursor?: string;
    }
  ): Promise<CastsResponse> {
    const response = await this.apis.cast.casts({
      fid: fid,
      viewerFid: options?.viewerFid,
      parentUrl: options?.parentUrl,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  /**
   * Gets recent casts created by the specified user.
   * See [Neynar documentation](https://docs.neynar.com/reference/recent-casts-v1)
   *
   */
  public async fetchRecentCasts(options?: {
    viewerFid?: number;
    limit?: number;
    cursor?: string;
  }): Promise<RecentCastsResponse> {
    const response = await this.apis.cast.recentCasts({
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  // ------------ Verification ------------

  /**
   * Gets all known verifications of a user.
   * See [Neynar documentation](https://docs.neynar.com/reference/verifications-v1)
   *
   */
  public async fetchUserVerifications(
    fid: number
  ): Promise<VerificationResponseResult | null> {
    const response = await this.apis.verification.verifications({ fid });
    return response.data.result;
  }

  /**
   * Checks if a given Ethereum address has a Farcaster user associated with it.
   * Note: if an address is associated with multiple users, the API will return
   * the user who most recently published a verification with the address
   * (based on when Warpcast received the proof, not a self-reported timestamp).
   * See [Neynar documentation](https://docs.neynar.com/reference/user-by-verification-v1)
   *
   */
  public async lookupUserByVerification(address: string): Promise<User | null> {
    try {
      const response = await this.apis.verification.userByVerification({
        address,
      });
      return response.data.result.user;
    } catch (error) {
      if (NeynarV1APIClient.isApiErrorResponse(error)) {
        const status = error.response.status;
        if (status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  // ------------ Notifications ------------

  /**
   * Gets a list of mentions and replies to the user’s casts in reverse chronological order.
   * See [Neynar documentation](https://docs.neynar.com/reference/mentions-and-replies-v1)
   *
   */
  public async fetchMentionAndReplyNotifications(
    fid: number,
    options?: { viewerFid?: number; limit?: number; cursor?: string }
  ): Promise<MentionsAndRepliesResponse> {
    const response = await this.apis.notifications.mentionsAndReplies({
      fid: fid,
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  /**
   * Get a list of likes and recasts to the users’s casts in reverse chronological order.
   * See [Neynar documentation](https://docs.neynar.com/reference/reactions-and-recasts-v1)
   *
   */
  public async fetchUserLikesAndRecasts(
    fid: number,
    options?: { viewerFid?: number; limit?: number; cursor?: string }
  ): Promise<ReactionsAndRecastsResponse> {
    const response = await this.apis.notifications.reactionsAndRecasts({
      fid: fid,
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  // ------------ Reactions ------------

  /**
   * Lists a given cast's likes.
   * See [Neynar documentation](https://docs.neynar.com/reference/cast-likes-v1)
   *
   */
  public async fetchCastLikes(
    castOrCastHash: Cast | string,
    options?: { viewerFid?: number; limit?: number; cursor?: string }
  ): Promise<CastLikesResponse> {
    let castHash: string;
    if (typeof castOrCastHash === "string") {
      castHash = castOrCastHash;
    } else {
      castHash = castOrCastHash.hash;
    }

    const response = await this.apis.reactions.castLikes({
      castHash: castHash,
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  /**
   * Get All Reactions For a Cast.
   * See [Neynar documentation](https://docs.neynar.com/reference/cast-reactions-v1)
   *
   */
  public async fetchCastReactions(
    castOrCastHash: Cast | string,
    options?: { viewerFid?: number; limit?: number; cursor?: string }
  ): Promise<CastReactionsResponse> {
    let castHash: string;
    if (typeof castOrCastHash === "string") {
      castHash = castOrCastHash;
    } else {
      castHash = castOrCastHash.hash;
    }

    const response = await this.apis.reactions.castReactions({
      castHash: castHash,
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  /**
   * Get the list of users who have recasted a specific cast.
   * See [Neynar documentation](https://docs.neynar.com/reference/cast-recasters-v1)
   *
   */
  public async fetchRecasters(
    castOrCastHash: Cast | string,
    options?: { viewerFid?: number; limit?: number; cursor?: string }
  ): Promise<CastRecasterResponse> {
    let castHash: string;
    if (typeof castOrCastHash === "string") {
      castHash = castOrCastHash;
    } else {
      castHash = castOrCastHash.hash;
    }

    const response = await this.apis.reactions.castRecasters({
      castHash: castHash,
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  // ------------ Follows ------------

  /**
   * Get all users that follow the specified user.
   * See [Neynar documentation](https://docs.neynar.com/reference/followers-v1)
   *
   */
  public async fetchUserFollowers(
    fid: number,
    options?: { viewerFid?: number; limit?: number; cursor?: string }
  ): Promise<FollowResponse> {
    const response = await this.apis.follows.followers({
      fid,
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }

  /**
   * Get all users the specified user is following.
   * See [Neynar documentation](https://docs.neynar.com/reference/following-v1)
   *
   */
  public async fetchUserFollowing(
    fid: number,
    options?: { viewerFid?: number; limit?: number; cursor?: string }
  ): Promise<FollowResponse> {
    const response = await this.apis.follows.following({
      fid,
      viewerFid: options?.viewerFid,
      cursor: options?.cursor,
      limit: options?.limit,
    });

    return response.data;
  }
}
