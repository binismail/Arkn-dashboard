"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // SaaS Root entry point routes to Login
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-sm text-gray-500 font-semibold animate-pulse">
        Initializing ARKN Security Shell...
      </div>
    </div>
  );
}
