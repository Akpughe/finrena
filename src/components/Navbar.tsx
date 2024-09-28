import React from "react";
import SearchInput from "./SearchInput";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav className="px-16 py-2 h-28 border-b border-[#DBDBE1] flex items-center justify-between">
      <div>
        <Link href={`/`}>LOGO</Link>
      </div>
      <div className="flex gap-10">
        <div className="lg:block hidden">
          <SearchInput />
        </div>
        <div>
          <Link
            href={`/compare`}
            className="h-12 bg-[#81BBDF] hover:bg-blue-500 transition-all rounded-3xl w-36 px-4 flex justify-center items-center capitalize text-[#FFFFFF]">
            compare
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
