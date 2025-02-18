import type { FC } from "react";
import Button from "./Button";
import Loader from "./icons/Loader";
import clsx from "clsx";
import Minimize from "./icons/Minimize";
import MessageLengthCalculator from "./MessageLengthCalculator";

interface MaximizedTextAreaProps {
  value: string;
  disabled?: boolean;
  maxLength?: number;
  remainingChars: number;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onCharCountChange: (count: number) => void;
  onClose: () => void;
}

const MaximizedTextArea: FC<MaximizedTextAreaProps> = ({
  value,
  maxLength = 1000,
  disabled,
  remainingChars,
  onValueChange,
  onSubmit,
  onCharCountChange,
  onClose,
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    onValueChange(newText);
    onCharCountChange(maxLength - newText.length);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/[.2]"></div>
      <div className={clsx("fixed left-0 bottom-0 h-[94vh] w-full z-[200] bg-white flex flex-col rounded-[14px_14px_0_0]")}>
        <div className="h-[40px] w-full px-3 py-6 flex items-start justify-between font-bold">
          <MessageLengthCalculator remainingChars={remainingChars} />
          <button type="button" onClick={onClose}>
            <Minimize additionalClasses="cursor-pointer" width={16} height={16} />
          </button>
        </div>

        <div className="flex-1 p-3 mt-6">
          <textarea
            value={value}
            onChange={handleChange}
            className="w-full h-full resize-none outline-none text-black"
            placeholder="Message to OrteliusAI"
            spellCheck={false}
            maxLength={maxLength}
            required
          />
        </div>

        <div className="p-3 h-[90px]">
          <Button
            disabled={!value || disabled}
            type="submit"
            label={disabled ? "" : "Send"}
            variant="black"
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
