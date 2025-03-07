import clsx from "clsx";
import { FC } from "react";

const MessageLengthCalculator: FC<{ remainingChars: number }> = ({ remainingChars }) => {
  return (
    <div
      className={clsx("text-sm font-semibold", {
        "text-red-400": remainingChars <= 25,
        "text-black": remainingChars >= 0,
      })}>
      {remainingChars}
    </div>
  );
};

export default MessageLengthCalculator;