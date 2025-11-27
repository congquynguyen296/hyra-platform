import { Conversation, ChatState } from "@/types/Chat";
import { create } from "zustand";

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Getting Started with React",
    createdAt: new Date(2025, 0, 15),
    updatedAt: new Date(2025, 0, 15),
    messages: [
      {
        id: "m1",
        role: "user",
        content: "How do I get started with React?",
        timestamp: new Date(2025, 0, 15, 10, 0),
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Great question! React is a popular JavaScript library for building user interfaces. To get started, you'll need Node.js installed on your computer. Then you can create a new React app using Create React App or Vite. Would you like me to walk you through the setup process?",
        timestamp: new Date(2025, 0, 15, 10, 1),
      },
      {
        id: "m3",
        role: "user",
        content: "Yes, please show me how to use Vite.",
        timestamp: new Date(2025, 0, 15, 10, 2),
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "Perfect choice! Vite is much faster than Create React App. Here's how to create a new React project with Vite:\n\n1. Run: npm create vite@latest my-app -- --template react-ts\n2. Navigate into your project: cd my-app\n3. Install dependencies: npm install\n4. Start the dev server: npm run dev\n\nThat's it! Your React app will be running on http://localhost:5173",
        timestamp: new Date(2025, 0, 15, 10, 3),
      },
    ],
  },
  {
    id: "2",
    title: "TypeScript Best Practices",
    createdAt: new Date(2025, 0, 14),
    updatedAt: new Date(2025, 0, 14),
    messages: [
      {
        id: "m5",
        role: "user",
        content: "What are some TypeScript best practices?",
        timestamp: new Date(2025, 0, 14, 14, 0),
      },
      {
        id: "m6",
        role: "assistant",
        content:
          'Here are some key TypeScript best practices:\n\n1. Enable strict mode in tsconfig.json\n2. Use interfaces for object shapes\n3. Avoid using "any" type\n4. Use union types instead of enums when possible\n5. Leverage type inference\n6. Use const assertions for literal types\n\nWould you like me to explain any of these in more detail?',
        timestamp: new Date(2025, 0, 14, 14, 1),
      },
    ],
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox",
    createdAt: new Date(2025, 0, 13),
    updatedAt: new Date(2025, 0, 13),
    messages: [
      {
        id: "m7",
        role: "user",
        content: "When should I use CSS Grid vs Flexbox?",
        timestamp: new Date(2025, 0, 13, 9, 0),
      },
      {
        id: "m8",
        role: "assistant",
        content:
          "Great question! Here's a simple guide:\n\nUse Flexbox when:\n- You have a one-dimensional layout (row or column)\n- You need to align items along a single axis\n- Content size determines layout\n\nUse CSS Grid when:\n- You have a two-dimensional layout (rows and columns)\n- You need precise control over placement\n- Layout determines content size\n\nIn practice, they work great together!",
        timestamp: new Date(2025, 0, 13, 9, 1),
      },
    ],
  },
];

export const useChatStore = create<ChatState>((set) => ({
  conversations: mockConversations,
  currentConversationId: "1",
  sidebarCollapsed: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setCurrentConversation: (id) => set({ currentConversationId: id }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  ...message,
                  id: `m${Date.now()}`,
                  timestamp: new Date(),
                },
              ],
              updatedAt: new Date(),
            }
          : conv
      ),
    })),

  createNewConversation: () =>
    set((state) => {
      const newId = `${Date.now()}`;
      const newConversation: Conversation = {
        id: newId,
        title: "New Conversation",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        conversations: [newConversation, ...state.conversations],
        currentConversationId: newId,
      };
    }),
}));
