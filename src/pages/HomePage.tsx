// src/pages/HomePage.tsx
import React from "react";
import HeroSection from "../components/HomePage/HeroSection";
import FeaturesSection from "../components/HomePage/FeaturesSection";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default HomePage;
