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
    return { score: 0, label: "Too weak", color: "bg-red-500" };
  }

  let score = 0;
  let hasLowercase = /[a-z]/.test(password);
  let hasUppercase = /[A-Z]/.test(password);
  let hasNumbers = /\d/.test(password);
  let hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (hasLowercase) score++;
  if (hasUppercase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChar) score++;

  if (password.length >= 12) {
    score = Math.min(score + 1, 4);
  }

  const strengthMap = {
    0: { label: "Too weak", color: "bg-red-500" },
    1: { label: "Weak", color: "bg-orange-500" },
    2: { label: "Fair", color: "bg-yellow-500" },
    3: { label: "Good", color: "bg-blue-500" },
    4: { label: "Strong", color: "bg-green-500" },
  };

  return { score: Math.max(1, score), ...strengthMap[score as keyof typeof strengthMap] };
};

export const validateForm = (formData: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FormErrors => {
  const errors: FormErrors = {};

  const fullNameError = validateFullName(formData.fullName);
  if (fullNameError) errors.fullName = fullNameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};
