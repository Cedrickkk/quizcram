import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, InfoIcon } from 'lucide-react';

export default function ToastAlert({
  title,
  description,
  variant = 'default',
}: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}) {
  return (
    <Alert
      variant={variant === 'destructive' ? 'destructive' : 'default'}
      className={`w-full border ${
        variant === 'success' ? 'border-green-200 bg-green-50 text-green-900' : variant === 'destructive' ? 'border-red-200' : 'border-gray-200'
      }`}
    >
      <div className="flex flex-row gap-3">
        <div className="mt-0.5">
          {variant === 'destructive' ? (
            <AlertCircle className="h-4 w-4" />
          ) : variant === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <InfoIcon className="h-4 w-4" />
          )}
        </div>

        <div>
          <AlertTitle className={`mb-1 font-medium ${variant === 'success' ? 'text-green-800' : ''}`}>{title}</AlertTitle>
          {description && (
            <AlertDescription
              className={`text-sm ${variant === 'success' ? 'text-green-700' : variant === 'destructive' ? 'text-red-700' : 'text-gray-500'}`}
            >
              {description}
            </AlertDescription>
          )}
        </div>
      </div>
    </Alert>
  );
}
