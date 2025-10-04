import React from "react";
import { useFadeIn } from "../../hooks/useFadeIn";
import Button from "./../Button";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  const loaded = useFadeIn();

  return (
    <section className={`hero-section ${loaded ? "fade-in" : ""}`}>
      <h1>Take Control of Your Forms Today!</h1>
      <p>
        Effortlessly create custom forms, add new entries, validate input automatically,{" "}
        and keep your data organized — all in one easy-to-use platform.
      </p>
      <Button to="/schemas" variant="hero">
        Get Started
      </Button>
    </section>
  );
};

export default HeroSection;
