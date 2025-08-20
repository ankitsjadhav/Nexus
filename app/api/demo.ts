import { clerkClient } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const demoUserId = process.env.CLERK_DEMO_USER_ID;

    if (!demoUserId) {
      console.error("CLERK_DEMO_USER_ID is not set in environment variables.");
      return res
        .status(500)
        .json({ error: "Demo login is not configured correctly." });
    }

    // Step 1: Create a Sign-In Token (Corrected Method)
    // This method creates a short-lived, one-time-use token for the specified user.
    // This is the modern way to programmatically sign in a user.
    const signInToken = await clerkClient.signInTokens.createSignInToken({
      userId: demoUserId,
      expiresInSeconds: 60, // The token is valid for 60 seconds
    });

    // Step 2: Redirect to the Frontend Callback Page
    // Pass the token as a URL query parameter. The callback page will read this.
    const callbackUrl = new URL("/demo-callback", req.headers.origin);
    callbackUrl.searchParams.set("token", signInToken.token);

    res.redirect(callbackUrl.toString());
  } catch (err) {
    console.error("Clerk demo login error:", err);
    res.status(500).json({ error: "Demo login failed" });
  }
}
