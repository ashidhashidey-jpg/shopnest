import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <FiAlertCircle size={36} className="text-coral mb-3" />
      <p className="text-plum-soft mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-plum text-cream rounded-full text-sm hover:bg-plum-soft transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
