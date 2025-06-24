export interface CallObject<T> {
  toCall: () => Promise<T>;
  uid: string;
}

export interface CallObjectResponse<T> {
  [uid: string]: {
    success: boolean;
    response: T;
    error?: string;
  };
}

export const promiseWithUid = async <T>(
  callObjects: CallObject<T>[]
): Promise<CallObjectResponse<T>> => {
  const results: CallObjectResponse<T> = {};

  await Promise.allSettled(
    callObjects.map(async (callObject) => {
      try {
        const response = await callObject.toCall();
        results[callObject.uid] = {
          success: true,
          response,
        };
      } catch (error) {
        results[callObject.uid] = {
          success: false,
          response: null as T,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    })
  );

  return results;
};
