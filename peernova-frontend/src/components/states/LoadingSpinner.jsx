function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent" />
      {message && <p className="text-gray-400 text-sm">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;


