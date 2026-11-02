/**
 * Retry utility for API calls with exponential backoff
 * Useful for handling network failures gracefully
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  shouldRetry: (error) => {
    // Retry on network errors and 5xx server errors
    if (error.status === 0) return true; // Network error
    if (error.status >= 500) return true; // Server error
    if (error.status === 429) return true; // Rate limit
    return false;
  },
};

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry this error
      if (!opts.shouldRetry(error, attempt)) {
        throw error;
      }

      // Don't delay on the last attempt
      if (attempt < opts.maxRetries) {
        const delayMs = Math.min(
          opts.baseDelayMs * Math.pow(2, attempt),
          opts.maxDelayMs
        );

        console.warn(
          `Attempt ${attempt + 1} failed. Retrying in ${delayMs}ms...`,
          error
        );

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

/**
 * Create a retryable async thunk for Redux
 * Usage: const fetchData = createRetryableThunk('data/fetch', fetchDataFn)
 */
export function createRetryableAsyncThunk(
  _typePrefix: string,
  asyncFn: () => Promise<any>,
  options?: RetryOptions
) {
  return async () => {
    return retryWithBackoff(() => asyncFn(), options);
  };
}
