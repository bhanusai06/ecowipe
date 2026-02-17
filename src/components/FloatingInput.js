import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FloatingInput = ({ type, name, value, onChange, placeholder, icon: Icon, required }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative mb-6 group">
            <div className={`absolute left-0 top-0 h-full w-1 rounded-l-lg transition-all duration-300 ${isFocused ? 'bg-emerald-500' : 'bg-transparent'}`} />

            <Icon
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-emerald-400' : 'text-gray-500'
                    }`}
                size={20}
            />

            <input
                type={inputType}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-2 border-gray-700 rounded-lg px-12 py-3 text-white placeholder-transparent focus:outline-none focus:border-emerald-400 transition-all duration-300"
                placeholder={placeholder}
                required={required}
            />

            <label
                className={`
          absolute left-12 transition-all duration-300 pointer-events-none
          ${isFocused || value
                        ? '-top-3 text-xs text-emerald-400 bg-[#0f172a] px-2 rounded'
                        : 'top-3 text-gray-500'}
        `}
            >
                {placeholder}
            </label>

            {/* Toggle Password Visibility */}
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}

            {/* Bottom Glow Line */}
            <div className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent transform scale-x-0 transition-transform duration-500 ${isFocused ? 'scale-x-100' : ''}`} />
        </div>
    );
};

export default FloatingInput;
