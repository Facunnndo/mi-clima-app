import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <Alert className="border-destructive/50 bg-white/10 backdrop-blur-md text-white">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-white">Error</AlertTitle>
      <AlertDescription className="text-white/90">
        {message}
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline" 
            className="mt-4 border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};