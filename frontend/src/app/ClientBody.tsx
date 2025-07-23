"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HeaderNav } from "@/components/header-nav";

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

  return (
    <div className="antialiased">
      {!isAdminRoute && <HeaderNav />}
      {children}
    </div>
  );
}
