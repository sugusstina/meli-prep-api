export function maskSecret(secret) {
    if (!secret) {
      return "";
    }
  
    if (secret.length <= 4) {
      return "****";
    }
  
    const visibleLastChars = secret.slice(-4);
  
    return `****${visibleLastChars}`;
  }