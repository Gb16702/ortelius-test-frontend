import clsx from "clsx";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "./icons/Loader";
import Robot from "./icons/Robot";
import User from "./icons/User";
import Copy from "./icons/Copy";
import { marked } from "marked";
import Check from "./icons/Check";

const Messages = forwardRef(({ messages, onIsAtBottomChange }: any, ref) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

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

  const decodeHtmlEntities = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const copyToClipboard = async (message: string, id: string) => {
    const rawText = await marked.parse(message, { renderer: new marked.Renderer() });
    const cleanText = rawText.replace(/<\/?[^>]+(>|$)/g, "");
    const decodedText = decodeHtmlEntities(cleanText);
    navigator.clipboard.writeText(decodedText);

    setCopiedMessage(id);

    setTimeout(() => {
      setCopiedMessage(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col space-y-4 text-sm">
      {messages.map((message: any, index: number) => (
        <div
          key={index}
          className={clsx(
            "p-3 rounded-[14px] text-sm whitespace-pre-wrap overflow-wrap-break-word",
            message.isUser ? "bg-button-primary text-white ml-auto min-w-[120px] xl:max-w-[75%]" : "bg-white border border-outline-primary mr-auto",
            "max-w-full break-words overflow-hidden"
          )}>
          {message.loading ? (
            <div className="flex items-center justify-center">
              <Loader stroke="#0104b3" />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-x-1.5">
                  {message.isUser ? <User width={14} height={14} /> : <Robot width={14} height={14} additionalClasses="fill-black stroke-2" />}
                  <h3
                    className={clsx("font-medium text-xs", {
                      "text-white": message.isUser,
                      "text-black": !message.isUser,
                    })}>
                    {message.isUser ? "You" : <span className="font-bold">Ortelius AI</span>}
                  </h3>
                </div>
                {!message.isUser && (
                  <button type="button" className="cursor-pointer" onClick={() => copyToClipboard(message.content, `message-${index}`)}>
                    {copiedMessage === `message-${index}` ? <Check additionalClasses="stroke-black stroke-2" /> : <Copy additionalClasses="stroke-black" />}
                  </button>
                )}
              </div>
              <div className="pt-3">
                {message.isUser ? (
                  message.content
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose">
                    {message.content.replace(/\n\n/g, "\n")}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
});

Messages.displayName = "Messages";
export default Messages;
