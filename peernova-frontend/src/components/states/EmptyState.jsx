import {
  InboxIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BookOpenIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

function EmptyState({ icon, title, message, actionText, onAction }) {
  // Default icon component - if string passed, use default, otherwise use component
  let IconComponent = InboxIcon;
  if (icon) {
    if (typeof icon === 'string') {
      // Map string emojis to icons for backward compatibility
      const iconMap = {
        '⚠️': ExclamationTriangleIcon,
        '👥': UserGroupIcon,
        '📚': BookOpenIcon,
        '📄': DocumentTextIcon,
      };
      IconComponent = iconMap[icon] || InboxIcon;
    } else {
      IconComponent = icon;
    }
  }
  
  return (
    <div className="border border-dashed border-[#333333] rounded-xl p-10 flex flex-col items-center justify-center text-center bg-[#0a0a0a]">
      <div className="mb-4">
        <IconComponent className="h-16 w-16 text-gray-500 mx-auto" />
      </div>
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


