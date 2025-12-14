import React from 'react';
import { XCircle } from 'lucide-react'; 

/**
 * Props for the ErrorMessage component.
 * @typedef {Object} ErrorMessageProps
 * @property {string} title
 * @property {string | null | undefined} message
 */
interface ErrorMessageProps {
  title: string;
  message?: string | null;
}

/**
 * A reusable component to display a formatted error message box.
 * It uses the 'whitespace-pre-wrap' utility class to ensure 
 * newline characters (\n) are rendered as line breaks.
 * * @param {ErrorMessageProps} props The component props.
 * @returns {JSX.Element} The error message component.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 mt-4">
      <div className="flex items-start gap-3">
        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            {title}
          </p>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1 whitespace-pre-wrap">
            {/* The core functionality: The whitespace-pre-wrap class ensures 
                that \n characters from your Zod error message show as new lines. */}
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};