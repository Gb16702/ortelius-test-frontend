import clsx from "clsx";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "./icons/Loader";

const Messages = forwardRef(({ messages, onIsAtBottomChange }: any, ref) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  const [isAtBottom, setIsAtBottom] = useState(true);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  }));

  const checkIfAtBottom = (container: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    return distanceFromBottom < 10;
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const newIsAtBottom = checkIfAtBottom(container);
    setIsAtBottom(newIsAtBottom);
    onIsAtBottomChange?.(newIsAtBottom);
  };

  useEffect(() => {
    containerRef.current = messagesEndRef.current?.closest(".overflow-y-auto") as HTMLDivElement;
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isAtBottom) return;

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAtBottom]);

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((message: any, index: number) => (
        <div
          key={index}
          className={clsx(
            "p-3 rounded-[10px] text-sm whitespace-pre-wrap overflow-wrap-break-word",
            message.isUser ? "bg-button-primary text-white ml-auto" : "bg-white border border-outline-primary mr-auto",
            "max-w-full break-words overflow-hidden"
          )}>
          {message.loading ? (
            <div className="flex items-center justify-center">
              <Loader stroke="#0104b3" />
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose">
              {message.content.replace(/\n\n/g, "\n")}
            </ReactMarkdown>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
});

Messages.displayName = "Messages";
export default Messages;
