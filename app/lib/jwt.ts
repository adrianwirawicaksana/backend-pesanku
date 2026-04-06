import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
}

export function signToken(
    payload: object,
    expiresIn: SignOptions["expiresIn"] = "1h"
): string {
    try {
        return jwt.sign(payload, getJwtSecret(), { expiresIn });
    } catch (error) {
        console.error("Error signing JWT:", error);
        throw new Error("Failed to sign token");
    }
}

export function verifyToken(token: string): string | JwtPayload {
    try {
        return jwt.verify(token, getJwtSecret());
    } catch (error) {
        console.error("Error verifying JWT:", error);
        throw new Error("Invalid or expired token");
    }
}