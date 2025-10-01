// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav>
      <div className="brand">DynamicForms</div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/schemas">Schemas</Link></li>
        <li><Link to="/data-viewer">Form Viewer</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
