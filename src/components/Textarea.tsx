import { ChangeEvent, useEffect, useRef } from "react";

type Props = {
  value: string;
  onValueChange?: (val: string) => void;
  onSubmit?: () => void;
  onHeightChange?: (height: number) => void;
};

export default function AutoResizeTextarea({ value, onValueChange, onSubmit, onHeightChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = textarea.scrollHeight;
    textarea.style.height = `${newHeight}px`;

    onHeightChange?.(newHeight);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit?.();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(event.target.value);
    adjustHeight();
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className="w-[90%] md:w-full bg-white md:bg-whitish md:outline-1 md:outline-outline-primary focus-within:outline-button-primary transition md:duration-300 rounded-[10px]">
      <textarea
        ref={textareaRef}
        aria-label="Type a message"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={1}
        className="w-full md:px-4 py-2 resize-none placeholder:text-placeholder-primary outline-none text-chat-text-primary min-h-[40px] max-h-[80px] overflow-y-auto leading-5"
        placeholder="Message to OrteliusAI"
        value={value}
        style={{
          height: "auto",
          overflowY: "hidden",
        }}
      />
    </div>
  );
}
