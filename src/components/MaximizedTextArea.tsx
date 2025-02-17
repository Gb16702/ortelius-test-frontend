import { useRef, useState, type FC } from "react";
import Button from "./Button";
import Loader from "./icons/Loader";
import clsx from "clsx";

interface MaximizedTextAreaProps {
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const MaximizedTextArea: FC<MaximizedTextAreaProps> = ({ value, disabled, onValueChange, onSubmit, onClose }) => {
  const [offset, setOffset] = useState<number>(0);
  const [released, setReleased] = useState<boolean>(false);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setReleased(false);
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    if (diff > 0) {
      setOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setReleased(true);
    if (offset > 400) {
      onClose();
    }
    setOffset(0);
  };

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/[.2]"></div>
      <div
        className={clsx(
          "fixed left-0 bottom-0 h-[92vh] w-full z-[200] bg-white flex flex-col rounded-[14px_14px_0_0]",
          released && "transition-transform duration-300 ease-out"
        )}
        style={{ transform: `translateY(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <div className="h-[40px] w-full p-3 flex items-start justify-center">
          <button type="button" className="outline-none w-[35px] h-[4px] bg-placeholder-primary rounded-full"></button>
        </div>

        <div className="flex-1 p-3">
          <textarea
            value={value}
            onChange={e => onValueChange(e.target.value)}
            className="w-full h-full resize-none outline-none text-chat-text-primary"
            placeholder="Message to OrteliusAI"
          />
        </div>

        <div className="p-3 h-[90px]">
          <Button
            disabled={!value || disabled}
            type="submit"
            label={disabled ? "" : "Send"}
            variant="default"
            rightIcon={disabled && <Loader />}
            additionalClasses={clsx("w-full h-[45px] text-sm font-bold rounded-full", disabled ? "cursor-not-allowed" : "cursor-pointer")}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default MaximizedTextArea;
