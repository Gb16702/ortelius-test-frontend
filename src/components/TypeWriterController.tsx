import { useState, useEffect } from "react";
import type { TypeWriterOptions } from "@/types/typeWriterController";

export function TypeWriterController({ texts, typingSpeed, deletingSpeed, pauseTime }: TypeWriterOptions) {
  const [index, setIndex] = useState<number>(0);
  const [cycleStart, setCycleStart] = useState<Date | null>(null);

  const currentSentance = texts[index];
  const sentanceLength = currentSentance.length;

  const typedTime = sentanceLength * typingSpeed;
  const deleteTime = sentanceLength * deletingSpeed;
  const totalCycleTime = typedTime + pauseTime + deleteTime;

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setCycleStart(new Date());
    setElapsed(0);
  }, [index]);

  useEffect(() => {
    if (!cycleStart) return;
    let frameId: number;

    const tick = () => {
      const now = new Date().getTime();
      const start = cycleStart.getTime();
      const diff = now - start;
      if (diff >= totalCycleTime) {
        setIndex(prev => (prev + 1) % texts.length);
        return;
      }
      setElapsed(diff);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [cycleStart, texts.length, totalCycleTime]);

  const progress = Math.min((elapsed / totalCycleTime) * 100, 100);

  return {
    index,
    progress,
    elapsed,
    typedTime,
    pauseTime,
    deleteTime,
  };
}
