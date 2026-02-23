import { motion } from "framer-motion";
import {
  Leaf,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-ayurveda-cream selection:bg-ayurveda-leaf/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="text-ayurveda-leaf w-8 h-8" />
          <span className="text-2xl font-bold text-ayurveda-brown">
            VedaAI
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="text-ayurveda-brown hover:text-ayurveda-leaf transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm py-2"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-ayurveda-leaf/10 text-ayurveda-leaf px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block">
            Ancient Wisdom. Modern Intelligence.
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-ayurveda-brown mb-6 leading-tight">
            Balance Your{" "}
            <span className="text-ayurveda-leaf">
              Doshas
            </span>{" "}
            <br className="hidden sm:block" />{" "}
            Naturally with AI
          </h1>
          <p className="text-lg text-ayurveda-earth max-w-2xl mb-10 leading-relaxed">
            Discover personalized Ayurvedic
            wellness paths. Understand your body's
            constitution and receive guidance on
            herbs, lifestyle, and nutrition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary flex items-center gap-2"
            >
              Start Your Journey{" "}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Hero Image/Illustration Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
          }}
          className="mt-16 w-full max-w-4xl aspect-[16/9] rounded-3xl bg-gradient-to-br from-ayurveda-leaf/20 to-ayurveda-sand/20 flex items-center justify-center border border-ayurveda-leaf/10 overflow-hidden relative"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-48 h-48 text-ayurveda-leaf/10 rotate-12" />
          </div>
          <div className="relative z-10 p-8 glass-card rounded-2xl max-w-md">
            <p className="italic text-ayurveda-brown/80 mb-2">
              "Health is a state of complete
              harmony of the body, mind and
              spirit."
            </p>
            <p className="font-bold text-ayurveda-brown">
              — Charaka Samhita
            </p>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section
        id="how-it-works"
        className="py-12 md:py-20 bg-white/50 px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <BenefitCard
            icon={
              <Sparkles className="w-8 h-8 text-ayurveda-sand" />
            }
            title="Dosha Analysis"
            description="Understand Vata, Pitta, and Kapha balances in your unique constitution."
          />
          <BenefitCard
            icon={
              <Leaf className="w-8 h-8 text-ayurveda-leaf" />
            }
            title="Herbal Guidance"
            description="Receive suggestions for natural Ayurvedic herbs based on your wellness goals."
          />
          <BenefitCard
            icon={
              <ShieldCheck className="w-8 h-8 text-ayurveda-earth" />
            }
            title="Safety First"
            description="Built-in emergency detection and constant educational disclaimers."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-ayurveda-earth/10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="text-ayurveda-leaf w-6 h-6" />
          <span className="text-xl font-bold text-ayurveda-brown">
            VedaAI
          </span>
        </div>
        <p className="text-sm text-ayurveda-earth px-6 text-center max-w-lg mb-4">
          Ayurvedic Educational Wellness
          Assistant. Not a substitute for
          professional medical advice, diagnosis,
          or treatment.
        </p>
        <div className="text-ayurveda-brown/60 text-xs">
          © {new Date().getFullYear()} VedaAI. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
};

const BenefitCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-8 rounded-3xl bg-white border border-ayurveda-earth/5 hover:border-ayurveda-leaf/20 transition-all hover:shadow-premium group">
    <div className="mb-6 p-3 bg-ayurveda-cream w-fit rounded-2xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-ayurveda-brown mb-3">
      {title}
    </h3>
    <p className="text-ayurveda-earth leading-relaxed">
      {description}
    </p>
  </div>
);

export default Landing;
