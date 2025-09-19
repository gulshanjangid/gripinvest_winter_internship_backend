interface PasswordStrength {
  score: number;
  feedback: string;
  suggestions: string[];
  isStrong: boolean;
}

interface PasswordAnalysis {
  length: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasCommonPatterns: boolean;
  hasRepeatedChars: boolean;
  hasSequentialChars: boolean;
  hasPersonalInfo: boolean;
}

export function analyzePasswordStrength(password: string, userInfo?: { firstName?: string; lastName?: string; email?: string }): PasswordStrength {
  const analysis = analyzePassword(password, userInfo);
  const score = calculateScore(analysis);
  const feedback = generateFeedback(score);
  const suggestions = generateSuggestions(analysis, score);
  
  return {
    score,
    feedback,
    suggestions,
    isStrong: score >= 4
  };
}

function analyzePassword(password: string, userInfo?: { firstName?: string; lastName?: string; email?: string }): PasswordAnalysis {
  const length = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  const hasCommonPatterns = /(123|abc|qwe|asd|zxc|password|admin|login)/i.test(password);
  const hasRepeatedChars = /(.)\1{2,}/.test(password);
  const hasSequentialChars = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);
  
  let hasPersonalInfo = false;
  if (userInfo) {
    const personalInfo = [
      userInfo.firstName?.toLowerCase(),
      userInfo.lastName?.toLowerCase(),
      userInfo.email?.split('@')[0]?.toLowerCase()
    ].filter(Boolean);
    
    hasPersonalInfo = personalInfo.some(info => 
      info && password.toLowerCase().includes(info)
    );
  }

  return {
    length,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
    hasCommonPatterns,
    hasRepeatedChars,
    hasSequentialChars,
    hasPersonalInfo
  };
}

function calculateScore(analysis: PasswordAnalysis): number {
  let score = 0;
  
  // Basic requirements (each worth 1 point)
  if (analysis.length) score += 1;
  if (analysis.hasUppercase) score += 1;
  if (analysis.hasLowercase) score += 1;
  if (analysis.hasNumbers) score += 1;
  if (analysis.hasSymbols) score += 1;
  
  // Bonus points for length
  if (analysis.length) {
    const length = analysis.length ? 8 : 0; // We know it's at least 8 if length is true
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
  }
  
  // Penalties for weak patterns
  if (analysis.hasCommonPatterns) score -= 2;
  if (analysis.hasRepeatedChars) score -= 1;
  if (analysis.hasSequentialChars) score -= 1;
  if (analysis.hasPersonalInfo) score -= 2;
  
  return Math.max(0, Math.min(5, score));
}

function generateFeedback(score: number): string {
  if (score === 0) return "Very Weak";
  if (score === 1) return "Weak";
  if (score === 2) return "Fair";
  if (score === 3) return "Good";
  if (score === 4) return "Strong";
  return "Very Strong";
}

function generateSuggestions(analysis: PasswordAnalysis, score: number): string[] {
  const suggestions: string[] = [];
  
  if (!analysis.length) {
    suggestions.push("Use at least 8 characters");
  } else if (score < 4) {
    suggestions.push("Consider using 12+ characters for better security");
  }
  
  if (!analysis.hasUppercase) {
    suggestions.push("Add uppercase letters (A-Z)");
  }
  
  if (!analysis.hasLowercase) {
    suggestions.push("Add lowercase letters (a-z)");
  }
  
  if (!analysis.hasNumbers) {
    suggestions.push("Include numbers (0-9)");
  }
  
  if (!analysis.hasSymbols) {
    suggestions.push("Add special characters (!@#$%^&*)");
  }
  
  if (analysis.hasCommonPatterns) {
    suggestions.push("Avoid common patterns like '123', 'abc', or 'password'");
  }
  
  if (analysis.hasRepeatedChars) {
    suggestions.push("Avoid repeating characters (e.g., 'aaa', '111')");
  }
  
  if (analysis.hasSequentialChars) {
    suggestions.push("Avoid sequential characters (e.g., 'abc', '123')");
  }
  
  if (analysis.hasPersonalInfo) {
    suggestions.push("Don't use personal information like your name or email");
  }
  
  if (score >= 4) {
    suggestions.push("Great! Your password is strong and secure");
  }
  
  return suggestions;
}

export function generateStrongPassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
