import Image from "next/image";
import Link from "next/link";

function CardPurpose({
  image,
  title,
  purpose,
  href,
}: {
  image: string;
  title: string;
  purpose: string;
  href?: string;
}) {
  // Ikuti pola CardDeals dan BoardingHouseShowcase
  const imageSrc = image?.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${image}`;
  const targetHref =
    href || `/boardinghouse/catalog?category=${encodeURIComponent(title)}`;
  return (
    <Link href={targetHref}>
      {" "}
      {/* Ganti sesuai kebutuhan slug */}
      <figure className="relative mx-3 rounded-3xl overflow-hidden shadow-lg w-[310px] h-[200px] flex-shrink-0 cursor-pointer hover:scale-[1.03] transition-transform duration-200">
        <div className="w-full h-full rounded-3xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            height={200}
            width={310}
            className="w-full h-full object-cover bg-gray-300"
            unoptimized
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col p-5 rounded-3xl text-white bg-gradient-to-t from-gradient-black to-transparent to-[30%] pointer-events-none">
          <div className="mt-auto flex items-center justify-between">
            <span className="font-bold text-xl leading-[30px] max-w-[163px]">
              {title}
            </span>
            <div className="flex items-center text-sm leading-[21px]">
              <span className="inline-flex items-center justify-center w-[22px] h-[22px] bg-white bg-opacity-20 rounded-full overflow-hidden">
                <Image
                  src="/icons/profile-2user.svg"
                  alt="profile-icon"
                  height={18}
                  width={18}
                  className="w-[18px] h-[18px]"
                  unoptimized
                />
              </span>
              <span className="ml-1">{purpose}</span>
            </div>
          </div>
        </div>
      </figure>
    </Link>
  );
}

export default CardPurpose;
