import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Leaf,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  useAuthStore,
  type AuthState,
} from "../store/authStore";
import {
  useChatStore,
  type ChatState,
} from "../store/chatStore";
import type { ChatSession } from "../types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);
  const [profile, setProfile] = useState<{
    age: number;
    gender: string;
    diet: string;
    weight: string;
    dosha: string;
  } | null>(null);
  const [sessions, setSessions] = useState<
    ChatSession[]
  >([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const user = useAuthStore(
    (state: AuthState) => state.user,
  );
  const logout = useAuthStore(
    (state: AuthState) => state.logout,
  );
  const clearChat = useChatStore(
    (state: ChatState) => state.clearChat,
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, sessionsRes] =
          await Promise.all([
            api.get("/auth/profile"),
            api.get("/chat/sessions"),
          ]);
        setProfile(profileRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        console.error(
          "Failed to fetch dashboard data",
          err,
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
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
    });
  };

  const handleNewChat = () => {
    clearChat();
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-ayurveda-cream flex relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setIsSidebarOpen(false)
            }
            className="fixed inset-0 bg-ayurveda-brown/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 glass-card m-4 rounded-3xl flex flex-col p-6 h-[calc(100vh-2rem)] z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ?
            "translate-x-0"
          : "-translate-x-80 lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <Leaf className="text-ayurveda-leaf w-8 h-8" />
            <span className="text-2xl font-bold text-ayurveda-brown">
              VedaAI
            </span>
          </div>
          <button
            onClick={() =>
              setIsSidebarOpen(false)
            }
            className="lg:hidden p-2 hover:bg-ayurveda-leaf/5 rounded-xl transition-all"
          >
            <X className="w-6 h-6 text-ayurveda-earth" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem
            icon={<Leaf className="w-5 h-5" />}
            label="Overview"
            active
          />
          <SidebarItem
            icon={<User className="w-5 h-5" />}
            label="Profile"
          />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 text-red-500 font-semibold hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setIsSidebarOpen(true)
              }
              className="lg:hidden p-2 glass-card rounded-xl hover:bg-white transition-all shadow-soft"
            >
              <Menu className="w-6 h-6 text-ayurveda-brown" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ayurveda-brown leading-tight">
                Namaste, {user?.name}
              </h1>
              <p className="text-sm md:text-base text-ayurveda-earth">
                Today is a beautiful day for
                balance.
              </p>
            </div>
          </div>
          {/* <button
            onClick={handleNewChat}
            className="btn-primary flex items-center gap-2 md:px-8"
          >
            <Plus className="w-5 h-5" />{" "}
            <span className="hidden sm:inline">
              New Session
            </span>
          </button> */}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dosha Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="lg:col-span-2 bg-gradient-to-br from-ayurveda-leaf to-ayurveda-sage p-6 md:p-10 rounded-[2rem] md:rounded-[3xl] text-white shadow-premium relative overflow-hidden"
          >
            <Leaf className="absolute top-[-20px] right-[-20px] w-48 h-48 md:w-64 md:h-64 text-white/10 rotate-12" />
            <div className="relative z-10">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Your Balance
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-2">
                {profile?.dosha ?
                  `${profile.dosha} Balance`
                : "Ayurvedic Balance"}
              </h2>
              <p className="text-sm md:text-base text-white/80 max-w-md">
                {profile?.dosha ?
                  `Focusing on harmonizing your ${profile.dosha} constitution today.`
                : "Discovering your unique Ayurvedic constitution for lasting wellness."
                }
              </p>
              <div className="mt-6 md:mt-8 flex gap-3 md:gap-4">
                <div className="bg-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm text-center min-w-[80px] md:min-w-[100px]">
                  <div className="text-xl md:text-2xl font-bold">
                    {profile?.age || "—"}
                  </div>
                  <div className="text-[8px] md:text-[10px] uppercase font-bold opacity-70">
                    Age
                  </div>
                </div>
                <div className="bg-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm text-center min-w-[80px] md:min-w-[100px]">
                  <div className="text-xl md:text-2xl font-bold">
                    {profile?.diet || "—"}
                  </div>
                  <div className="text-[8px] md:text-[10px] uppercase font-bold opacity-70">
                    Diet
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Chat Card */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-ayurveda-brown mb-4">
                Quick Chat
              </h3>
              <p className="text-sm text-ayurveda-earth mb-6">
                Ask VedaAI about any herb or
                symptom.
              </p>
              <button
                onClick={handleNewChat}
                className="w-full btn-secondary text-sm py-3 flex justify-center items-center gap-2"
              >
                Ask Now{" "}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-ayurveda-sand/10 border border-ayurveda-sand/20 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-ayurveda-brown mb-2">
                Wellness Tip
              </h3>
              <p className="text-sm italic text-ayurveda-brown/80">
                "Consistency in daily routine
                (Dinacharya) is the key to lasting
                health."
              </p>
            </div>
          </div>
        </div>

        {/* Recent Sessions List */}
        <section className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-ayurveda-brown">
              Recent Sessions
            </h3>
            <button
              onClick={() => navigate("/chat")}
              className="text-ayurveda-leaf font-bold flex items-center gap-1 hover:underline"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {isLoading ?
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-ayurveda-leaf" />
              </div>
            : sessions.length > 0 ?
              sessions
                .slice(0, 5)
                .map((session) => (
                  <SessionRow
                    key={session.id}
                    title={
                      session.sessionName ||
                      "Ayurvedic Session"
                    }
                    date={new Date(
                      session.createdAt,
                    ).toLocaleDateString()}
                    onClick={() =>
                      navigate("/chat", {
                        state: {
                          sessionId: session.id,
                        },
                      })
                    }
                  />
                ))
            : <div className="text-center py-12 glass-card rounded-3xl">
                <p className="text-ayurveda-earth italic">
                  No sessions found. Start a new
                  healing conversation.
                </p>
              </div>
            }
          </div>
        </section>
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
                    <LogOut className="w-7 h-7" />
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

const SidebarItem = ({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
      active ?
        "bg-ayurveda-leaf text-white shadow-soft"
      : "text-ayurveda-earth hover:bg-ayurveda-leaf/5"
    }`}
  >
    {icon}{" "}
    <span className="font-semibold">{label}</span>
  </button>
);

const SessionRow = ({
  title,
  date,
  onClick,
}: {
  title: string;
  date: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="glass-card p-5 rounded-2xl flex justify-between items-center hover:bg-white hover:scale-[1.01] transition-all cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-ayurveda-sand/20 rounded-xl">
        <MessageSquare className="w-5 h-5 text-ayurveda-brown" />
      </div>
      <div>
        <div className="font-bold text-ayurveda-brown">
          {title}
        </div>
        <div className="text-xs text-ayurveda-earth">
          {date}
        </div>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-ayurveda-earth" />
  </div>
);

export default Dashboard;
