import {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Send,
  Leaf,
  AlertTriangle,
  MoreVertical,
  Plus,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  User as UserIcon,
  Menu,
  X,
  Trash2,
  LogOut,
  Languages,
  ArrowRightLeft,
} from "lucide-react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import {
  translateText,
  LANGUAGES,
  SAME_LANGUAGE_MESSAGES,
} from "../utils/translator";
import type {
  ChatMessage,
  ChatSession,
  ChatHistoryItem,
} from "../types";
import type { AuthState } from "../store/authStore";
import type { ChatState } from "../store/chatStore";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore(
    (state: AuthState) => state,
  );
  const {
    sessions,
    currentSessionId,
    messages,
    isTyping,
    setSessions,
    setMessages,
    addMessage,
    setCurrentSessionId,
    setIsTyping,
    clearChat,
    updateMessage,
  } = useChatStore((state: ChatState) => state);

  // Handle incoming session from Dashboard
  useEffect(() => {
    if (location.state?.sessionId) {
      const sessionId = location.state.sessionId;
      if (sessionId !== currentSessionId) {
        handleSessionSelect(sessionId);
      }
    }
  }, [location.state?.sessionId]);

  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);
  const [emergency, setEmergency] =
    useState(false);
  const [readingLanguage, setReadingLanguage] =
    useState("en");
  const [translatingIndex, setTranslatingIndex] =
    useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // SVG Assets for Neo-Ayurveda Phase 2
  const KnowledgeCore = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1.5,
        ease: "easeOut",
      }}
      className="relative w-48 h-48 mb-6"
    >
      {/* Decorative Outer Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 border-2 border-dashed border-ayurveda-leaf/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-4 border border-ayurveda-leaf/10 rounded-full"
      />

      {/* Central Core Sphere */}
      <div className="absolute inset-8 glass-card rounded-full flex items-center justify-center p-6 shadow-glow overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-gradient-to-tr from-ayurveda-leaf/40 to-transparent blur-xl"
        />
        <Leaf className="w-12 h-12 text-ayurveda-leaf relative z-10" />
      </div>

      {/* Floating Orbital Points */}
      {[0, 120, 240].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 flex items-start justify-center"
          style={{ transformOrigin: "center" }}
        >
          <div className="w-2 h-2 bg-ayurveda-leaf rounded-full shadow-glow" />
        </motion.div>
      ))}
    </motion.div>
  );

  const BioMotif = ({
    className,
  }: {
    className?: string;
  }) => (
    <div
      className={`pointer-events-none opacity-[0.03] select-none ${className}`}
    >
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M200 50C200 50 250 150 250 200C250 250 200 350 200 350C200 350 150 250 150 200C150 150 200 50 200 50Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="10 10"
        />
        <circle
          cx="200"
          cy="200"
          r="100"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="100"
          y1="200"
          x2="300"
          y2="200"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <line
          x1="200"
          y1="100"
          x2="200"
          y2="300"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "danger" | "success";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "success",
  });

  const prevMessageCount = useRef(
    messages.length,
  );

  // Auto-scroll to bottom with smart behavior
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const threshold = 100; // px from bottom to be considered "at bottom"
      const isAtBottom =
        container.scrollHeight -
          container.scrollTop <=
        container.clientHeight + threshold;

      const hasNewMessage =
        messages.length >
        prevMessageCount.current;

      if (
        hasNewMessage ||
        (isAtBottom && isTyping)
      ) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior:
            hasNewMessage ? "smooth" : "auto",
        });
      }
    }
    prevMessageCount.current = messages.length;
  }, [messages, isTyping]);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get<ChatSession[]>(
        "/chat/sessions",
      );
      setSessions(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch sessions",
        err,
      );
    }
  };

  const handleSendMessage = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      role: "user",
      message: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput("");
    setIsTyping(true);
    setEmergency(false);

    try {
      // SSE implementation using fetch for better header support (the backend expects SendMessageDto)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/chat/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            chatSessionId: currentSessionId,
            message: input,
          }),
        },
      );

      if (!response.ok)
        throw new Error("Failed to send message");

      const responseData =
        (await response.json()) as {
          answer?: string;
          sessionId?: string;
        };
      const aiFullContent =
        responseData.answer || "";
      const newSessionId = responseData.sessionId;

      if (newSessionId && !currentSessionId) {
        setCurrentSessionId(newSessionId);
        fetchSessions();
      }

      setIsTyping(false);

      // Simulated Typing Animation
      if (aiFullContent.trim()) {
        let displayedMessage = "";

        // Add initial assistant message placeholder
        setMessages((prev: ChatMessage[]) => [
          ...prev,
          {
            role: "assistant",
            message: "",
            timestamp: new Date().toISOString(),
          },
        ]);

        // Character-based streaming for maximum smoothness
        const chars = Array.from(aiFullContent);
        for (let i = 0; i < chars.length; i++) {
          displayedMessage += chars[i];

          // Batch updates: update state every few characters or at punctuation/whitespace
          if (
            i % 3 === 0 ||
            i === chars.length - 1 ||
            /\s/.test(chars[i])
          ) {
            setMessages((prev: ChatMessage[]) => {
              const last = prev[prev.length - 1];
              if (
                last &&
                last.role === "assistant"
              ) {
                return [
                  ...prev.slice(0, -1),
                  {
                    ...last,
                    message: displayedMessage,
                  },
                ];
              }
              return prev;
            });
            await new Promise((resolve) =>
              setTimeout(resolve, 15),
            );
          }
        }
      }
    } catch (err) {
      console.error("SSE Error", err);
      setIsTyping(false);
      addMessage({
        role: "assistant",
        message:
          "I'm sorry, I encountered an error connecting to my wellness knowledge base.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      // setIsTyping(false) is handled above specifically to separate loader from typing
    }
  };

  const createNewChat = () => {
    clearChat();
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const onSessionSelect = (sessionId: string) => {
    handleSessionSelect(sessionId);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleSessionSelect = async (
    sessionId: string,
  ) => {
    setCurrentSessionId(sessionId);
    try {
      const res = await api.get<
        ChatHistoryItem[]
      >(`/chat/history/${sessionId}`);
      // History comes as { question, answer, createdAt }
      const historyMessages: ChatMessage[] =
        res.data.flatMap((h: ChatHistoryItem) => [
          {
            id: h.id, // Ensure ID is passed
            role: "user",
            message: h.question,
            timestamp: h.createdAt,
          },
          {
            id: h.id, // For history, both Q&A are part of one record but backend deletes by chatId
            role: "assistant",
            message: h.answer,
            timestamp: h.createdAt,
          },
        ]);
      setMessages(historyMessages);
    } catch (err) {
      console.error(
        "Failed to fetch history",
        err,
      );
    }
  };

  const deleteSession = (
    e: React.MouseEvent,
    sessionId: string,
  ) => {
    e.stopPropagation();
    setModalConfig({
      isOpen: true,
      title: "Delete Session",
      message:
        "Are you sure you want to delete this session? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        try {
          await api.delete(
            `/chat/delete-session/${sessionId}`,
          );
          setSessions(
            sessions.filter(
              (s) => s.id !== sessionId,
            ),
          );
          if (currentSessionId === sessionId) {
            clearChat();
          }
          setModalConfig((prev) => ({
            ...prev,
            isOpen: false,
          }));
        } catch (err) {
          console.error(
            "Failed to delete session",
            err,
          );
          setModalConfig({
            isOpen: true,
            title: "Error",
            message: "Failed to delete session",
            type: "danger",
            onConfirm: () =>
              setModalConfig((prev) => ({
                ...prev,
                isOpen: false,
              })),
          });
        }
      },
    });
  };

  const deleteChatMessage = (chatId: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Message",
      message:
        "Are you sure you want to delete this message?",
      type: "danger",
      onConfirm: async () => {
        try {
          await api.delete(
            `/chat/delete-chat/${chatId}`,
          );
          setMessages(
            messages.filter(
              (msg: ChatMessage) =>
                msg.id !== chatId,
            ),
          );
          setModalConfig((prev) => ({
            ...prev,
            isOpen: false,
          }));
        } catch (err) {
          console.error(
            "Failed to delete chat message",
            err,
          );
          setModalConfig({
            isOpen: true,
            title: "Error",
            message: "Failed to delete message",
            type: "danger",
            onConfirm: () =>
              setModalConfig((prev) => ({
                ...prev,
                isOpen: false,
              })),
          });
        }
      },
    });
  };

  const handleTranslate = async (
    index: number,
    text: string,
    targetLang: string,
  ) => {
    setTranslatingIndex(index);
    try {
      const translated = await translateText(
        text,
        targetLang,
      );

      // If text is same, it's already in that language or translation was skipped
      if (
        translated.trim() === text.trim() ||
        translated.includes(
          "PLEASE SELECT TWO DISTINCT LANGUAGES",
        )
      ) {
        setModalConfig({
          isOpen: true,
          title:
            targetLang === "hi" ? "अनुवाद"
            : targetLang === "gu" ? "અનુવાદ"
            : "Translation",
          message:
            SAME_LANGUAGE_MESSAGES[targetLang] ||
            SAME_LANGUAGE_MESSAGES.en,
          type: "success",
          onConfirm: () =>
            setModalConfig((prev) => ({
              ...prev,
              isOpen: false,
            })),
        });
        return;
      }

      updateMessage(index, {
        translations: {
          ...messages[index].translations,
          [targetLang]: translated,
        },
      });
    } catch (err) {
      console.error("Translation failed", err);
    } finally {
      setTranslatingIndex(null);
    }
  };

  return (
    <div className="flex h-screen bg-ayurveda-cream overflow-hidden relative">
      <div className="absolute inset-0 neo-mesh opacity-50 -z-10" />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setIsSidebarOpen(false)
            }
            className="fixed inset-0 bg-ayurveda-brown/20 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 border-r border-ayurveda-earth/10 flex flex-col bg-white/90 backdrop-blur-md z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ?
            "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-ayurveda-earth/10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Leaf className="text-ayurveda-leaf w-6 h-6" />
              <span className="text-xl font-bold text-ayurveda-brown">
                VedaAI
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                className="p-2 hover:bg-ayurveda-leaf/5 rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-ayurveda-earth" />
              </button>
              <button
                onClick={() =>
                  setIsSidebarOpen(false)
                }
                className="lg:hidden p-2 hover:bg-ayurveda-leaf/5 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-ayurveda-earth" />
              </button>
            </div>
          </div>
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 p-3 bg-ayurveda-leaf/10 text-ayurveda-leaf rounded-xl font-bold hover:bg-ayurveda-leaf/20 transition-all"
          >
            <Plus className="w-5 h-5" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] uppercase font-bold text-ayurveda-earth/40 ml-2 mb-2 tracking-widest">
            Recent Sessions
          </div>
          {sessions.length === 0 ?
            // Skeleton Loader
            Array.from({ length: 4 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="w-full h-16 skeleton mb-2"
                />
              ),
            )
          : sessions.map(
              (session: ChatSession) => (
                <button
                  key={session.id}
                  onClick={() =>
                    onSessionSelect(session.id)
                  }
                  className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all text-left ${
                    (
                      currentSessionId ===
                      session.id
                    ) ?
                      "bg-ayurveda-leaf text-white shadow-soft"
                    : "text-ayurveda-brown hover:bg-ayurveda-leaf/5"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <motion.div
                      layoutId={`icon-${session.id}`}
                      className={`p-2 rounded-xl ${currentSessionId === session.id ? "bg-white/20" : "bg-ayurveda-sand/20"}`}
                    >
                      <Leaf className="w-4 h-4" />
                    </motion.div>
                    <span className="truncate font-semibold text-sm">
                      {session.sessionName ||
                        "Ayurvedic Session"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) =>
                        deleteSession(
                          e,
                          session.id,
                        )
                      }
                      className={`p-2 rounded-lg transition-all ${
                        (
                          currentSessionId ===
                          session.id
                        ) ?
                          "hover:bg-white/20 text-white/60 hover:text-white"
                        : "hover:bg-ayurveda-leaf/10 text-ayurveda-earth/40 hover:text-red-500"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ),
            )
          }
        </div>

        <div className="p-4 border-t border-ayurveda-earth/10">
          <div
            onClick={() => navigate("/profile")}
            className="glass-card p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-ayurveda-leaf/5 transition-all group"
          >
            <div className="w-10 h-10 bg-ayurveda-sand rounded-full flex items-center justify-center font-bold text-white shadow-soft group-hover:scale-110 transition-transform">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-bold text-ayurveda-brown truncate group-hover:text-ayurveda-leaf transition-colors">
                {user?.name}
              </div>
              <div className="text-[10px] text-ayurveda-earth truncate">
                {user?.email}
              </div>
            </div>
            <button
              onClick={() =>
                setModalConfig({
                  isOpen: true,
                  title: "Logout",
                  message:
                    "Are you sure you want to sign out?",
                  type: "danger",
                  onConfirm: () => {
                    logout();
                    navigate("/login");
                  },
                })
              }
              className="p-2 hover:bg-red-500/10 text-ayurveda-earth/40 hover:text-red-500 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="p-4 border-b border-white/10 flex items-center justify-between glass-dark z-10 transition-all duration-500">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setIsSidebarOpen(true)
              }
              className="lg:hidden p-2 hover:bg-ayurveda-leaf/5 rounded-xl transition-all"
            >
              <Menu className="w-6 h-6 text-ayurveda-brown" />
            </button>
            <div className="bg-ayurveda-leaf/10 p-2 rounded-xl hidden sm:block">
              <Leaf className="text-ayurveda-leaf w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-ayurveda-brown text-sm sm:text-base">
                Wellness Assistant
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[8px] sm:text-[10px] font-bold text-ayurveda-earth uppercase tracking-wide">
                  Knowledge Engine Enabled
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Languages className="w-4 h-4 text-ayurveda-leaf" />
              <select
                value={readingLanguage}
                onChange={(e) =>
                  setReadingLanguage(
                    e.target.value,
                  )
                }
                className="bg-transparent text-xs font-bold text-ayurveda-brown outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                  >
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <ShieldCheck className="w-5 h-5 text-ayurveda-leaf/40" />
          </div>
        </header>

        {/* Emergency Alert */}
        <AnimatePresence>
          {emergency && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-600 text-white flex items-start gap-4 shadow-xl z-20"
            >
              <AlertTriangle className="w-6 h-6 shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg">
                  ⚠️ URGENT MEDICAL ADVICE
                </div>
                <p className="text-sm text-red-100">
                  Please seek immediate medical
                  attention. Our AI has detected
                  symptoms that may require
                  professional diagnosis. Do not
                  delay professional help based on
                  this guidance.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 relative overflow-hidden">
          <BioMotif className="absolute -top-20 -right-20 text-ayurveda-leaf" />
          <BioMotif className="absolute -bottom-20 -left-20 text-ayurveda-brown" />
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto p-6 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <KnowledgeCore />
                <h3 className="text-2xl font-display font-bold text-ayurveda-brown neo-glow-text mb-2">
                  Elevate Your Well-being
                </h3>
                <p className="max-w-xs text-sm text-ayurveda-earth/60 font-medium leading-relaxed">
                  Connect with our Wellness
                  Knowledge Engine to balance your
                  Doshas and optimize your
                  vitality.
                </p>
              </div>
            )}

            {messages.map(
              (msg: ChatMessage, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] flex items-start gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-soft ${
                        msg.role === "user" ?
                          "bg-ayurveda-brown text-white"
                        : "bg-ayurveda-leaf text-white"
                      }`}
                    >
                      {msg.role === "user" ?
                        <UserIcon className="w-5 h-5" />
                      : <Leaf className="w-5 h-5" />
                      }
                    </div>
                    <div
                      className={`p-5 rounded-3xl relative group/msg transition-all duration-300 message-tilt ${
                        msg.role === "user" ?
                          "bg-white border border-ayurveda-brown/5 text-ayurveda-brown rounded-tr-none shadow-soft hover:shadow-premium"
                        : "glass-card text-ayurveda-brown rounded-tl-none active:scale-[0.99]"
                      }`}
                    >
                      {msg.id && (
                        <button
                          onClick={() =>
                            deleteChatMessage(
                              msg.id!,
                            )
                          }
                          className={`absolute -top-1 ${msg.role === "user" ? "left-0" : "-right-0"} p-1 bg-white border border-ayurveda-earth/10 rounded-full shadow-soft opacity-0 group-hover/msg:opacity-100 transition-opacity hover:text-red-500`}
                          title="Delete this message"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.translations?.[
                          readingLanguage
                        ] ||
                          msg.message ||
                          msg.answer ||
                          msg.question}
                      </div>

                      <div className="flex items-center justify-between mt-3 gap-4">
                        <div className="flex items-center gap-2">
                          {readingLanguage && (
                            <button
                              onClick={() => {
                                const text =
                                  msg.message ||
                                  msg.answer ||
                                  msg.question ||
                                  "";
                                if (
                                  !msg
                                    .translations?.[
                                    readingLanguage
                                  ]
                                ) {
                                  handleTranslate(
                                    idx,
                                    text,
                                    readingLanguage,
                                  );
                                }
                              }}
                              disabled={
                                translatingIndex ===
                                idx
                              }
                              className="flex items-center gap-1.5 text-[10px] font-bold uppercase py-1 px-2.5 bg-ayurveda-leaf/10 text-ayurveda-leaf rounded-lg hover:bg-ayurveda-leaf/20 transition-all disabled:opacity-50"
                            >
                              {(
                                translatingIndex ===
                                idx
                              ) ?
                                <Loader2 className="w-3 h-3 animate-spin" />
                              : <ArrowRightLeft className="w-3 h-3" />
                              }
                              {(
                                msg
                                  .translations?.[
                                  readingLanguage
                                ]
                              ) ?
                                "Translated"
                              : "Translate"}
                            </button>
                          )}
                        </div>
                        <div
                          className={`text-[9px] font-bold uppercase opacity-30 ${msg.role === "user" ? "text-right" : ""}`}
                        >
                          {msg.timestamp ?
                            new Date(
                              msg.timestamp,
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ),
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-ayurveda-leaf/10 flex items-center justify-center shrink-0">
                    <Loader2 className="w-5 h-5 text-ayurveda-leaf animate-spin" />
                  </div>
                  <div className="p-5 rounded-3xl bg-white/40 border border-ayurveda-leaf/5 rounded-tl-none flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 bg-ayurveda-leaf/40 rounded-full animate-bounce"
                      style={{
                        animationDelay: "0s",
                      }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-ayurveda-leaf/40 rounded-full animate-bounce"
                      style={{
                        animationDelay: "0.2s",
                      }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-ayurveda-leaf/40 rounded-full animate-bounce"
                      style={{
                        animationDelay: "0.4s",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="px-6 py-3 glass-card bg-white/10 border-none text-[10px] text-center text-ayurveda-brown/40 font-medium tracking-tight mx-8 my-2 rounded-2xl">
          <span className="font-bold opacity-100">
            Ayurvedic Educational Wellness
            Assistant.
          </span>{" "}
          Not a medical diagnosis tool. Content is
          for educational purposes only.
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="p-8 bg-transparent"
        >
          <div className="max-w-4xl mx-auto relative flex items-center group">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="How can I balance my Pitta today?"
              className="floating-input w-full"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-4 p-4 bg-ayurveda-leaf text-white rounded-2xl shadow-soft hover:shadow-glow transition-all active:scale-95 disabled:bg-ayurveda-earth/20 disabled:active:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setModalConfig((prev) => ({
                  ...prev,
                  isOpen: false,
                }))
              }
              className="absolute inset-0 bg-ayurveda-brown/60 backdrop-blur-md"
            />
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-ayurveda-earth/10"
            >
              <div className="p-8">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    (
                      modalConfig.type ===
                      "danger"
                    ) ?
                      "bg-red-50 text-red-500"
                    : "bg-ayurveda-leaf/10 text-ayurveda-leaf"
                  }`}
                >
                  {modalConfig.type === "danger" ?
                    <Trash2 className="w-7 h-7" />
                  : <AlertTriangle className="w-7 h-7" />
                  }
                </div>
                <h3 className="text-2xl font-bold text-ayurveda-brown mb-2">
                  {modalConfig.title}
                </h3>
                <p className="text-ayurveda-earth/70 leading-relaxed">
                  {modalConfig.message}
                </p>
              </div>
              <div className="p-6 bg-ayurveda-cream/30 flex gap-3">
                <button
                  onClick={() =>
                    setModalConfig((prev) => ({
                      ...prev,
                      isOpen: false,
                    }))
                  }
                  className="flex-1 px-6 py-4 bg-white text-ayurveda-brown font-bold rounded-2xl border border-ayurveda-earth/10 hover:bg-ayurveda-cream/50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={modalConfig.onConfirm}
                  className={`flex-1 px-6 py-4 text-white font-bold rounded-2xl shadow-soft transition-all active:scale-95 ${
                    (
                      modalConfig.type ===
                      "danger"
                    ) ?
                      "bg-red-500 hover:bg-red-600 shadow-red-200"
                    : "bg-ayurveda-leaf hover:bg-opacity-90 shadow-ayurveda-leaf/20"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
