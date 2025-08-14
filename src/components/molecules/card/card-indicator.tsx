import Title from "@/components/atomics/title";
import Image from "next/image";

function CardIndicator({
  icon,
  title,
  subtitle,
  variant = "",
  section = "",
}: {
  icon: string;
  title: string;
  subtitle: string;
  variant?: "indicator" | "";
  section?: "hero" | "header" | "categories" | "";
}) {
  let imageSrc = icon;
  const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "";
  // Only modify path if NOT local icon
  if (
    imageSrc &&
    !imageSrc.startsWith("http") &&
    !imageSrc.startsWith("/icons/")
  ) {
    // Remove leading slash if present
    if (imageSrc.startsWith("/")) {
      imageSrc = imageSrc.substring(1);
    }
    // Avoid double 'storage/storage/'
    if (imageSrc.startsWith("storage/") || imageSrc.startsWith("cities/")) {
      imageSrc = `${storageBaseUrl.replace(/\/$/, "")}/${imageSrc}`;
    } else {
      imageSrc = `${storageBaseUrl.replace(/\/$/, "")}/storage/${imageSrc}`;
    }
  }
  return (
    <figure
      className={`flex items-center space-x-4 ${
        variant !== "indicator" &&
        "bg-white px-5 py-4 rounded-[20px] border-[3px] border-white hover:border-primary cursor-pointer"
      }`}
    >
      <div
        className={
          variant === "indicator" ? "rounded-full p-[19px] bg-primary" : ""
        }
      >
        {section === "categories" ? (
          <img
            src={imageSrc}
            alt="icon"
            height={32}
            width={32}
            style={{ objectFit: "cover", borderRadius: "8px" }}
          />
        ) : (
          <Image src={imageSrc} alt="icon" height={32} width={32} />
        )}
      </div>
      <div>
        <Title title={title} subtitle={subtitle} section={section} />
      </div>
    </figure>
  );
}

export default CardIndicator;
