import type { FC } from "react";
import Button from "./Button";
import Loader from "./icons/Loader";
import clsx from "clsx";
import Minimize from "./icons/Minimize";

interface MaximizedTextAreaProps {
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const MaximizedTextArea: FC<MaximizedTextAreaProps> = ({ value, disabled, onValueChange, onSubmit, onClose }) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/[.2]"></div>
      <div className={clsx("fixed left-0 bottom-0 h-[94vh] w-full z-[200] bg-white flex flex-col rounded-[14px_14px_0_0]")}>
        <div className="h-[40px] w-full px-3 py-6 flex items-start justify-end font-bold">
          <button type="button" onClick={onClose}>
            <Minimize additionalClasses="cursor-pointer" width={16} height={16} />
          </button>
        </div>

        <div className="flex-1 p-3 mt-6">
          <textarea
            value={value}
            onChange={e => onValueChange(e.target.value)}
            className="w-full h-full resize-none outline-none text-black"
            placeholder="Message to OrteliusAI"
            autoFocus
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
