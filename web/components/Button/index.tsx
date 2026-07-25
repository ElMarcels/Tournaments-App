/* web/components/Button/index.tsx */
import React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    variant?: "primary" | "secondary" | "outline";
}

const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps) => {
    let baseClasses = "px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-4";
    let variantClasses = "";

    switch (variant) {
        case "primary":
            // Default esports purple feel
            variantClasses = "bg-purple-600 hover:bg-purple-700 text-white ring-purple-500/70";
            break;
        case "secondary":
            // Blue electric accent
            variantClasses = "bg-blue-600 hover:bg-blue-700 text-white ring-blue-500/70";
            break;
        case "outline":
            // Subtle border
            variantClasses = "border border-gray-500 text-gray-200 hover:bg-gray-700/30 ring-gray-500/50";
            break;
    }

    return (
        <button 
            className={`${baseClasses} ${variantClasses} ${className}`} 
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;