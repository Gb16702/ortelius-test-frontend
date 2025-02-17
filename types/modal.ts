import type { ReactNode, TouchEvent, CSSProperties } from "react";


export interface ModalProps {
  className?: string;
  children: ReactNode;
  open: boolean;
  style?: CSSProperties;
  onClose: () => void;
  onTouchStart?: (e: TouchEvent) => void;
  onTouchMove?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
}
