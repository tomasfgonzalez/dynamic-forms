// src/components/FeaturesSection.tsx
import React from "react";
import { useFadeIn } from "../../hooks/useFadeIn";
import "./FeaturesSection.css";

const FeaturesSection: React.FC = () => {
  const loaded = useFadeIn(); // just call hook

  return (
    <section className={`features-section ${loaded ? "fade-in" : ""}`}>
      <h2>Why Choose DynamicForms?</h2>
      <div className="features-container">
        <div className="feature-card">
          <h3>Build or Import Forms</h3>
          <p>
            Create a new form from scratch or upload a <strong>JSON</strong>{" "}
            schema to get started quickly.
          </p>
        </div>
        <div className="feature-card">
          <h3>Automatic Validation</h3>
          <p>
            Validate user input according to schema rules instantly, keeping your
            data clean and accurate.
          </p>
        </div>
        <div className="feature-card">
          <h3>Manage Your Data</h3>
          <p>
            Add new entries, edit existing submissions, and export your data as{" "}
            <strong>CSV</strong> files.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
