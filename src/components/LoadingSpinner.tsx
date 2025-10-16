import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-16 w-16 animate-spin text-white" />
      <p className="text-lg text-white/90">Obteniendo clima...</p>
    </div>
  );
};