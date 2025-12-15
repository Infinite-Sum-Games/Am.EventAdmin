import React from 'react';
import { XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
 * A reusable component to display a formatted error message box using Shadcn UI.
 * It uses the 'whitespace-pre-wrap' utility class to ensure 
 * newline characters (\n) are rendered as line breaks.
 * @param {ErrorMessageProps} props The component props.
 * @returns {JSX.Element | null} The error message component.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  if (!message) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mt-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle className='font-bold text-base'>{title}</AlertTitle>
      <AlertDescription className="whitespace-pre-wrap">
        {message}
      </AlertDescription>
    </Alert>
  );
};