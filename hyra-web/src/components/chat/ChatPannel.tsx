import { useState, useEffect, useRef } from "react";
import { X, Send, Headset, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import chatBotAIIcon from "/logo.avif";
import { toast } from "sonner";

export default function ChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div className="fixed bottom-0 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-t-2xl shadow-2xl border-2 border-slate-200 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img src={chatBotAIIcon} className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Hyra AI</h3>
              <p className="text-xs text-indigo-100">Trợ lý của em</p>
            </div>
          </div>
          <div className="flex items-center align-baseline gap-1">
            <button
              onClick={() =>
                toast.info("CareerGraph sẽ liên hệ với bạn sớm nhất có thể!")
              }
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Headset className="w-4 h-4 text-white" />
            </button>
            <button
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.type === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    } rounded-2xl px-4 py-2.5 break-words`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-indigo-200"
                          : "text-slate-500"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-pink-600 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4 pt-2 border-t-2 border-slate-100 flex-shrink-0">
          <div className="flex items-start gap-2">
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl focus-within:border-indigo-500 transition-colors">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none disabled:opacity-50 px-3 py-2 min-h-[40px] max-h-[120px]"
              />
            </div>
            <button
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex-shrink-0 mt-0.5"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
