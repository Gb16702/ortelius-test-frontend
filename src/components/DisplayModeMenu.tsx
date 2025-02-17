import clsx from "clsx";
import { useRef, useState } from "react";
import { FullscreenModeIcon, SidebarModeIcon, ModalModeIcon } from "./icons/DisplayIcons";
import { Tooltip } from "./Tooltip";
import Grip from "./icons/Grip";

interface DisplayModeMenuProperties {
  onModeChange: (mode: string) => void;
  displayMode: string;
}

export const DisplayModeMenu = ({ onModeChange, displayMode }: DisplayModeMenuProperties) => {
  const [grabbing, setGrabbing] = useState<boolean>(false);
  const [dragPositions, setDragPositions] = useState<{ [key: string]: number }>({
    modal: 24,
    maximized: 24,
    sidebar: 24,
  });

  const handleModeChange = (mode: string) => {
    onModeChange(mode);
    localStorage.setItem("display_mode", mode);
  };

  const dragRef = useRef<HTMLDivElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragAreaRef.current || !dragRef.current) return;
    setGrabbing(true);

    const start = e.clientX;

    const startLeft = dragPositions[displayMode];

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragAreaRef.current || !dragRef.current) return;

      const deltaX = e.clientX - start;
      const newLeft = startLeft + deltaX;

      const dragAreaRefWidth = dragAreaRef.current.offsetWidth;
      const dragRefWidth = dragRef.current.offsetWidth;

      const left = Math.min(Math.max(newLeft, 24), dragAreaRefWidth - dragRefWidth + 16);

      setDragPositions(prev => ({
        ...prev,
        [displayMode]: left,
      }));
    };

    const handleMouseUp = () => {
      setGrabbing(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div
        ref={dragAreaRef}
        className={clsx(
          "absolute top-3 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] h-[50px] bg-red-400/[.15] rounded-[10px] border border-red-400/[.3] border-dashed z-[200] max-md:hidden",
          { invisible: !grabbing },
          { "left-0": displayMode === "sidebar" }
        )}
      />

      <div
        ref={dragRef}
        className="absolute top-4 bg-white rounded-[10px] py-2 pl-2 pr-1 border border-outline-primary flex items-center gap-x-4 z-[300] max-md:hidden"
        style={{
          left: `${dragPositions[displayMode]}px`,
          transition: grabbing ? "none" : "left 0.2s ease-out",
          boxShadow: grabbing ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
        }}>
        <div className="flex items-center justify-center gap-x-2">
          <Tooltip text="Modal mode">
            <button
              className={clsx(
                "p-1 rounded-[5px] hover:bg-gray-100 text-chat-text-primary hover:text-black transition-colors duration-200 cursor-pointer",
                { "bg-gray-100 text-black": displayMode === "modal" }
              )}
              onClick={() => handleModeChange("modal")}>
              <ModalModeIcon width={16} height={16} />
            </button>
          </Tooltip>
          <Tooltip text="Maximized mode">
            <button
              className={clsx(
                "p-1 rounded-[5px] hover:bg-gray-100 text-chat-text-primary hover:text-black transition-colors duration-200 cursor-pointer",
                { "bg-gray-100 text-black": displayMode === "maximized" }
              )}
              onClick={() => handleModeChange("maximized")}>
              <FullscreenModeIcon width={16} height={16} />
            </button>
          </Tooltip>
          <Tooltip text="Sidebar mode">
            <button
              className={clsx(
                "p-1 rounded-[5px] hover:bg-gray-100 text-chat-text-primary hover:text-black transition-colors duration-200 cursor-pointer",
                { "bg-gray-100 text-black": displayMode === "sidebar" }
              )}
              onClick={() => handleModeChange("sidebar")}>
              <SidebarModeIcon width={16} height={16} />
            </button>
          </Tooltip>
        </div>
        <Tooltip text="Drag">
          <button
            className={clsx(
              "p-1 rounded-[5px] hover:bg-gray-100 text-chat-text-primary hover:text-black transition-colors duration-200 outline-none",
              grabbing ? "cursor-grabbing" : "cursor-grab"
            )}
            onMouseDown={handleMouseDown}>
            <Grip width={14} height={14} />
          </button>
        </Tooltip>
      </div>
    </>
  );
};
