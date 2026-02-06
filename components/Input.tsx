
import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { COLORS } from '../constants.tsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, ...props }) => {
  const { theme } = useTheme();
  const colors = COLORS[theme];

  return (
    <div className="w-full space-y-1.5">
      <label 
        className="text-sm font-semibold opacity-80"
        style={{ color: colors.text }}
      >
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 transition-opacity">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 ${icon ? 'pl-10' : ''} py-2.5 rounded-xl border-2 outline-none transition-all duration-200 placeholder:opacity-50`}
          style={{ 
            backgroundColor: colors.input,
            borderColor: error ? '#ef4444' : (theme === 'light' ? colors.accent : '#333'),
            color: colors.text,
          }}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium px-1">{error}</p>}
    </div>
  );
};

export default Input;
