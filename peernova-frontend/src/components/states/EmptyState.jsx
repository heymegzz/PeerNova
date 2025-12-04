function EmptyState({ icon = '📭', title, message, actionText, onAction }) {
  return (
    <div className="border border-dashed border-[#333333] rounded-xl p-10 flex flex-col items-center justify-center text-center bg-[#0a0a0a]">
      <div className="text-5xl mb-4">{icon}</div>
      {title && <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>}
      {message && <p className="text-gray-400 text-sm max-w-md mb-4">{message}</p>}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-100 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;


