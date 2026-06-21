export interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
}

export const validateFullName = (fullName: string): string | undefined => {
  if (!fullName.trim()) {
    return "Full name is required";
  }
  if (fullName.trim().length < 2) {
    return "Full name must be at least 2 characters";
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return undefined;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return undefined;
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 1, label: "Too weak", color: "bg-red-500" };
  }

  // Define each criterion validation check as a boolean flag
  const criteria = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  ];

  // Count criteria met using a pure array reduce (with const accumulator)
  const baseScore = criteria.reduce((acc, met) => acc + (met ? 1 : 0), 0);
  
  // Calculate potential bonus points if length is 12 or more without mutating a variable
  const score = password.length >= 12 ? Math.min(baseScore + 1, 4) : baseScore;

  // Immutably structure score translations using an object mapping lookup
  const strengthMap: Record<number, { label: string; color: string }> = {
    0: { label: "Too weak", color: "bg-red-500" },
    1: { label: "Weak", color: "bg-orange-500" },
    2: { label: "Fair", color: "bg-yellow-500" },
    3: { label: "Good", color: "bg-blue-500" },
    4: { label: "Strong", color: "bg-green-500" },
  };

  // Ensure score constraints fallback within bounds securely
  const finalScore = Math.max(1, score);

  return {
    score: finalScore,
    ...strengthMap[finalScore as keyof typeof strengthMap],
  };
};

export const validateForm = (formData: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FormErrors => {
  const errors: FormErrors = {};

  const fullNameError = validateFullName(formData.fullName);
  const emailError = validateEmail(formData.email);
  const passwordError = validatePassword(formData.password);
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

  if (fullNameError) errors.fullName = fullNameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};