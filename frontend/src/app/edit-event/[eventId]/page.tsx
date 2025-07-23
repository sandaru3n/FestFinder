"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditEventPage() {
  const [eventName, setEventName] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [tags, setTags] = useState("");
  const [organizedBy, setOrganizedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentEvent, setCurrentEvent] = useState<{ _id: string; name: string; start: { local: string }; venue: { name: string; address: { localized_address_display: string } }; logo?: { url: string }; description?: string; category?: { name: string }; organizedBy?: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${backendUrl}/api/events/${eventId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch event");

        setCurrentEvent(data);
        setEventName(data.name);
        setEventDateTime(data.start.local ? data.start.local.slice(0, 16) : "");
        setEventLocation(data.venue.name || "");
        setEventDescription(data.description || "");
        setCountry(data.venue.address.localized_address_display?.split(", ")[1] || "");
        setCity(data.venue.address.localized_address_display?.split(", ")[0] || "");
        setTags(data.category.name || "");
        setOrganizedBy(data.organizedBy || "");
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");
      
      const formData = new FormData();
      formData.append("name", eventName);
      formData.append("dateTime", eventDateTime);
      formData.append("location", eventLocation);
      formData.append("description", eventDescription);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("tags", tags);
      formData.append("organizedBy", organizedBy);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${backendUrl}/api/events/${eventId}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update event");
      
      // Redirect to dashboard after successful update
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Loading event...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md" encType="multipart/form-data">
          {/* Current Event Image Preview */}
          {currentEvent?.logo?.url && (
            <div className="mb-4">
              <Label>Current Image</Label>
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${currentEvent.logo.url}`}
                alt="Current Event Image"
                className="w-24 h-24 rounded-lg object-cover mt-2"
              />
            </div>
          )}
          <div>
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventDateTime">Event Date and Time</Label>
            <Input
              id="eventDateTime"
              type="datetime-local"
              value={eventDateTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDateTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventLocation">Event Location</Label>
            <Input
              id="eventLocation"
              value={eventLocation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
              placeholder="e.g., music, concert, outdoor"
            />
          </div>
          <div>
            <Label htmlFor="organizedBy">Organized By</Label>
            <Input
              id="organizedBy"
              value={organizedBy}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrganizedBy(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventDescription">About This Event</Label>
            <Textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEventDescription(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="image">Update Event Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating Event..." : "Update Event"}
          </Button>
        </form>
      )}
    </div>
  );
} 