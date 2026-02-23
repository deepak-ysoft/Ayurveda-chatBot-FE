import { create } from "zustand";
import type {
  ChatSession,
  ChatMessage,
} from "../types";

export interface ChatState {
  sessions: ChatSession[];
  messages: ChatMessage[];
  currentSessionId: string | null;
  isTyping: boolean;
  setSessions: (sessions: ChatSession[]) => void;
  setMessages: (
    messages:
      | ChatMessage[]
      | ((prev: ChatMessage[]) => ChatMessage[]),
  ) => void;
  addMessage: (message: ChatMessage) => void;
  setCurrentSessionId: (
    id: string | null,
  ) => void;
  setIsTyping: (isTyping: boolean) => void;
  updateMessage: (
    index: number,
    updates: Partial<ChatMessage>,
  ) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>(
  (set) => ({
    sessions: [],
    messages: [],
    currentSessionId: null,
    isTyping: false,
    setSessions: (sessions: ChatSession[]) =>
      set({ sessions }),
    setMessages: (
      messagesValue:
        | ChatMessage[]
        | ((
            prev: ChatMessage[],
          ) => ChatMessage[]),
    ) =>
      set((state: ChatState) => ({
        messages:
          typeof messagesValue === "function" ?
            messagesValue(state.messages)
          : messagesValue,
      })),
    addMessage: (message: ChatMessage) =>
      set((state: ChatState) => ({
        messages: [...state.messages, message],
      })),
    setCurrentSessionId: (id: string | null) =>
      set({ currentSessionId: id }),
    setIsTyping: (isTyping: boolean) =>
      set({ isTyping }),
    updateMessage: (
      index: number,
      updates: Partial<ChatMessage>,
    ) =>
      set((state: ChatState) => ({
        messages: state.messages.map((msg, i) =>
          i === index ?
            { ...msg, ...updates }
          : msg,
        ),
      })),
    clearChat: () =>
      set({
        messages: [],
        currentSessionId: null,
      }),
  }),
);
