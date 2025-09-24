import Title from "@/components/atomics/title";
import Image from "next/image";
import React from "react";

type Props = {
  icon?: string;
  title: string;
  subtitle: string;
  /** opsi: custom fallback icon jika src gagal */
  fallbackIcon?: string;
};

function CardFacility({
  icon,
  title,
  subtitle,
  fallbackIcon = "/icons/grey-skyline.svg",
}: Props) {
  const [src, setSrc] = React.useState(icon || fallbackIcon);

  return (
    <figure className="flex items-center space-x-4 border border-border bg-white rounded-[20px] p-5">
      <Image
        src={src || fallbackIcon}
        alt={title ? `${title} icon` : "icon"}
        width={36}
        height={36}
        className="w-9 h-9 object-contain"
        unoptimized
        onError={() => setSrc(fallbackIcon)}
      />
      <div>
        <Title section="facility" title={title} subtitle={subtitle} />
      </div>
    </figure>
  );
}

export default CardFacility;
