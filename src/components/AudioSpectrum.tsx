import { useEffect, useRef, type FC } from "react";

interface AudioSpectrumProps {
  stream: MediaStream | null;
}

const AudioSpectrum: FC<AudioSpectrumProps> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const barsRef = useRef<{ height: number; color: string }[]>([]);
  const scrollOffsetRef = useRef(0);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;

    analyser.fftSize = 64;
    source.connect(analyser);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const numBars = 80;
    const barWidth = 4;
    const spacing = 2;
    const baseBarHeight = 5;
    const amplificationFactor = 4;
    const scrollSpeed = 0.3;

    barsRef.current = Array(numBars).fill({ height: baseBarHeight, color: "#e8e8e8" });

    const animate = () => {
      if (!analyser) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);

      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const newHeight = Math.max(Math.pow(average / 255, 2) * (canvas.height * amplificationFactor), baseBarHeight);
      const newColor = average > 50 ? "rgba(0, 0, 0, 1)" : "#e8e8e8";

      scrollOffsetRef.current += scrollSpeed;

      if (scrollOffsetRef.current >= barWidth + spacing) {
        scrollOffsetRef.current = 0;
        barsRef.current.unshift({ height: newHeight, color: newColor });
        barsRef.current.pop();
      }

      for (let i = 0; i < numBars; i++) {
        const x = canvas.width - (i * (barWidth + spacing)) - scrollOffsetRef.current;
        const y = (canvas.height - barsRef.current[i].height) / 2;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barsRef.current[i].height, barWidth / 2);
        ctx.fillStyle = barsRef.current[i].color;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [stream]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <canvas
        ref={canvasRef}
        width={300}
        height={50}
        className="w-full max-w-[280px]"
      />
    </div>
  );
};

export default AudioSpectrum;
