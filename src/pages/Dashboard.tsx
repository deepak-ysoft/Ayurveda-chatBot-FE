import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  MessageSquare,
  ChevronRight,
  Menu,
  Loader2,
} from "lucide-react";
import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";
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
  const { setIsSidebarOpen } = useOutletContext<{
    setIsSidebarOpen: (open: boolean) => void;
  }>();
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
  const clearChat = useChatStore(
    (state: ChatState) => state.clearChat,
  );

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

  const handleNewChat = () => {
    clearChat();
    navigate("/chat");
  };

  return (
    <>
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
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
    </>
  );
};

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
