import React from 'react';

interface AsyncBoundaryProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: string, retry: () => void) => React.ReactNode;
}

/**
 * AsyncBoundary Component
 * Displays loading and error states for async operations
 * Wraps content while data is being fetched
 */
export const AsyncBoundary: React.FC<AsyncBoundaryProps> = ({
  isLoading,
  error,
  onRetry = () => {},
  children,
  loadingComponent,
  errorComponent,
}) => {
  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex justify-center items-center min-h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (error) {
    return (
      errorComponent ? (
        errorComponent(error, onRetry)
      ) : (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Failed to load
          </h3>
          <p className="text-amber-800 text-sm mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )
    );
  }

  return <>{children}</>;
};

interface AsyncDataProps<T> {
  data: T[] | T | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  renderData: (data: T[] | T) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: string, retry: () => void) => React.ReactNode;
}

/**
 * AsyncData Component
 * Generic component for displaying async data with loading/error/empty states
 */
export function AsyncData<T>({
  data,
  isLoading,
  error,
  onRetry,
  renderData,
  renderEmpty = () => <div className="text-center py-8">No data available</div>,
  loadingComponent,
  errorComponent,
}: AsyncDataProps<T>) {
  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      {data && (data instanceof Array ? data.length > 0 : true) ? (
        renderData(data)
      ) : (
        renderEmpty()
      )}
    </AsyncBoundary>
  );
}

/**
 * Skeleton Loader Component
 * Shows placeholder while content is loading
 */
export const SkeletonLoader: React.FC<{ count?: number; height?: string }> = ({
  count = 3,
  height = 'h-20',
}) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`${height} bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse`}
      />
    ))}
  </div>
);
