import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../api/axios";
import {
  useAuthStore,
  type AuthState,
} from "../store/authStore";
import type {
  AuthResponse,
  User,
} from "../types";
import type { AxiosError } from "axios";
import SocialLoginButtons from "../components/SocialLoginButtons";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters",
    ),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(
    (state: AuthState) => state.setAuth,
  );
  const [error, setError] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] =
    useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response =
        await api.post<AuthResponse>(
          "/auth/login",
          data,
        );
      const { token, userId, ...userData } =
        response.data;
      const user: User = {
        id: userId,
        name: userData.name,
        email: userData.email,
        isOnboardingCompleted:
          userData.isOnboardingCompleted,
      };
      setAuth(user, token);

      if (user.isOnboardingCompleted) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      const axiosError =
        err as AxiosError<string>;
      setError(
        axiosError.response?.data ||
          "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayurveda-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-ayurveda-leaf/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-ayurveda-sand/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-ayurveda-leaf/10 p-3 rounded-2xl mb-4">
            <Leaf className="text-ayurveda-leaf w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-ayurveda-brown">
            Welcome Back
          </h1>
          <p className="text-ayurveda-earth">
            Continue your Ayurvedic journey
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-ayurveda-brown mb-2 pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ayurveda-earth/40" />
              <input
                {...register("email")}
                type="email"
                className={`input-field pl-12 ${errors.email ? "border-red-300" : ""}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ayurveda-brown mb-2 pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ayurveda-earth/40" />
              <input
                {...register("password")}
                type={
                  showPassword ? "text" : (
                    "password"
                  )
                }
                className={`input-field pl-12 pr-12 ${errors.password ? "border-red-300" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ayurveda-earth/40 hover:text-ayurveda-leaf transition-colors"
              >
                {showPassword ?
                  <EyeOff className="w-5 h-5" />
                : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full btn-primary flex justify-center items-center py-4"
          >
            {isLoading ?
              <Loader2 className="w-5 h-5 animate-spin" />
            : "Sign In"}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ayurveda-earth/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-ayurveda-earth/60 font-bold tracking-widest">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-8">
          <SocialLoginButtons />
        </div>

        <p className="mt-8 text-center text-sm text-ayurveda-earth">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-ayurveda-leaf font-bold hover:underline"
          >
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
