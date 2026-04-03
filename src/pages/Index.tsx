import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import Categories from "@/components/Categories";
import AdsGrid from "@/components/AdsGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSearch />
        <Categories />
        <AdsGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
