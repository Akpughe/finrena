import React from "react";
import Image from "next/image";

interface ProductCardProps {
  logoUrl: string | null;
  name: string;
  description: string | null;
  onClick: React.MouseEventHandler<HTMLButtonElement>; // Type for the onClick event
}

const ProductCard = ({
  logoUrl,
  name,
  description,
  onClick,
}: ProductCardProps) => {
  return (
    <div className="lg:w-full md:w-full h-[285px] pt-8 pl-12 pr-4 bg-[#00000008] rounded-xl">
      <div className="">
        <Image
          src={logoUrl ?? ""}
          width={36}
          height={36}
          alt={name}
          className="w-9 h-9"
        />
      </div>
      <div className="pt-6">
        <h4 className="text-2xl font-semibold">{name}</h4>
        <p className="font-medium">Simple • Secure</p>
        <p className="pt-2 line-clamp-2">{description}</p>
      </div>
      <div className="flex w-full justify-end pt-4">
        <button
          onClick={onClick}
          className="w-12 h-12 bg-[#0000000D] flex items-center justify-center rounded-full">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 1L1 13"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
            <path
              d="M13 9.25V1H4.75"
              stroke="black"
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
