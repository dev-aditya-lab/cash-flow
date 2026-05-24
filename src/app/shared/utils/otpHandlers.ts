import redisClient from "../../config/redis.config.js";
import type { Response } from "express";
import sendError from "../../core/response/error.response.js";
import { otpMaxAllowedAttempts } from "../../core/constent/constent.js";



/**
 * Stores the OTP in Redis with a 10-minute expiration.
 * @param email - The user's email address (used as part of the key)
 * @param otp - The generated OTP string
 */
export async function saveOtp(email: string, otp: string): Promise<void> {
    const key = `otp:${email}`;
    const maxAttempts = 0; // Start at 0 attempts

    // Store OTP details in a Hash
    await redisClient.hSet(key, {
        otp: otp,
        attempts: maxAttempts.toString()
    });

    // Set 10-minute expiration (600 seconds)
    await redisClient.expire(key, 600);
}

/**
 * Verifies the OTP and increments the attempt counter.
 * @param email - The user's email address
 * @param userOtp - The OTP entered by the user
 * @returns boolean - True if verification succeeds
 */
export async function verifyOtp(res: Response, email: string, userOtp: string): Promise<boolean> {

    const key = `otp:${email}`;
    const maxAllowedAttempts = otpMaxAllowedAttempts;

    // Fetch the stored OTP data
    const storedData = await redisClient.hGetAll(key);

    // Check if OTP exists or expired
    if (!storedData || Object.keys(storedData).length === 0) {
        sendError(res, 400, 'OTP has expired or does not exist. Please request a new one.', null);
        return false;
    }

    const currentAttempts = Number(storedData.attempts ?? 0);

    // Block if max attempts exceeded
    if (currentAttempts >= maxAllowedAttempts) {
        sendError(res, 429, 'Too many incorrect attempts. Please request a new OTP.', null);
        return false;
    }

    // Check if the OTP matches
    if (storedData.otp === userOtp) {
        // Success: Delete the key so it cannot be reused
        await redisClient.del(key);
        return true;
    }

    // Failure: Increment the attempt counter in Redis
    await redisClient.hIncrBy(key, 'attempts', 1);
    const attemptsLeft = maxAllowedAttempts - (currentAttempts + 1);
    sendError(res, 400, `Invalid OTP. You have ${attemptsLeft} attempt(s) left.`, null);
    return false;
}
