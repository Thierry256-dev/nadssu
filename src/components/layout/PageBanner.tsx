import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  children?: React.ReactNode;
}

export function PageBanner({
  title,
  subtitle,
  imageUrl,
  children,
}: PageBannerProps) {
  return (
    <div className="relative bg-navy min-h-[220px] flex flex-col justify-end overflow-hidden">
      {imageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-blue-brand/50" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/60 to-transparent" />

      <div className="relative container-site py-12 z-10">
        {children && <div className="mb-4">{children}</div>}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/70 text-base max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
