import React, { useState, useEffect, useRef } from "react";
import useSupabaseClient from "@/hooks/useSupabaseClient";
import { useSearchProductsQuery } from "@/hooks/use-utilities";
import { useRouter } from "next/router";
import { Product } from "@/hooks/use-products";

const SearchInput = () => {
  const router = useRouter();
  const client = useSupabaseClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch search results
  const {
    data: products,
    isLoading,
    error,
  } = useSearchProductsQuery(client, debouncedSearchTerm);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownVisible(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (product: Product) => {
    setSearchTerm(product?.name);
    setIsDropdownVisible(false);
    router.push(`/product-info/${product?.id}`);
  };
  return (
    <div className="relative w-[308px]">
      <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
        <svg
          width="25"
          height="22"
          viewBox="0 0 25 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 16.5L23.5 21"
            stroke="black"
            strokeOpacity="0.75"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C14.9706 19 19 14.9706 19 10Z"
            stroke="black"
            strokeOpacity="0.75"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <input
        id="default-search"
        className="block w-full px-5 py-3 ps-14 text-base text-black rounded-3xl bg-[#00000008] outline-none "
        placeholder="What are you looking for?"
        type="search"
        value={searchTerm}
        onChange={handleChange}
      />
      {isDropdownVisible && searchTerm && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-2">Loading...</div>
          ) : error ? (
            <div className="p-2 text-red-500">Error loading products</div>
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(product)}>
                {product.name}
              </div>
            ))
          ) : (
            <div className="p-2">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
