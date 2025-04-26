export const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded-md font-medium transition-colors ${className}
      bg-blue-600 text-white hover:bg-blue-700
      disabled:bg-gray-400 disabled:cursor-not-allowed`}
    {...props}
  >
    {children}
  </button>
);
