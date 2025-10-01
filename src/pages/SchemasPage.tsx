// src/pages/SchemasPage.tsx
import React, { useEffect, useState } from "react";
import SchemasGrid from "../components/SchemaPageComponents/SchemasGrid";
import "./SchemasPage.css";

const SchemasPage: React.FC = () => {
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="schemas-page">
      <h1 className={`schemas-title ${fadeIn ? "fade-in" : ""}`}>
        Create, Select or Import a Schema
      </h1>

      <p className={`schemas-description ${fadeIn ? "fade-in" : ""}`}>
        Manage your dynamic forms here. Create a new schema, select an existing one, or import to get started. Each one structures your data and lets you customize fields.
      </p>

      <SchemasGrid />
    </div>
  );
};

export default SchemasPage;
