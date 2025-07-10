"use client";

import Sidebar from "@/components/sidebar";

export default function SettingsPage() {
  return (
    <div>
      <Sidebar />
      <div className="flex flex-col items-center justify-center h-full mt-10">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-muted-foreground text-center">
          Settings page coming soon!
        </p>
      </div>
    </div>
  );
}
