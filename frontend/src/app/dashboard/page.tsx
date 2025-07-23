"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [events, setEvents] = useState<{ _id: string; name: string; start: { local: string }; venue: { name: string; address: { localized_address_display: string } }; logo?: { url: string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${backendUrl}/api/events`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch events");
        setEvents(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(`${backendUrl}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete event");

      // Refresh the events list
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete event");
    }
  };

  const handleEdit = (eventId: string) => {
    router.push(`/edit-event/${eventId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <div className="mb-4">
        <Button onClick={() => router.push("/add-event")}>
          Add New Event
        </Button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <p className="text-gray-600">No events found. Create your first event!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event._id} className="border rounded-lg p-4 shadow-sm">
              {/* Event Image */}
              <div className="flex-shrink-0 mb-3">
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${event.logo?.url || ''}` || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=200&fit=crop"}
                  alt={event.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold mb-2">{event.name}</h2>
              <p className="text-sm text-gray-600 mb-1">Date: {new Date(event.start.local).toLocaleString()}</p>
              <p className="text-sm text-gray-600 mb-1">Location: {event.venue.name}</p>
              <p className="text-sm text-gray-600 mb-3">City: {event.venue.address.localized_address_display}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(event._id)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(event._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 