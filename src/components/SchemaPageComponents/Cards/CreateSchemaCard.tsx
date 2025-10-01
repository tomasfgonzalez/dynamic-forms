import React from "react";

interface Props {
  fadeIn: boolean;
  onClick: () => void;
}

export default function CreateSchemaCard({ fadeIn, onClick }: Props) {
  return (
    <div
      className={`create-schema-card ${fadeIn ? "fade-in-card show" : ""}`}
      style={{ transitionDelay: `100ms` }}
      onClick={onClick}
    >
      +
    </div>
  );
}
