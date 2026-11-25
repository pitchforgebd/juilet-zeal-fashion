import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { ProductImage } from "@/types/catalog";

type ProductMediaProps = {
  hue: number;
  name: string;
  image?: ProductImage | null;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
};

// Placeholder for items without a photo: a plain warm surface step, no
// initial or pattern, so a missing photo reads as an empty slot rather than
// decoration. `hue` only nudges the lightness a little so a grid of empty
// slots doesn't merge into one block.
function svgData(hue: number, size: number): string {
  const lightness = 92 + (Math.abs(hue) % 3);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="hsl(10 18% ${lightness}%)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function ProductMedia({
  hue,
  name,
  image,
  className,
  imgClassName,
  loading = "lazy",
}: ProductMediaProps) {
  if (image) {
    return (
      <span className={cn("relative block overflow-hidden", className)}>
        <Image
          src={image.url}
          alt={image.alt || name}
          width={640}
          height={640}
          loading={loading}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </span>
    );
  }

  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <Image
        src={svgData(hue, 640)}
        alt={name}
        width={640}
        height={640}
        unoptimized
        loading={loading}
        placeholder="blur"
        blurDataURL={svgData(hue, 8)}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </span>
  );
}
