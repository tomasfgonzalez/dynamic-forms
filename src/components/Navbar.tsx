import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png"; // make sure path is correct

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="brand">
        <img src={logo} alt="Logo" className="logo" />
        <span>DynamicForms</span>
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/schemas">Schemas</Link></li>
        <li><Link to="/data-viewer">Form Viewer</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
