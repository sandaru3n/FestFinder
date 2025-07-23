"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HeaderNav } from "@/components/header-nav";
import { RightSidebar } from "@/components/ui/right-sidebar";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <div className="antialiased">
      {!isAdminRoute && <HeaderNav />}
      <div className="flex min-h-screen">
        {isLoggedIn && !isAdminRoute && <RightSidebar />}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
