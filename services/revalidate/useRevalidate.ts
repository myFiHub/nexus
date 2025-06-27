import { useCallback, useState } from "react";
import { RevalidateResponse, revalidateService } from "./index";

interface UseRevalidateReturn {
  revalidateUser: (userId: string) => Promise<RevalidateResponse>;
  revalidateAllOutposts: () => Promise<RevalidateResponse>;
  revalidateOutpostDetails: (outpostId: string) => Promise<RevalidateResponse>;
  revalidateMultiple: (options: {
    userId?: string;
    outpostId?: string;
    allOutposts?: boolean;
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
    }): Promise<RevalidateResponse[]> => {
      return handleRequest(() => revalidateService.revalidateMultiple(options));
    },
    [handleRequest]
  );

  return {
    revalidateUser,
    revalidateAllOutposts,
    revalidateOutpostDetails,
    revalidateMultiple,
    isLoading,
    error,
    clearError,
  };
}
