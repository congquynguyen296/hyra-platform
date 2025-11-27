import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useChatStore } from "@/hooks/use-chat-store";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ChatSidebar = () => {
  const {
    conversations,
    currentConversationId,
    sidebarCollapsed,
    toggleSidebar,
    setCurrentConversation,
  } = useChatStore();

  return (
    <div
      className={cn(
        "h-screen bg-chat-sidebar border-r border-border transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-0 overflow-hidden" : "w-[220px]"
      )}
    >
      <div className="pb-3 flex items-center justify-between border-b border-border">
        <Button
          variant="outline"
          size="sm"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-none"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-10 w-10" />
          ) : (
            <PanelLeftClose className="h-10 w-10" />
          )}
        </Button>

        {!sidebarCollapsed && (
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-none"
          >
            <Plus className="h-10 w-10" />
            New chat
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 py-2">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setCurrentConversation(conversation.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2",
                "hover:bg-chat-hover",
                currentConversationId === conversation.id
                  ? "bg-chat-hover font-medium"
                  : "text-muted-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{conversation.title}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
      <Separator />
    </div>
  );
};
