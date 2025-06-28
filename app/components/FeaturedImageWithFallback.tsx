"use client";
import { useState } from "react";

interface FeaturedImageWithFallbackProps {
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
  heightClass?: string;
}

export default function FeaturedImageWithFallback({
  src,
  alt = "",
  title = "",
  className = "",
  heightClass = "h-96 md:h-[70vh]"
}: FeaturedImageWithFallbackProps) {
  const [error, setError] = useState(false);

  // Only show image if src is valid and not errored
  const showImage = src && !error && /^https?:\/\//.test(src);

  return (
    <div className={`relative w-full ${heightClass} ${className}`} style={{minHeight: '16rem'}}>
      {showImage ? (
        <img
          src={src}
          alt={alt || title}
          className="w-full h-full object-cover"
          style={{borderRadius: 0}}
          onError={() => setError(true)}
          draggable={false}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-400 to-gray-700" style={{minHeight: '16rem'}}>
          <div className="text-white text-center">
            <div className="text-8xl mb-4">📰</div>
            <h1 className="text-4xl font-bold">{title}</h1>
          </div>
        </div>
      )}
    </div>
  );
} 