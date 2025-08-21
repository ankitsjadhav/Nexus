"use client";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";

const Navbar = () => {
  const { user, isLoaded } = useUser();
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL;

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        {isLoaded && user?.primaryEmailAddress?.emailAddress === demoEmail ? (
          <SignOutButton>
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
              Sign out
            </button>
          </SignOutButton>
        ) : (
          <UserButton />
        )}
      </div>
    </div>
  );
};

export default Navbar;
