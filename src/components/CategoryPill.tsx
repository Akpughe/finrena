import React from "react";

const CategoryPill = ({ text, ...rest }: any) => {
  return (
    <button
      {...rest}
      className="h-8 w-fit px-3 border border-[#1D1D2340] rounded-lg flex items-center justify-center text-sm">
      {text}
    </button>
  );
};

export default CategoryPill;
