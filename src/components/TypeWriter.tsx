import { useState, useEffect, type FC } from "react";
import type { TypeWriterProps } from "@/types/typewriter";

const TypeWriter: FC<TypeWriterProps> = ({ texts, typingSpeed = 100, deletingSpeed = 50, pauseTime = 1000, onProgressChange }) => {
  const [currentText, setCurrentText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const currentIndex = texts[index];
    const indexLength = currentIndex.length;

    let progress = 0;
    if (!deleting) {
      const fractionTyped = currentText.length / indexLength;
      progress = Math.floor(fractionTyped * 50);
    } else {
      const fractionDeleted = (indexLength - currentText.length) / indexLength;
      progress = Math.floor(50 + fractionDeleted * 50);
    }

    onProgressChange?.(progress);

    if (!deleting) {
      if (currentText.length < currentIndex.length) {
        const nextChar = currentIndex.charAt(currentText.length);
        const timeoutId = setTimeout(() => {
          setCurrentText(prev => prev + nextChar);
        }, typingSpeed);

        return () => clearTimeout(timeoutId);
      } else {
        const timeoutId = setTimeout(() => {
          setDeleting(true);
        }, pauseTime);

        return () => clearTimeout(timeoutId);
      }
    } else {
      if (currentText.length > 0) {
        const timeoutId = setTimeout(() => {
          setCurrentText(prev => prev.slice(0, -1));
        }, deletingSpeed);

        return () => clearTimeout(timeoutId);
      } else {
        setDeleting(false);
        setIndex(prev => (prev + 1) % texts.length);
      }
    }
  }, [currentText, deleting, index, texts, typingSpeed, deletingSpeed, pauseTime]);

  return <h3 className="font-medium">Ask our AI to {currentText.toLocaleLowerCase()}</h3>;
};

export default TypeWriter;
