import { ChangeEvent, useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  maxLength?: number;
  onValueChange?: (val: string) => void;
  onSubmit?: () => void;
  onHeightChange?: (height: number) => void;
  onCharCountChange?: (count: number) => void;
};

export default function AutoResizeTextarea({ value, maxLength = 1000, onCharCountChange, onValueChange, onSubmit, onHeightChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    if (!isMobile || !textareaRef.current) return;

    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    onHeightChange?.(textarea.scrollHeight);
  }, [value, isMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit?.();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;

    if (newText.length <= maxLength) {
      onValueChange?.(newText);
      onCharCountChange?.(maxLength - newText.length);
    }
  };

  return (
    <div className="w-[90%] md:w-full md:h-[100px] bg-white focus-within:outline-button-primary transition md:duration-300">
      <textarea
        ref={textareaRef}
        aria-label="Type a message"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        maxLength={maxLength}
        required
        rows={1}
        className="w-full md:px-3 py-2 md:py-3 resize-none placeholder:text-placeholder-primary outline-none text-black max-lg:max-h-[80px] md:min-h-full overflow-y-auto leading-5"
        placeholder="Tell me about maritime logistics..."
        value={value}
      />
    </div>
  );
}
