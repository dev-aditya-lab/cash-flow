import { randomInt } from "crypto";
 
/**
 * Generate a cryptographically secure numeric OTP.
 *
 * @param size - Number of digits (default: 4, range: 4–8)
 * @returns OTP string with leading zeros preserved
 *
 * @example
 *   generateOtp()    // "4829"
 *   generateOtp(6)   // "038412"
 *   generateOtp(8)   // "73041926"
 */

export const generateOtp = (size: number = 4): string =>{
  if (!Number.isInteger(size) || size < 4 || size > 8) {
    throw new RangeError("OTP size must be an integer between 4 and 8");
  }
 
  const min = 0;
  const max = 10 ** size; // exclusive upper bound
 
  return randomInt(min, max).toString().padStart(size, "0");
}
 