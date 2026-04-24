"use client";

import { getPasswordStrength } from "./formValidation";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const { score, label, color } = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors ${
              i <= score ? color : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-medium text-gray-600">
        Password strength: <span className={color.replace("bg-", "text-")}>{label}</span>
      </p>
    </div>
  );
}
