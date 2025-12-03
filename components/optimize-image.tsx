import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type OptimizeImageProps = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  imgClassName?: string;
  sizes?: string;
  quality?: number;
  unoptimized?: boolean;
  priority?: boolean;
  showSkeleton?: boolean;
  persistOnError?: boolean;
  fallbackSrc?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
};

export default function OptimizeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  containerClassName,
  imgClassName,
  sizes,
  quality,
  unoptimized = true,
  priority,
  showSkeleton = true,
  persistOnError = true,
  fallbackSrc,
  fallback,
  onLoad,
  onError,
}: OptimizeImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);
  const [usingFallback, setUsingFallback] = React.useState(false);

  const actualSrc = React.useMemo(() => {
    if (errored && fallbackSrc) return fallbackSrc;
    return src;
  }, [src, errored, fallbackSrc]);

  const hasSrc = Boolean(actualSrc);

  const handleLoadComplete = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setErrored(true);
    if (fallbackSrc && !usingFallback) {
      setUsingFallback(true);
      setLoaded(false);
    }
    onError?.();
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={cn("relative overflow-hidden", containerClassName)} style={{ width, height }}>
      {children}
      {showSkeleton && (!loaded || (persistOnError && errored)) && (
        <Skeleton className={cn("absolute inset-0 w-full h-full", className)} />
      )}
    </div>
  );

  if (!hasSrc && fallback) {
    return <Wrapper>{fallback}</Wrapper>;
  }

  return (
    <Wrapper>
      {hasSrc ? (
        <Image
          src={String(actualSrc)}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          unoptimized={unoptimized}
          className={cn(
            fill ? "object-contain" : "",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
          onLoad={handleLoadComplete}
          onError={handleError}
        />
      ) : null}
    </Wrapper>
  );
}
