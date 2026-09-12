
export function setCookie(
    res: any,
    value: string,
    name: String = "cash_flow_token",
) {
    res.cookie(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',   // 'strict' blocks cookies on TWA/PWA cold-opens from the Android launcher
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}

export function clearCookie(res: any, name: String = "cash_flow_token") {
    res.clearCookie(name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}
