import type { FC } from "react";
import Microphone from "./icons/Microphone";
import clsx from "clsx";

const VoiceInput: FC<any> = ({ onRecording }) => {
  return (
    <>
      <button
        type="button"
        className={clsx("min-w-[32px] min-h-[32px] md:hidden rounded-full flex items-center justify-center cursor-pointer")}
        onClick={onRecording}>
        <Microphone additionalClasses="fill-black stroke-4" width={18} height={18} />
      </button>
    </>
  );
};

export default VoiceInput;
