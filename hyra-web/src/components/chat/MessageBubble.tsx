import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Ghost } from "lucide-react";
import { Message } from "@/types/Chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-white">
            <Ghost className="h-5 w-5 text-purple-600 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[680px] shadow-sm",
          isUser
            ? "bg-chat-user-bg text-chat-user-text ml-auto"
            : "bg-chat-assistant-bg text-chat-assistant-text border border-border"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-transparent">
            <Ghost className="h-5 w-5 text-blue-600" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
