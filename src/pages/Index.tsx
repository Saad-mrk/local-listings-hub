import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import Categories from "@/components/Categories";
import AdsGrid from "@/components/AdsGrid";
import Footer from "@/components/Footer";
import FeaturedAds from "@/components/FeaturedAds";
import AnimatedStats from "@/components/AnimatedStats";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import ChatBot from "@/components/ChatBot";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSearch />
        <Categories />

        {/* Featured Ads Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FeaturedAds />
        </motion.div>

        {/* Recent Ads */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <AdsGrid />
        </motion.div>

        {/* Animated Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container px-4"
        >
          <AnimatedStats />
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <HowItWorks />
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Testimonials />
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FAQ />
        </motion.div>
      </main>
      <Footer />

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Index;
