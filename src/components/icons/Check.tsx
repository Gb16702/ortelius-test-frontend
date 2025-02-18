import type { FC } from "react";
import type { IconProperties } from "@/types/icon";

const Check: FC<IconProperties> = ({ width = 16, height = 16, additionalClasses }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={additionalClasses}
      width={width}
      height={height}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
};

export default Check;
