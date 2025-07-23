"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function RightSidebar() {
  const router = useRouter();

  return (
    <div className="w-64 p-4 bg-gray-50 border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => router.push("/add-event")}
        >
          Add Event
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => router.push("/profile")}
        >
          Profile
        </Button>
      </div>
    </div>
  );
} 