import clsx from "clsx";
import { Cross } from "./Cross";

type NoCreditsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBuyCredits: () => void;
};

export default function NoCreditsModal({ isOpen, onClose, onBuyCredits }: NoCreditsModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={clsx("fixed inset-0 z-[100000] flex items-end sm:items-center justify-center bg-black/[.20]")} onClick={handleOverlayClick}>
      <div className="bg-white rounded-[14px] shadow-lg p-6 max-sm: px-4 w-full sm:max-w-md relative" onClick={handleModalClick}>
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold">No Credits Left</h2>
          <Cross onClick={onClose} />
        </div>
        <p className="mb-5 text-sm mt-6">
          You ran <span className="font-semibold">out</span> of credits. You can close this window or <span className="font-semibold">buy</span> more
          credits to continue using <span className="font-semibold">Ortelius AI</span>
        </p>
        <div className="flex justify-end max-sm:justify-center space-x-2 max-sm:space-x-4 mt-8 max-sm:mt-10">
          <button onClick={onClose} className="px-4 py-2 rounded-full cursor-pointer font-semibold text-sm max-sm:w-full max-sm:border max-sm:border-outline-primary">
            Got it
          </button>
          <button onClick={onBuyCredits} className="px-4 py-2 max-sm:py-[11px] bg-button-primary rounded-full font-bold text-sm text-white cursor-pointer max-sm:w-full">
            Buy credits
            {/* Should be something like "Create an account" since Jafar wants the chat to be available even for the users who aren't logged in */}
          </button>
        </div>
      </div>
    </div>
  );
}
