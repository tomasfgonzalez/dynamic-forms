// src/components/HeroSection.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useFadeIn } from "../../hooks/useFadeIn";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  const loaded = useFadeIn(); // defaults to fade on mount only

  return (
    <section className={`hero-section ${loaded ? "fade-in" : ""}`}>
      <h1>Take Control of Your Forms Today!</h1>
      <p>
        Effortlessly create custom forms, add new entries, validate input automatically,{" "}
        and keep your data organized — all in one easy-to-use platform.
      </p>
      <Link to="/schemas" className="hero-button">
        Get Started
      </Link>
    </section>
  );
};

export default HeroSection;
