// src/pages/HomePage.tsx
import React from "react";
import HeroSection from "../components/HomePageComponents/HeroSection";
import FeaturesSection from "../components/HomePageComponents/FeaturesSection";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default HomePage;
