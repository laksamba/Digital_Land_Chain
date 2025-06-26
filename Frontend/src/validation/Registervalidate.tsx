

export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

// Individual field validators
export const validateName = (name: string): string => {
  if (!name.trim()) {
    return "Name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  if (name.trim().length > 50) {
    return "Name must be less than 50 characters";
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return "Name can only contain letters and spaces";
  }
  return "";
};

export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  if (email.length > 254) {
    return "Email address is too long";
  }
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (password.length > 128) {
    return "Password must be less than 128 characters";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
    return "Password must contain at least one special character";
  }
  return "";
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords don't match";
  }
  return "";
};

// Main form validation function
export const validateForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  return errors;
};

// Password strength calculator
export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { strength: 0, label: "", color: "bg-gray-300" };
  }
  
  let score = 0;
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
    password.length >= 12,
    /(?=.*[a-z].*[a-z])/.test(password), // Multiple lowercase
    /(?=.*[A-Z].*[A-Z])/.test(password), // Multiple uppercase
    /(?=.*\d.*\d)/.test(password), // Multiple numbers
  ];
  
  score = checks.filter(Boolean).length;
  
  const strengthLevels = [
    { min: 0, max: 2, label: "Very Weak", color: "bg-red-500" },
    { min: 3, max: 4, label: "Weak", color: "bg-orange-500" },
    { min: 5, max: 6, label: "Fair", color: "bg-yellow-500" },
    { min: 7, max: 8, label: "Good", color: "bg-blue-500" },
    { min: 9, max: 9, label: "Strong", color: "bg-green-500" },
  ];
  
  const level = strengthLevels.find(l => score >= l.min && score <= l.max) || strengthLevels[0];
  
  return {
    strength: score,
    label: level.label,
    color: level.color
  };
};

// Utility function to check if form is valid
export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};

// Utility function to clear specific error
export const clearError = (errors: ValidationErrors, fieldName: string): ValidationErrors => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};




