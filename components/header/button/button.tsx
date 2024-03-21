import React from "react";
import "./style.scss";
import { FiLoader } from "react-icons/fi";
import Link from "next/link";

interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

interface IconButtonProps {
  variant: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

interface LinkButtonProps {
  variant: "primary" | "secondary" | "danger";
  children?: React.ReactNode;
  href: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  isLoading = false,
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn-${variant} ${isLoading ? "btn-disabled" : ""} ${
        isLoading ? "btn-loading" : ""
      }`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <FiLoader className="loader-icon-btn" /> : children}
    </button>
  );
};

export const ButtonIcon: React.FC<IconButtonProps> = ({
  variant,
  isLoading = false,
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn-icon btn-${variant} ${
        isLoading ? "btn-disabled" : ""
      } ${isLoading ? "btn-loading" : ""}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <FiLoader className="loader-icon-btn" /> : children}
    </button>
  );
};

export const ButtonLink: React.FC<LinkButtonProps> = ({
  variant,
  children,
  href,
}) => {
  return (
    <Link href={href} className={`btn btn-${variant}`}>
      {children}
    </Link>
  );
};
