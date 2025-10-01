// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "../pages/HomePage";
import DataViewerPage from "../pages/DataViewerPage";
import SchemasPage from "../pages/SchemasPage";
import FormsPage from "../pages/FormsPage";

// Components
import Navbar from "../components/Navbar";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schemas" element={<SchemasPage />} />
        <Route path="/data-viewer" element={<DataViewerPage />} />
        <Route path="/form/:schemaName" element={<FormsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
