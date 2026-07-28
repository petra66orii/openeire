import Image from "next/image";
import {
  REAL_ESTATE_HERO_IMAGE,
  type RealEstateHeroImageConfig,
} from "@/lib/realEstatePresentation";

export function RealEstateHeroImage({
  image = REAL_ESTATE_HERO_IMAGE,
  objectPositionClassName,
}: {
  image?: RealEstateHeroImageConfig;
  objectPositionClassName: string;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      priority
      sizes="100vw"
      className={`-z-20 object-cover ${objectPositionClassName}`}
    />
  );
}
