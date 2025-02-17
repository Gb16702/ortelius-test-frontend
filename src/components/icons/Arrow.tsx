import type { ArrowProperties } from "@/types/arrow";
import type { FC } from "react";

const Arrow: FC<ArrowProperties> = ({ width = 14, height = 14, additionalClasses = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      width={width}
      height={height}
      stroke="currentColor"
      className={additionalClasses}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
};

export default Arrow;
