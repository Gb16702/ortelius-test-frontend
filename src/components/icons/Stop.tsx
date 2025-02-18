import type { FC } from "react";
import { IconProperties } from "@/types/icon";

const Stop: FC<IconProperties> = ({ width = 16, height = 16, additionalClasses }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={additionalClasses} width={width} height={height}>
      <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
    </svg>
  );
};

export default Stop;
