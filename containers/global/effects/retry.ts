import { call, delay } from "redux-saga/effects";

export function* retryEffect(
  maxRetries: number,
  action: any,
  funcToCall: (...args: any[]) => Generator<any, any, any>,
  delayMs: number = 1000
): Generator<any, any, any> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Pass attempt number to detect if it's first call or retry
      const result = yield call(funcToCall, action, attempt);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Exponential backoff: delay * attempt number
        yield delay(delayMs * attempt);
      }
    }
  }

  throw lastError;
}
``;
