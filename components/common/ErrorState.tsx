interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Error loading data",
  message = "Please try again later",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-red-500 text-lg mb-2">{title}</div>
      <p className="text-gray-400 text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
