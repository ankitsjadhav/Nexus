"use client";

import { LandingContent } from "@/components/landing-content";
import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navabar";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const handleDemoLogin = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="h-full relative">
      <LandingNavbar />
      <LandingHero />

      <div
        className="
          relative z-10  
          mt-[-8rem]     
          mb-12          
          mx-auto max-w-lg p-8 
          bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100
          rounded-2xl 
          shadow-lg 
          text-center 
          border border-gray-200
          transition-all duration-300 ease-in-out
          hover:shadow-2xl hover:scale-[1.02]
        "
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Want to see it in action?
        </h3>

        <p className="text-gray-600 mb-6">
          Click below to explore the app instantly. No sign-up required.
        </p>
        <Button
          onClick={handleDemoLogin}
          className="
            bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg 
            shadow-md hover:bg-indigo-700 
            transition-transform duration-200 ease-in-out
            hover:scale-105
          "
        >
          One-Click Demo Login
        </Button>
      </div>

      <LandingContent />
    </div>
  );
};

export default LandingPage;
