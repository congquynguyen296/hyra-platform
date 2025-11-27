import { ChatArea } from "@/components/chat/ChatArea";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/hooks/use-chat-store";
import { PanelLeftOpen } from "lucide-react";

export default function Chat() {
  const { sidebarCollapsed, toggleSidebar } = useChatStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar />
      <div className="flex-1 min-h-0 flex flex-col relative">
        {sidebarCollapsed && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="absolute z-10 h-10 w-10 text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-none"
          >
            <PanelLeftOpen className="h-10 w-10" />
          </Button>
        )}
        <ChatArea />
      </div>
    </div>
  );
}
