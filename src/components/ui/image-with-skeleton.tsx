"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  containerClassName?: string;
  skeletonClassName?: string;
  skeletonWithBorder?: boolean;
  unoptimizedFor?: (url?: string) => boolean;
};

/** Basic utility for joining class names */
function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Default helper to skip optimizer for flaky CDNs like UploadThing */
const defaultUnoptCheck = (url?: string) =>
  !!url && /(^https?:\/\/[^/]*\.ufs\.sh\/)|(^https?:\/\/utfs\.io\/)/i.test(url);

export default function ImageWithSkeleton({
  containerClassName,
  skeletonClassName,
  skeletonWithBorder,
  unoptimizedFor = defaultUnoptCheck,
  className,
  src,
  alt,
  onLoadingComplete,
  ...imgProps
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const showSkeleton = !loaded;

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Skeleton shimmer */}
      {showSkeleton && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse bg-gradient-to-br from-muted/50 to-muted/20",
            skeletonWithBorder && "border border-white/10 rounded-inherit",
            skeletonClassName
          )}
        >
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)] animate-[shimmer_1.6s_infinite]" />
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <Image
        {...imgProps}
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        unoptimized={unoptimizedFor(typeof src === "string" ? src : undefined)}
        onLoadingComplete={(img) => {
          setLoaded(true);
          onLoadingComplete?.(img);
        }}
      />
    </div>
  );
}
