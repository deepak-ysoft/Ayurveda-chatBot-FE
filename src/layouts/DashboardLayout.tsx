import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Leaf,
  User,
  LogOut,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import {
  useAuthStore,
  type AuthState,
} from "../store/authStore";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);
  const logout = useAuthStore(
    (state: AuthState) => state.logout,
  );

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
            onClick={() => {
              navigate("/dashboard");
              setIsSidebarOpen(false);
            }}
            active={
              location.pathname === "/dashboard"
            }
          />
          <SidebarItem
            icon={<User className="w-5 h-5" />}
            label="Profile"
            onClick={() => {
              navigate("/dashboard/profile");
              setIsSidebarOpen(false);
            }}
            active={
              location.pathname ===
              "/dashboard/profile"
            }
          />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 text-red-500 font-semibold hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        {/* We pass setIsSidebarOpen to the context so children can open the sidebar in mobile */}
        <Outlet context={{ setIsSidebarOpen }} />
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

export default DashboardLayout;
