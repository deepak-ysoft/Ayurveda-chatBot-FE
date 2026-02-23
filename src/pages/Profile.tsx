import { useState, useEffect } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Leaf,
  CheckCircle2,
  Loader2,
  User as UserIcon,
  Save,
  Menu,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axios";
import {
  useAuthStore,
  type AuthState,
} from "../store/authStore";

const Profile = () => {
  const { setIsSidebarOpen } = useOutletContext<{
    setIsSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(
    (state: AuthState) => state.user,
  );

  const [isLoading, setIsLoading] =
    useState(false);
  const [isFetching, setIsFetching] =
    useState(true);
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [formData, setFormData] = useState({
    age: 25,
    gender: "Male",
    diet: "Vegetarian",
    weight: "Moderate",
    dosha: "Vata",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(
          "/auth/profile",
        );
        if (res.data) {
          setFormData({
            age: res.data.age || 25,
            gender: res.data.gender || "Male",
            diet: res.data.diet || "Vegetarian",
            weight: res.data.weight || "Moderate",
            dosha: res.data.dosha || "Vata",
          });
        }
      } catch (err) {
        console.error(
          "Failed to fetch profile",
          err,
        );
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    try {
      await api.post(
        "/auth/onboarding",
        formData,
      );
      setSuccessMessage(
        "Profile updated successfully!",
      );
      setTimeout(
        () => setSuccessMessage(null),
        3000,
      );
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-ayurveda-leaf" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 glass-card rounded-xl hover:bg-white transition-all shadow-soft"
        >
          <Menu className="w-6 h-6 text-ayurveda-brown" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ayurveda-brown">
            Settings
          </h1>
          <p className="text-ayurveda-earth text-sm">
            Manage your Ayurvedic profile and
            account.
          </p>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-10 rounded-3xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-ayurveda-leaf/10 rounded-2xl flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-ayurveda-leaf" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ayurveda-brown">
              My Profile
            </h2>
            <p className="text-ayurveda-earth text-sm">
              Your Ayurvedic constitution and
              lifestyle.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* User Info (Read Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-ayurveda-earth/10">
            <div>
              <label className="text-[10px] uppercase font-bold text-ayurveda-earth/50 tracking-widest">
                Name
              </label>
              <div className="text-lg font-bold text-ayurveda-brown">
                {user?.name}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-ayurveda-earth/50 tracking-widest">
                Email
              </label>
              <div className="text-lg font-bold text-ayurveda-brown">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Current Age
            </label>
            <input
              type="range"
              min="15"
              max="100"
              value={formData.age}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  age: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-ayurveda-leaf/10 rounded-lg appearance-none cursor-pointer accent-ayurveda-leaf"
            />
            <div className="mt-2 text-center font-bold text-ayurveda-leaf text-xl">
              {formData.age} years
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Male", "Female", "Other"].map(
                (g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        gender: g,
                      })
                    }
                    className={`py-3 rounded-xl border-2 transition-all ${
                      formData.gender === g ?
                        "border-ayurveda-leaf bg-ayurveda-leaf/5 font-bold text-ayurveda-leaf"
                      : "border-transparent bg-ayurveda-cream/50 text-ayurveda-earth"
                    }`}
                  >
                    {g}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Diet */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Primary Diet
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Vegetarian",
                "Vegan",
                "Non-Vegetarian",
                "Ayurvedic",
              ].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      diet: d,
                    })
                  }
                  className={`py-3 px-2 rounded-xl border-2 transition-all text-sm ${
                    formData.diet === d ?
                      "border-ayurveda-leaf bg-ayurveda-leaf/5 font-bold text-ayurveda-leaf shadow-soft"
                    : "border-transparent bg-white/50 text-ayurveda-earth"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Body Weight / Build
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Slim", "Moderate", "Heavy"].map(
                (w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        weight: w,
                      })
                    }
                    className={`py-3 rounded-xl border-2 transition-all ${
                      formData.weight === w ?
                        "border-ayurveda-leaf bg-ayurveda-leaf/5 font-bold text-ayurveda-leaf shadow-soft"
                      : "border-transparent bg-white/50 text-ayurveda-earth"
                    }`}
                  >
                    {w}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Dosha */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Primary Dosha
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Vata", "Pitta", "Kapha"].map(
                (d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        dosha: d,
                      })
                    }
                    className={`p-4 rounded-2xl text-center border-2 transition-all ${
                      formData.dosha === d ?
                        "border-ayurveda-leaf bg-white shadow-soft font-bold text-ayurveda-leaf"
                      : "border-transparent bg-white/50 text-ayurveda-earth"
                    }`}
                  >
                    {d}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-premium"
            >
              {isLoading ?
                <Loader2 className="w-6 h-6 animate-spin" />
              : <>
                  <Save className="w-5 h-5" />{" "}
                  Save Changes
                </>
              }
            </button>

            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center gap-2 border border-green-100"
                >
                  <CheckCircle2 className="w-5 h-5" />{" "}
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </motion.div>

      <div className="mt-8 text-center text-ayurveda-earth/60 text-xs flex items-center justify-center gap-2">
        <Leaf className="w-3 h-3" />
        Ancient Wisdom for Modern Lives
      </div>
    </div>
  );
};

export default Profile;
