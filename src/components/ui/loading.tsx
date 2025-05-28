import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
}

export function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm", className)}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative">
          <div className="relative h-24 w-24">
            {/* Outer circle */}
            <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
              <div className="absolute inset-0 rounded-full border-4 border-primary opacity-20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            </div>
            {/* Middle circle */}
            <div className="absolute inset-0 m-auto h-16 w-16 animate-[spin_2s_linear_infinite]">
              <div className="absolute inset-0 rounded-full border-4 border-primary/40 opacity-20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            </div>
            {/* Inner circle */}
            <div className="absolute inset-0 m-auto h-10 w-10 animate-[spin_1s_linear_infinite]">
              <div className="absolute inset-0 rounded-full border-4 border-primary/60 opacity-20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}

export function ButtonLoading({ className }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <div className="relative w-5 h-5">
        <div className="absolute inset-0">
          <div className="w-full h-full rounded-full border-2 border-current opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-current animate-spin"></div>
        </div>
      </div>
    </div>
  );
} 