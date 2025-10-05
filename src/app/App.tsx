// src/app/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "../pages/HomePage";
import DataViewerPage from "../pages/DataViewerPage";
import SchemasPage from "../pages/SchemasPage";
import FormsPage from "../pages/FormsPage";

// Components
import Navbar from "../components/Navbar";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="app-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schemas" element={<SchemasPage />} />
          <Route path="/data-viewer" element={<DataViewerPage />} />
          <Route path="/form/:schemaName" element={<FormsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

