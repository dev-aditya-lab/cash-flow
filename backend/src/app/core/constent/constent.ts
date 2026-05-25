export const emailRegex : RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex : RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 


export const authEmail: string = "cashflow-auth@devaditya.dev";

export const supportEmail: string = "contact-cashflow@devaditya.dev";

export const otpMaxAllowedAttempts: number = 3;