import { createPortal } from "react-dom";
import { useEffect, type FC, type MouseEvent } from "react";
import type { ModalProps } from "@/types/modal";

const Modal: FC<ModalProps> = ({ children, className, open, style, onClose, onTouchStart, onTouchMove, onTouchEnd }) => {
  if (!open) return null;

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    function handleEscape(evt: KeyboardEvent) {
      if (evt.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <>
      <div className="fixed w-screen h-screen bg-black/[.2] top-0 left-0 z-50 backdrop-blur-[4px]"></div>
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full h-full flex items-center justify-center"
        onClick={onClose}>
        <div className={className} onClick={handleClick} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={style}
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Modal;
