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
  User,
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
import type { AxiosError } from "axios";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(
        2,
        "Name must be at least 2 characters",
      ),
    email: z
      .string()
      .email("Invalid email address"),
    password: z
      .string()
      .min(
        6,
        "Password must be at least 6 characters",
      ),
    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

type RegisterForm = z.infer<
  typeof registerSchema
>;

const Register = () => {
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
  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response =
        await api.post<AuthResponse>(
          "/auth/register",
          {
            name: data.name,
            email: data.email,
            password: data.password,
          },
        );

      const { token, userId, ...userData } =
        response.data;
      setAuth(
        {
          id: userId,
          name: userData.name,
          email: userData.email,
          isOnboardingCompleted:
            userData.isOnboardingCompleted,
        },
        token,
      );

      if (userData.isOnboardingCompleted) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      const axiosError =
        err as AxiosError<string>;
      setError(
        axiosError.response?.data ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayurveda-cream flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-ayurveda-sand/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-ayurveda-leaf/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-ayurveda-leaf/10 p-3 rounded-2xl mb-4">
            <Leaf className="text-ayurveda-leaf w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-ayurveda-brown">
            Create Account
          </h1>
          <p className="text-ayurveda-earth">
            Start your Ayurvedic journey today
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-ayurveda-brown mb-2 pl-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ayurveda-earth/40" />
              <input
                {...register("name")}
                className={`input-field pl-12 ${errors.name ? "border-red-300" : ""}`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 pl-1">
                {errors.name.message}
              </p>
            )}
          </div>

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
                title={
                  showPassword ?
                    "Hide password"
                  : "Show password"
                }
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

          <div>
            <label className="block text-sm font-semibold text-ayurveda-brown mb-2 pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ayurveda-earth/40" />
              <input
                {...register("confirmPassword")}
                type={
                  showConfirmPassword ? "text" : (
                    "password"
                  )
                }
                className={`input-field pl-12 pr-12 ${errors.confirmPassword ? "border-red-300" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ayurveda-earth/40 hover:text-ayurveda-leaf transition-colors"
                title={
                  showConfirmPassword ?
                    "Hide password"
                  : "Show password"
                }
              >
                {showConfirmPassword ?
                  <EyeOff className="w-5 h-5" />
                : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 pl-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full btn-primary flex justify-center items-center py-4 mt-4"
          >
            {isLoading ?
              <Loader2 className="w-5 h-5 animate-spin" />
            : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ayurveda-earth">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-ayurveda-leaf font-bold hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
