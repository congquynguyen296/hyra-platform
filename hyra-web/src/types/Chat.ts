export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setCurrentConversation: (id: string) => void;
  addMessage: (
    conversationId: string,
    message: Omit<Message, "id" | "timestamp">
  ) => void;
  createNewConversation: () => void;
}
