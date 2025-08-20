"use client";

import { LandingContent } from "@/components/landing-content";
import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navabar";
import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    if (!isLoaded || !signIn) return;

    setLoading(true);

    try {
      const attempt = await signIn.create({
        identifier: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL!,
        password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD!,
      });

      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Demo login failed:", attempt);
      }
    } catch (err) {
      console.error("Error during demo login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full relative">
      <LandingNavbar />
      <LandingHero />

      <div
        className="relative z-10 mt-[-8rem] mb-12 mx-auto max-w-lg p-8 
                      bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100
                      rounded-2xl shadow-lg text-center border border-gray-200
                      transition-all duration-300 ease-in-out
                      hover:shadow-2xl hover:scale-[1.02]"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Want to see it in action?
        </h3>
        <p className="text-gray-600 mb-6">
          Click below to explore the app instantly. No sign-up required.
        </p>
        <Button
          onClick={handleDemoLogin}
          disabled={loading}
          className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg 
                     shadow-md hover:bg-indigo-700 transition-transform duration-200 ease-in-out hover:scale-105"
        >
          {loading ? "Logging in..." : "One-Click Demo Login"}
        </Button>
      </div>

      <LandingContent />
    </div>
  );
}
