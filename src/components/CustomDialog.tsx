import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface CustomDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'info' | 'error' | 'success';
    showInput?: boolean;
    inputValue?: string;
    onInputChange?: (value: string) => void;
    onConfirm?: (value?: string) => void;
    placeholder?: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    showInput = false,
    inputValue = '',
    onInputChange,
    onConfirm,
    placeholder = ''
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            const timer = setTimeout(() => setVisible(false), 200); // Wait for exit animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!visible && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog Content */}
            <div
                className={`
                    relative 
                    bg-white/90 dark:bg-slate-800/90 
                    backdrop-filter backdrop-blur-xl 
                    rounded-2xl p-6 
                    shadow-2xl 
                    max-w-xs w-full 
                    border border-white/20 dark:border-slate-700/50
                    transform transition-all duration-200
                    ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
                `}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-bold ${type === 'error' ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                        {title}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">
                    {message}
                </p>

                {showInput && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => onInputChange?.(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 mb-6 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        autoFocus
                    />
                )}

                <button
                    onClick={() => onConfirm ? onConfirm(inputValue) : onClose()}
                    className={`
                        w-full py-2.5 
                        rounded-xl font-medium text-sm
                        transition-transform active:scale-95
                        text-white shadow-lg shadow-blue-500/20
                        bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                    `}
                >
                    Okay
                </button>
            </div>
        </div>
    );
};

export default CustomDialog;
