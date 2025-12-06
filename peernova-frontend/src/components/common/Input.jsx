import { XCircleIcon } from '@heroicons/react/24/outline';

function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onBlur,
  error,
  icon,
  required = false,
  disabled = false,
  name,
  autoComplete
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-white text-xs font-medium mb-1.5">
          {label}
          {required && <span className="text-gray-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2.5 text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full px-3 py-2 ${icon ? 'pl-10' : ''} bg-[#111111] border rounded-lg transition-all duration-300 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
            error 
              ? 'border-gray-500 focus:ring-gray-400 focus:border-gray-400' 
              : 'border-[#333333] hover:border-[#404040] focus:border-white focus:ring-white'
          }`}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-2">
          <XCircleIcon className="h-4 w-4 text-red-400" />
          <p className="text-gray-400 text-xs font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

export default Input;
