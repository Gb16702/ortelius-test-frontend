import Button from "./Button";
import { Cross } from "./Cross";
import Arrow from "./icons/Arrow";
import Modal from "./Modal";
import AutoResizeTextarea from "./Textarea";
import { TypeWriterController } from "./TypeWriterController";
import { useState, useRef, type TouchEvent, useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import Signin from "./SignIn";
import clsx from "clsx";
import Messages from "./Messages";
import type { Message } from "@/types/message";
import Maximize from "./icons/Maximize";
import MaximizedTextArea from "./MaximizedTextArea";
import Stop from "./icons/Stop";
import VoiceInput from "./VoiceInput";
import formatTime from "../utils/formatTime";
import Check from "./icons/Check";
import Loader from "./icons/Loader";
import AudioSpectrum from "./AudioSpectrum";
import { DisplayModeMenu } from "./DisplayModeMenu";
import { Tooltip } from "./Tooltip";
import Robot from "./icons/Robot";
import MessageLengthCalculator from "./MessageLengthCalculator";

const sentances = [
  "Optimize your container routes.",
  "Compare global port fees.",
  "Find the best Incoterms for your cargo.",
  "Reduce your supply chain costs.",
  "Plan multi-stop shipping seamlessly.",
];

const MODES = {
  MODAL: "modal",
  SIDEBAR: "sidebar",
  MAXIMIZED: "maximized",
};

function getDisplayedText(sentance: string, elapsed: number, typedTime: number, pauseTime: number, deleteTime: number) {
  const length = sentance.length;

  if (elapsed < typedTime) {
    const fraction = elapsed / typedTime;
    const count = Math.floor(fraction * length);
    return sentance.slice(0, count);
  } else if (elapsed < typedTime + pauseTime) {
    return sentance;
  } else {
    const timeSinceDelete = elapsed - (typedTime + pauseTime);
    const fraction = timeSinceDelete / deleteTime;
    const count = Math.floor((1 - fraction) * length);
    return sentance.slice(0, count);
  }
}

export default function ChatCallToAction() {
  const { user, isAuthenticated } = useUserStore();

  const sessionId = user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(false);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [maximized, setMaximized] = useState<boolean>(false);
  const [textareaHeight, setTextareaHeight] = useState<number>(40);
  const [generating, setGenerating] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [displayMode, setDisplayMode] = useState(MODES.MODAL);
  const [remainingChars, setRemainingChars] = useState<number>(1000);

  const { index, progress, elapsed, typedTime, pauseTime, deleteTime } = TypeWriterController({
    texts: sentances,
    typingSpeed: 35,
    deletingSpeed: 20,
    pauseTime: 2000,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const generatingRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sentance = sentances[index];
  const text = getDisplayedText(sentance, elapsed, typedTime, pauseTime, deleteTime);

  const touchStartX = useRef<number>(0);
  const visibilityThreshold = 20;

  const maxLength = 1000;

  const handleChatClick = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setTouchStartY(e.touches[0].clientY);
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const swipeDistance = currentX - touchStartX.current;

    if (swipeDistance > visibilityThreshold) {
      setShowBubble(true);
    }

    if (swipeDistance > 0) {
      setSwipeOffset(Math.min(swipeDistance, 80));
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX.current;

    if (swipeDistance > 80) {
      setModalOpen(false);
    }

    setSwipeOffset(0);

    setTimeout(() => {
      setShowBubble(false);
    }, 300);
  };

  const handleSubmit = async () => {
    if (!userPrompt.trim()) return;

    generatingRef.current = true;
    setGenerating(true);
    setMessages(prev => [...prev, { content: userPrompt, isUser: true }, { content: "", isUser: false, loading: true }]);
    setDisabled(true);
    setUserPrompt("");
    setMessagesLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          sessionId,
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedResponse = "";

      try {
        while (generatingRef.current) {
          const result = await reader.read();
          if (result.done) break;

          const chunk = decoder.decode(result.value);

          chunk.split("\n").forEach(line => {
            line = line.trim();
            if (!line) return;
            if (line.startsWith("data:")) {
              const json = line.replace("data:", "").trim();
              if (json === "[DONE]") {
                setGenerating(false);
                generatingRef.current = false;
                return;
              }

              try {
                const parsed = JSON.parse(json);
                if (parsed.choices && parsed.choices[0].delta.content) {
                  streamedResponse += parsed.choices[0].delta.content;

                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      content: streamedResponse,
                      isUser: false,
                    };
                    return newMessages;
                  });
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error reading stream:", error);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            content: "Error processing request.",
            isUser: false,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          content: "Error processing request.",
          isUser: false,
        },
      ]);
    } finally {
      generatingRef.current = false;
      setGenerating(false);
      setDisabled(false);
      setMessagesLoading(false);
    }
  };

  const handleSuccessfulLogin = () => {
    setLoginModalOpen(false);
    setModalOpen(true);
  };

  const handleIsAtBottomChange = (isAtBottom: boolean) => {
    setShowScrollButton(!isAtBottom);
  };

  const messagesRef = useRef<any>(null);

  const handleScrollToBottom = () => {
    messagesRef.current?.scrollToBottom();
  };

  const handleStopGeneration = () => {
    generatingRef.current = false;
    setGenerating(false);
    setDisabled(false);
    setMessagesLoading(false);

    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages[newMessages.length - 1]?.content === "") {
        newMessages.pop();
      }
      return newMessages;
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudio(blob);
      };

      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
  };

  const sendAudio = async (blob: Blob) => {
    if (!blob) return;

    setLoading(true);
    setPaused(true);

    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/audio/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const result = await response.json();
      if (result.text && result.text.trim() !== "you" && result.text.trim().length > 0) {
        setUserPrompt(prev => {
          const maxLength = 1000;
          const newText = `${prev} ${result.text}`.trim();
          const finalText = newText.length > maxLength ? newText.substring(0, maxLength) : newText;

          setRemainingChars(maxLength - finalText.length);

          return finalText;
        });
      }

      setRecording(false);
      setTimer(0);
    } catch (error) {
      console.error("Error sending audio:", error);
    } finally {
      setLoading(false);
      setPaused(false);
    }
  };

  useEffect(() => {
    if (recording && !paused) {
      timerRef.current = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [recording, paused]);

  const formattedTime = formatTime(timer);

  useEffect(() => {
    const savedMode = localStorage.getItem("display_mode");
    if (savedMode && Object.values(MODES).includes(savedMode)) {
      setDisplayMode(savedMode);
    }
  }, []);

  return (
    <>
      {loginModalOpen && (
        <Modal className="max-md:w-full" open={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
          <Signin onClose={() => setLoginModalOpen(false)} onSuccessfulLogin={handleSuccessfulLogin} />
        </Modal>
      )}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setMaximized(false);
            setRecording(false);
          }}
          onTouchStart={e => !maximized && handleTouchStart(e)}
          onTouchMove={e => !maximized && handleTouchMove(e)}
          onTouchEnd={e => !maximized && handleTouchEnd(e)}
          className={clsx("modal-transition", "flex flex-col items-center justify-start bg-whitish rounded-[20px] overflow-hidden", "transform-gpu", {
            [clsx("w-[60%] max-w-[750px] relative", "transform-gpu translate3d(0,0,0)", "max-lg:w-full max-md:h-screen max-md:rounded-none")]:
              displayMode === MODES.MODAL,

            [clsx(
              "w-[80%] max-w-[1200px] h-[80%] relative md:pb-[24px]",
              "transform-gpu translate3d(0,0,0)",
              "max-lg:w-full max-lg:h-full max-lg:rounded-none"
            )]: displayMode === MODES.MAXIMIZED,

            [clsx(
              "w-[25%] h-full fixed right-0 top-0",
              "transform-gpu translate3d(0,0,0)",
              "max-2xl:w-[33%] max-lg:w-[50%] max-sm:w-full",
              "max-w-[600px] rounded-none"
            )]: displayMode === MODES.SIDEBAR,
          })}
          style={{
            transition: "all 300ms cubic-bezier(0.15, 1, 0.3, 1)",
          }}>
          <div className="flex items-center justify-between px-6 max-md:px-3 py-4 h-[70px] w-full border-b border-outline-primary bg-white">
            <button
              type="button"
              className="md:hidden rounded-full flex items-center justify-center relative cursor-pointer focus:outline-red-400"
              onClick={() => {
                setModalOpen(false);
                setMaximized(false);
                setRecording(false);
              }}>
              <Arrow additionalClasses="stroke-black stroke-2" width={18} height={18} />
            </button>
            <h3 className="font-semibold w-[calc(50%+(70.53px/2))]">OrteliusAI</h3>
            <div className="max-md:hidden ">
              <Cross
                onClick={() => {
                  setModalOpen(false);
                  setMaximized(false);
                  setRecording(false);
                }}
              />
            </div>
          </div>
          <div
            className={clsx(" flex-1 max-md:min-h-0 w-full flex flex-col justify-end relative min-h-[500px]", {
              "md:h-[calc(100vh-280px)] md:max-h-[600px]": displayMode === MODES.MODAL,
              "h-[calc(100vh-200px)] md:max-h-[800px]": displayMode === MODES.MAXIMIZED,
              "h-[calc(100vh-140px)]": displayMode === MODES.SIDEBAR,
            })}>
            <DisplayModeMenu onModeChange={setDisplayMode} displayMode={displayMode} />
            <div className="w-full overflow-y-auto px-6 max-md:px-3 py-4 flex flex-col gap-y-4">
              <div className="w-full rounded-[10px] outline outline-outline-primary bg-white p-3">
                <div className="flex gap-x-1.5 items-center justify-start">
                  <Robot width={14} height={14} additionalClasses="fill-black stroke-2" />
                  <h3 className="font-medium text-sm text-black">
                    <span className="font-bold text-xs">Ortelius AI</span>
                  </h3>
                </div>
                <p className="font-medium text-chat-text-primary pt-3 text-sm">
                  Hello, I'm Ortelius AI. I can help <span className="text-black">plan routes</span>, compare{" "}
                  <span className="text-black">shipping costs</span>, clarify <span className="text-black">Incoterms</span>, and handle a variety of
                  other <span className="text-black">maritime-related</span> tasks. Let me know how I can assist you !
                </p>
              </div>
              {showScrollButton && (
                <button
                  onClick={handleScrollToBottom}
                  className="absolute bottom-1 shadow-[0px_3px_4px_0_] shadow-placeholder-primary/[.5] border border-outline-primary left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center cursor-pointer">
                  <Arrow additionalClasses="-rotate-90" />
                </button>
              )}
              <Messages ref={messagesRef} messages={messages} onIsAtBottomChange={handleIsAtBottomChange} loading={messagesLoading} />
            </div>
          </div>
          <div
            className="fixed z-100 transition-all duration-200 ease-out"
            style={{
              top: `${touchStartY - 20}px`,
              left: 12,
            }}>
            {showBubble && (
              <div
                className="h-[40px] bg-button-primary flex items-center justify-center relative transition-all duration-500 ease-out"
                style={{
                  width: `${swipeOffset}px`,
                  maxWidth: "40px",
                  borderTopRightRadius: "50px",
                  borderBottomRightRadius: "50px",
                  borderTopLeftRadius: `${Math.max(10, swipeOffset / 1.5)}px`,
                  borderBottomLeftRadius: `${Math.max(10, swipeOffset / 1.5)}px`,
                }}>
                <Arrow additionalClasses={`stroke-white stroke-4 ${swipeOffset < 30 && "hidden"}`} width={16} height={16} />
              </div>
            )}
          </div>

          <div className={clsx("flex items-end justify-center px-6 max-md:px-3 md:min-h-[140px] w-full flex-col gap-y-2 pb-6 max-md:pb-3 pt-[12px] max-md:border-t border-outline-primary max-md:bg-white relative z-100", {
          })}>
            {recording ? (
              <>
                <div className="flex items-center justify-center w-full h-[70px] md:p-3 md:bg-white md:rounded-[10px] md:border md:border-outline-primary">
                  <div className="w-[15%] flex items-center justify-start">
                    <button
                      type="button"
                      className="w-[24px] h-[24px] rounded-full flex items-center justify-center cursor-pointer relative bg-whitish border border-placeholder-primary"
                      onClick={() => {
                        setRecording(false);
                        setTimer(0);
                      }}>
                      <span className="w-[10px] bg-black h-[2px] rounded-full rotate-45 absolute"></span>
                      <span className="w-[10px] bg-black h-[2px] rounded-full -rotate-45 absolute"></span>
                    </button>
                  </div>
                  <div className="w-[60%]">
                    <AudioSpectrum stream={audioStream} />
                  </div>
                  <div className="w-[16%] flex items-center justify-center">
                    <span className="text-sm text-black font-semibold tracking-tighter">{formattedTime}</span>
                  </div>
                  <div className="w-[9%] flex items-center justify-end">
                    {loading ? (
                      <Loader stroke="black" />
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="w-[24px] h-[24px] rounded-full flex items-center justify-center cursor-pointer bg-black disabled:cursor-not-allowed">
                        <Check width={10} height={10} additionalClasses="stroke-3 stroke-white" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-start justify-center w-full gap-x-2 bg-white md:outline-1 md:outline-outline-primary rounded-[10px]">
                <div className="w-full flex items-start gap-x-2 overflow-y-hidden">
                  <AutoResizeTextarea
                    value={userPrompt}
                    onValueChange={t => setUserPrompt(t)}
                    onSubmit={handleSubmit}
                    onHeightChange={(height: number) => setTextareaHeight(height)}
                    onCharCountChange={setRemainingChars}
                  />
                  {textareaHeight >= 80 && (
                    <button
                      type="button"
                      aria-label="Maximize"
                      className="flex items-center justify-center md:hidden w-[32px] h-[32px] relative bottom-1 cursor-pointer z-50"
                      onClick={() => setMaximized(true)}>
                      <Maximize width={16} height={16} />
                    </button>
                  )}

                  {maximized && (
                    <MaximizedTextArea
                      value={userPrompt}
                      disabled={disabled}
                      onValueChange={setUserPrompt}
                      onSubmit={handleSubmit}
                      onCharCountChange={setRemainingChars}
                      remainingChars={remainingChars}
                      onClose={() => setMaximized(false)}
                    />
                  )}
                </div>
                <div className="max-md:hidden w-full h-[50px] px-4 flex items-center justify-between">
                  <MessageLengthCalculator remainingChars={remainingChars} />
                  <div
                    className={clsx("flex items-center justify-center gap-x-2", {
                      hidden: recording,
                    })}>
                    <Tooltip text="Use voice mode">
                      <VoiceInput onRecording={startRecording} />
                    </Tooltip>
                    <button
                      type="button"
                      disabled={!generating && !userPrompt.trim()}
                      className={clsx(
                        "min-w-[32px] min-h-[32px] rounded-full outline outline-outline-primary flex items-center justify-center bg-black",
                        !generating && !userPrompt.trim() && "opacity-10 cursor-not-allowed"
                      )}
                      onClick={generating ? handleStopGeneration : handleSubmit}>
                      {generating ? (
                        <Stop width={18} height={18} additionalClasses="stroke-white fill-white" />
                      ) : (
                        <Arrow additionalClasses="stroke-white stroke-3 rotate-90" width={18} height={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="w-full flex md:hidden justify-between items-center">
                  <div
                    className={clsx("text-sm font-semibold", {
                      "text-red-400": remainingChars <= 25,
                      "text-chat-text-primary": remainingChars >= 0,
                    })}>
                    {remainingChars}
                  </div>
                  <div className="flex gap-x-2">
                    <VoiceInput onRecording={startRecording} />
                    <button
                      type="button"
                      disabled={!generating && !userPrompt.trim()}
                      className={clsx(
                        "min-w-[32px] min-h-[32px] md:hidden rounded-full outline outline-outline-primary flex items-center justify-center bg-black",
                        !generating && !userPrompt.trim() && "opacity-10 cursor-not-allowed"
                      )}
                      onClick={generating ? handleStopGeneration : handleSubmit}>
                      {generating ? (
                        <Stop width={18} height={18} additionalClasses="stroke-white fill-white" />
                      ) : (
                        <Arrow additionalClasses="stroke-white stroke-3 rotate-90" width={18} height={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
      <div className="relative w-[800px] h-[90px] max-md:min-h-[150px] bg-white border border-outline-primary rounded-[10px] flex items-center justify-between px-4 overflow-hidden max-md:flex-col max-md:justify-between max-md:p-3">
        <h3 className="font-medium max-md:text-left max-md:w-full">Ask our AI to {text.toLowerCase()}</h3>
        <Button
          disabled={false}
          type="button"
          label="Start new chat"
          variant="default"
          rightIcon={<Arrow width={16} height={14} additionalClasses="rotate-180 stroke-3 md:hidden" />}
          additionalClasses="h-[40px] max-md:h-[47px] px-3 max-md:px-5 text-sm font-semibold rounded-full transition-colors duration-300 outline-none max-md:w-full text-left flex justify-between items-center cursor-pointer"
          onClick={handleChatClick}
        />

        <div className="absolute bottom-0 left-0 h-[3px] bg-button-primary max-md:hidden" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
}
