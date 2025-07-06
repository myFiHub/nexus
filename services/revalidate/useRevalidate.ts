import { useCallback, useState } from "react";
import {
  RevalidateResponse,
  revalidateService,
  UserDataRevalidateOptions,
} from "./index";

interface UseRevalidateReturn {
  revalidateUser: (userId: string) => Promise<RevalidateResponse>;
  revalidateUserData: (
    userId: string,
    options?: UserDataRevalidateOptions
  ) => Promise<RevalidateResponse>;
  revalidateUserBasicData: (userId: string) => Promise<RevalidateResponse>;
  revalidateUserFollowers: (userId: string) => Promise<RevalidateResponse>;
  revalidateUserFollowings: (userId: string) => Promise<RevalidateResponse>;
  revalidateUserPassBuyers: (userId: string) => Promise<RevalidateResponse>;
  revalidateAllUserData: (userId: string) => Promise<RevalidateResponse>;
  revalidateAllOutposts: () => Promise<RevalidateResponse>;
  revalidateOutpostDetails: (outpostId: string) => Promise<RevalidateResponse>;
  revalidateMultiple: (options: {
    userId?: string;
    outpostId?: string;
    allOutposts?: boolean;
    userDataOptions?: UserDataRevalidateOptions;
  }) => Promise<RevalidateResponse[]>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useRevalidate(): UseRevalidateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleRequest = useCallback(
    async <T>(requestFn: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await requestFn();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const revalidateUser = useCallback(
    async (userId: string): Promise<RevalidateResponse> => {
      return handleRequest(() => revalidateService.revalidateUser(userId));
    },
    [handleRequest]
  );

  const revalidateUserData = useCallback(
    async (
      userId: string,
      options?: UserDataRevalidateOptions
    ): Promise<RevalidateResponse> => {
      return handleRequest(() =>
        revalidateService.revalidateUserData(userId, options)
      );
    },
    [handleRequest]
  );

  const revalidateUserBasicData = useCallback(
    async (userId: string): Promise<RevalidateResponse> => {
      return handleRequest(() =>
        revalidateService.revalidateUserBasicData(userId)
      );
    },
    [handleRequest]
  );

  const revalidateUserFollowers = useCallback(
    async (userId: string): Promise<RevalidateResponse> => {
      return handleRequest(() =>
        revalidateService.revalidateUserFollowers(userId)
      );
    },
    [handleRequest]
  );

  const revalidateUserFollowings = useCallback(
    async (userId: string): Promise<RevalidateResponse> => {
      return handleRequest(() =>
        revalidateService.revalidateUserFollowings(userId)
      );
    },
    [handleRequest]
  );

  const revalidateUserPassBuyers = useCallback(
    async (userId: string): Promise<RevalidateResponse> => {
      return handleRequest(() =>
        revalidateService.revalidateUserPassBuyers(userId)
      );
    },
    [handleRequest]
  );

  const revalidateAllUserData = useCallback(
    async (userId: string): Promise<RevalidateResponse> => {
      return handleRequest(() =>
        revalidateService.revalidateAllUserData(userId)
      );
    },
    [handleRequest]
  );

  const revalidateAllOutposts =
    useCallback(async (): Promise<RevalidateResponse> => {
      return handleRequest(() => revalidateService.revalidateAllOutposts());
    }, [handleRequest]);

  const revalidateOutpostDetails = useCallback(
    async (outpostId: string): Promise<RevalidateResponse> => {
      return handleRequest(() =>
        revalidateService.revalidateOutpostDetails(outpostId)
      );
    },
    [handleRequest]
  );

  const revalidateMultiple = useCallback(
    async (options: {
      userId?: string;
      outpostId?: string;
      allOutposts?: boolean;
      userDataOptions?: UserDataRevalidateOptions;
    }): Promise<RevalidateResponse[]> => {
      return handleRequest(() => revalidateService.revalidateMultiple(options));
    },
    [handleRequest]
  );

  return {
    revalidateUser,
    revalidateUserData,
    revalidateUserBasicData,
    revalidateUserFollowers,
    revalidateUserFollowings,
    revalidateUserPassBuyers,
    revalidateAllUserData,
    revalidateAllOutposts,
    revalidateOutpostDetails,
    revalidateMultiple,
    isLoading,
    error,
    clearError,
  };
}
