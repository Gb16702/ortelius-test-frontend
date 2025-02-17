import { useState } from "react";
import type { ReactNode } from "react";

interface TooltipProperties {
  text: string;
  children: ReactNode;
}

export const Tooltip = ({ text, children }: TooltipProperties) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex justify-center items-center" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      {showTooltip && (
        <div className="absolute bottom-[120%] bg-black text-white text-xs py-1 px-2 rounded-md shadow-md whitespace-nowrap">
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
        </div>
      )}

      {children}
    </div>
  );
};
