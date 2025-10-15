interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center gap-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
        <p className="text-gray-500 text-lg">{message}</p>
      </div>
    </div>
  );
}
