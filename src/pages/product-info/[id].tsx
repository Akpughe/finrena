import { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/router";
import { useProductDetailsQuery } from "@/hooks/use-products";
import useSupabaseClient from "@/hooks/useSupabaseClient";

const ProductInfo = () => {
  const client = useSupabaseClient();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const productId: number | any = router.query?.id;

  const { data: productDetails, isLoading } = useProductDetailsQuery(
    client,
    productId
  );

  console.log("productDetails", productDetails);
  return (
    <>
      <Navbar />
      <div className="pt-20 lg:px-20 px-5 lg:max-w-7xl max-w-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full bg-[#00000008] lg:px-16 px-4 py-10 rounded-3xl ">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push(`/`)}
                className="w-12 h-12 bg-[#0000000D] flex items-center justify-center rounded-full">
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.07322 1.28033C6.36612 0.987437 6.36612 0.512563 6.07322 0.21967C5.78033 -0.0732231 5.30546 -0.0732231 5.01256 0.21967L0.719669 4.51256L0.695304 4.53692C0.550209 4.6819 0.393317 4.83867 0.278733 4.98885C0.144499 5.16478 -2.36764e-07 5.41653 -2.5134e-07 5.75C-2.65917e-07 6.08347 0.144499 6.33522 0.278734 6.51115C0.393318 6.66134 0.550212 6.81811 0.695308 6.96309L0.71967 6.98744L5.01256 11.2803C5.30546 11.5732 5.78033 11.5732 6.07322 11.2803C6.36612 10.9874 6.36612 10.5126 6.07322 10.2197L2.35366 6.50011L16.5429 6.49988C16.9571 6.49987 17.2929 6.16408 17.2929 5.74987C17.2929 5.33565 16.9571 4.99987 16.5429 4.99988L2.35344 5.00011L6.07322 1.28033Z"
                    fill="black"
                  />
                </svg>
              </button>

              <button>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.0002 6.35248L13.3536 6.97482C13.5228 7.15059 13.7562 7.2499 14.0002 7.2499C14.2442 7.2499 14.4776 7.15059 14.6468 6.97482L14.0002 6.35248ZM8.01837 19.4186C7.63566 19.1037 7.07019 19.1587 6.75519 19.5414C6.4403 19.9241 6.49521 20.4895 6.8778 20.8045L8.01837 19.4186ZM2.44429 15.8179C2.68207 16.2527 3.22741 16.4125 3.66218 16.1746C4.09705 15.9368 4.25674 15.3916 4.01885 14.9567L2.44429 15.8179ZM2.93243 10.7035C2.93243 8.13004 4.38668 5.97185 6.37162 5.06448C8.30012 4.18303 10.8912 4.41643 13.3536 6.97482L14.6468 5.73024C11.725 2.69465 8.33359 2.19437 5.62557 3.43217C2.97399 4.64426 1.1377 7.45859 1.1377 10.7035H2.93243ZM9.80927 23.1027C10.4222 23.5859 11.0801 24.1011 11.747 24.4908C12.4135 24.8803 13.1741 25.1967 14.0002 25.1967V23.402C13.6297 23.402 13.1939 23.2576 12.6525 22.9412C12.1113 22.625 11.5499 22.1894 10.9204 21.6932L9.80927 23.1027ZM18.1911 23.1027C19.898 21.7572 22.0799 20.2152 23.7916 18.2878C25.534 16.3259 26.8627 13.8929 26.8627 10.7035H25.068C25.068 13.3327 23.992 15.3594 22.4496 17.0962C20.8764 18.8676 18.8934 20.2637 17.08 21.6932L18.1911 23.1027ZM26.8627 10.7035C26.8627 7.45859 25.0264 4.64426 22.3748 3.43217C19.6668 2.19437 16.2753 2.69465 13.3536 5.73024L14.6468 6.97482C17.1091 4.41643 19.7003 4.18303 21.6287 5.06448C23.6137 5.97185 25.068 8.13004 25.068 10.7035H26.8627ZM17.08 21.6932C16.4505 22.1894 15.8891 22.625 15.3479 22.9412C14.8065 23.2576 14.3706 23.402 14.0002 23.402V25.1967C14.8263 25.1967 15.5869 24.8803 16.2534 24.4908C16.9203 24.1011 17.5781 23.5858 18.1911 23.1027L17.08 21.6932ZM10.9204 21.6932C9.96809 20.9426 9.00034 20.2269 8.01837 19.4186L6.8778 20.8045C7.87126 21.6223 8.92071 22.4022 9.80927 23.1027L10.9204 21.6932ZM4.01885 14.9567C3.3474 13.7289 2.93243 12.3382 2.93243 10.7035H1.1377C1.1377 12.6629 1.64016 14.3477 2.44429 15.8179L4.01885 14.9567Z"
                    fill="#1D1D23"
                  />
                </svg>
              </button>
            </div>

            <div className="border-[0.5px] border-[#C5C5C5] mt-10"></div>

            <div className="mt-10 flex lg:flex-row flex-col gap-y-5 justify-between w-full">
              <div className="flex items-center gap-4">
                <div>
                  <Image
                    src={productDetails?.logo_url!}
                    alt={productDetails?.name!}
                    width={40}
                    height={20}
                  />
                </div>
                <div className="">
                  <h4 className="text-2xl font-semibold">
                    {productDetails?.name}
                  </h4>
                  <p>Simple . Secure</p>
                </div>
              </div>
              <div>
                <button className="h-12 bg-[#0000001A] rounded-3xl w-36 px-4 flex justify-center items-center capitalize text-[#000000]">
                  compare
                </button>
              </div>
            </div>

            <div className="relative border-b border-[#00000080] flex gap-8 pt-10">
              <div
                className={`relative cursor-pointer pb-8 px-5 bottom-[-1.5px] ${
                  activeTab === "overview" ? "border-b-2 border-[#81BBDF]" : ""
                }`}
                onClick={() => setActiveTab("overview")}>
                <p
                  className={`${
                    activeTab === "overview"
                      ? "text-[#81BBDF]"
                      : "text-[#1D1D2380]"
                  } font-bold tracking-wider text-lg`}>
                  Overview
                </p>
              </div>
              <div
                className={`relative cursor-pointer pb-8 px-5 bottom-[-1.5px] ${
                  activeTab === "features" ? "border-b-2 border-[#81BBDF]" : ""
                }`}
                onClick={() => setActiveTab("features")}>
                <p
                  className={`${
                    activeTab === "features"
                      ? "text-[#81BBDF]"
                      : "text-[#1D1D2380]"
                  } font-bold tracking-wider text-lg`}>
                  Features
                </p>
              </div>
            </div>

            {/* about */}

            <div className="pt-10">
              {activeTab == "overview" && (
                <div>
                  <h4 className="text-3xl font-bold">
                    About {productDetails?.name}
                  </h4>
                  <p className="text-lg pt-4">{productDetails?.description}</p>
                </div>
              )}

              {activeTab == "features" && (
                <div>
                  <ul className="flex flex-col gap-y-5">
                    {productDetails?.features.map((prod) => {
                      return (
                        <li>
                          <p className="text-2xl font-bold">{prod.name}</p>
                          <p>{prod.description}</p>
                          <small>{prod?.value}</small>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductInfo;
