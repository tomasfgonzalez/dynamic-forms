import React from "react";
import { useParams } from "react-router-dom";

const FormsPage: React.FC = () => {
  const { schemaName } = useParams<{ schemaName: string }>();

  return (
    <div>
      <h1>Forms Page</h1>
      <p>Placeholder content for FormsPage.</p>
      <p>Schema Name: {schemaName}</p>
    </div>
  );
};

export default FormsPage;
