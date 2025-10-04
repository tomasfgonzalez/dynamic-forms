import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "hero" | "gray"| "normal" | "remove" | "blue";
  className?: string;
  onClick?: () => void;
  to?: string; // optional, only needed for links
}

const Button: React.FC<BaseButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  to,
}) => {
  const classes = `btn ${variant} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
    </button>
  );
};

export default Button;
