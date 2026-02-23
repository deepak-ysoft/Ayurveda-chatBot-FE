import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import api from "../api/axios";
import {
  useAuthStore,
  type AuthState,
} from "../store/authStore";

const Onboarding = () => {
  const navigate = useNavigate();
  const updateUser = useAuthStore(
    (state: AuthState) => state.updateUser,
  );
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] =
    useState(false);
  const [formData, setFormData] = useState({
    age: 25,
    gender: "Male",
    diet: "Vegetarian",
    weight: "Moderate",
    dosha: "Vata",
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await api.post(
        "/auth/onboarding",
        formData,
      );
      updateUser({ isOnboardingCompleted: true });
      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayurveda-cream flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-ayurveda-leaf/5 via-transparent to-transparent">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-8 md:mb-12 px-2 md:px-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step >= i ?
                    "bg-ayurveda-leaf text-white"
                  : "bg-ayurveda-leaf/10 text-ayurveda-leaf"
                }`}
              >
                {step > i ?
                  <CheckCircle2 className="w-6 h-6" />
                : i}
              </div>
              {i < 3 && (
                <div
                  className={`h-1 flex-1 min-w-[3rem] md:min-w-[8rem] mx-2 rounded-full ${step > i ? "bg-ayurveda-leaf" : "bg-ayurveda-leaf/10"}`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-6 md:p-10 rounded-3xl"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1">
                <h2 className="text-2xl md:text-3xl font-bold text-ayurveda-brown mb-2">
                  Personal Details
                </h2>
                <p className="text-sm md:text-base text-ayurveda-earth mb-6 md:mb-8">
                  Let's start with some basic
                  information.
                </p>
                <div className="space-y-6">
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
                          age: parseInt(
                            e.target.value,
                          ),
                        })
                      }
                      className="w-full h-2 bg-ayurveda-leaf/10 rounded-lg appearance-none cursor-pointer accent-ayurveda-leaf"
                    />
                    <div className="mt-2 text-center font-bold text-ayurveda-leaf text-xl">
                      {formData.age} years
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Male",
                        "Female",
                        "Other",
                      ].map((g) => (
                        <button
                          key={g}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              gender: g,
                            })
                          }
                          className={`py-3 rounded-xl border-2 transition-all ${
                            (
                              formData.gender ===
                              g
                            ) ?
                              "border-ayurveda-leaf bg-ayurveda-leaf/5"
                            : "border-transparent bg-ayurveda-cream/50"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2">
                <h2 className="text-2xl md:text-3xl font-bold text-ayurveda-brown mb-2">
                  Lifestyle & Diet
                </h2>
                <p className="text-sm md:text-base text-ayurveda-earth mb-6 md:mb-8">
                  This helps us tailor Ayurvedic
                  suggestions.
                </p>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold mb-2">
                    Primary Diet
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Vegetarian",
                      "Vegan",
                      "Non-Vegetarian",
                      "Ayurvedic",
                    ].map((d) => (
                      <button
                        key={d}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            diet: d,
                          })
                        }
                        className={`py-3 px-4 rounded-xl border-2 transition-all ${
                          formData.diet === d ?
                            "border-ayurveda-leaf bg-ayurveda-leaf/5 shadow-soft"
                          : "border-transparent bg-white/50"
                        }`}
                      >
                        <span className="font-semibold text-sm">
                          {d}
                        </span>
                      </button>
                    ))}
                  </div>

                  <label className="block text-sm font-semibold mt-6 mb-2">
                    Body Weight / Build
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      "Slim",
                      "Moderate",
                      "Heavy",
                    ].map((w) => (
                      <button
                        key={w}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            weight: w,
                          })
                        }
                        className={`py-3 rounded-xl border-2 transition-all ${
                          formData.weight === w ?
                            "border-ayurveda-leaf bg-ayurveda-leaf/5 shadow-soft"
                          : "border-transparent bg-white/50"
                        }`}
                      >
                        <span className="font-semibold text-sm">
                          {w}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3">
                <h2 className="text-2xl md:text-3xl font-bold text-ayurveda-brown mb-2">
                  Current Balance
                </h2>
                <p className="text-sm md:text-base text-ayurveda-earth mb-6 md:mb-8">
                  Known Dosha or health focus.
                </p>
                <div className="space-y-4">
                  <p className="text-sm font-medium mb-2">
                    Select your primary Dosha (if
                    known):
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      "Vata",
                      "Pitta",
                      "Kapha",
                    ].map((d) => (
                      <button
                        key={d}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            dosha: d,
                          })
                        }
                        className={`p-5 rounded-2xl text-left border-2 transition-all ${
                          formData.dosha === d ?
                            "border-ayurveda-leaf bg-white shadow-soft"
                          : "border-transparent bg-white/50"
                        }`}
                      >
                        <div className="font-bold text-lg">
                          {d}
                        </div>
                        <div className="text-xs text-ayurveda-earth">
                          Select if you focus on{" "}
                          {d} balance.
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-ayurveda-earth font-bold"
              >
                <ChevronLeft className="w-5 h-5" />{" "}
                Back
              </button>
            )}
            <div className="ml-auto">
              {step < 3 ?
                <button
                  onClick={nextStep}
                  className="btn-primary py-3 flex items-center gap-2 px-8"
                >
                  Continue{" "}
                  <ChevronRight className="w-5 h-5" />
                </button>
              : <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn-primary py-3 flex items-center gap-2 px-8"
                >
                  {isLoading ?
                    <Loader2 className="w-5 h-5 animate-spin" />
                  : "Complete Setup"}
                </button>
              }
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center text-ayurveda-earth/60 text-xs flex items-center justify-center gap-2">
          <Leaf className="w-3 h-3" />
          Ancient Wisdom for Modern Lives
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
