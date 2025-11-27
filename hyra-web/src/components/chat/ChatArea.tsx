import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/hooks/use-chat-store";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

export const ChatArea = () => {
  const { conversations, currentConversationId, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  // auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversationId) return;

    addMessage(currentConversationId, {
      role: "user",
      content: input.trim(),
    });

    setInput("");

    // fake AI
    setTimeout(() => {
      addMessage(currentConversationId, {
        role: "assistant",
        content: "Demo message. In real usage, connect to your AI backend.",
      });
    }, 800);
  };

  // Enter để gửi, shift+enter xuống dòng
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  // Nếu chưa chọn chat
  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-background">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome to Chat
          </h2>
          <p className="text-muted-foreground">
            Select a conversation or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Area */}
      <ScrollArea className="flex-1 px-4">
        <div ref={scrollRef} className="max-w-[800px] mx-auto py-8 space-y-4">
          {currentConversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-medium text-foreground">
                  Start a conversation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Type your message below to begin
                </p>
              </div>
            </div>
          ) : (
            currentConversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-background pb-6">
        <div className="max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end gap-2 bg-card border border-border rounded-2xl shadow-md p-2">
              {/* Attach button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Input */}
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className={cn(
                  "min-h-[44px] max-h-[100px] resize-none border-0 shadow-none flex-1",
                  "focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2"
                )}
                rows={1}
              />

              {/* Send */}
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="h-9 w-9 shrink-0 rounded-xl"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChatArea;
