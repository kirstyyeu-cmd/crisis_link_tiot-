export interface SignInErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const validateSignInEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
};

export const validateSignInPassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required";
  }
  return undefined;
};

export const validateSignInForm = (formData: {
  email: string;
  password: string;
}): SignInErrors => {
  const errors: SignInErrors = {};

  const emailError = validateSignInEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validateSignInPassword(formData.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};
