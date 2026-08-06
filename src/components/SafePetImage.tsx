"use client";

import Image from "next/image";
import { PawPrint } from "lucide-react";
import { useState } from "react";

export default function SafePetImage({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="pet-image-fallback" role="img" aria-label={`${alt}. Image unavailable.`}>
        <PawPrint />
        <span>Photo unavailable</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={/\.gif(?:\?|$)/i.test(src)}
      onError={() => setFailed(true)}
    />
  );
}
