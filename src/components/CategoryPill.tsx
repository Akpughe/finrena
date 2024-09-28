import React from "react";

interface CategoryPillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ text, ...rest }) => {
  return (
    <button
      {...rest}
      className="h-8 w-fit px-3 border border-[#1D1D2340] rounded-lg flex items-center justify-center text-sm">
      {text}
    </button>
  );
};

export default CategoryPill;
