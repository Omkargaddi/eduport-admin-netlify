// src/components/ui/button/Button.tsx

import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;              // Button text or content
  size?: "sm" | "md";               // Button size
  variant?: "primary" | "outline";  // Button variant
  startIcon?: ReactNode;            // Icon before the text
  endIcon?: ReactNode;              // Icon after the text
  // We no longer need a separate "onClick" or "disabled" 
  // here because ButtonHTMLAttributes<HTMLButtonElement> already includes them.
  className?: string;               // Additional classes
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  type = "button",   // default to "button" (so it does not submit unless explicitly set to "submit")
  className = "",
  disabled = false,
  ...restProps       // allow any other valid button attributes (e.g. aria-label, etc.)
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={disabled}
      {...restProps}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
