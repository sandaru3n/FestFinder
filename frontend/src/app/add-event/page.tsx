"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function AddEventPage() {
  const [eventName, setEventName] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [organizedBy, setOrganizedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const [isFree, setIsFree] = useState(false);
  const [ticketPrice, setTicketPrice] = useState("");

  const categories = [
    "Business & Professional",
    "Music",
    "Health & Wellness",
    "Arts & Culture",
    "Food & Drink"
  ];
  const [category, setCategory] = useState("");

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
      formData.append("organizedBy", organizedBy);
      formData.append("category", category);
      formData.append("is_free", isFree ? "true" : "false");
      formData.append("ticket_price", isFree ? "Free" : ticketPrice);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${backendUrl}/api/events`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add event");
      
      // Redirect to dashboard or event page after successful submission
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to add event");
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
      <h1 className="text-2xl font-bold mb-6">Add New Event</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md" encType="multipart/form-data">
        <div>
          <Label htmlFor="eventName">Event Name</Label>
          <Input
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
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
          <Label htmlFor="organizedBy">Organized By</Label>
          <Input
            id="organizedBy"
            value={organizedBy}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrganizedBy(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
          <Label htmlFor="isFree">Is this event free?</Label>
          <input
            id="isFree"
            type="checkbox"
            checked={isFree}
            onChange={e => {
              setIsFree(e.target.checked);
              if (e.target.checked) setTicketPrice("Free");
              else setTicketPrice("");
            }}
            className="ml-2"
          />
        </div>
        <div>
          <Label htmlFor="ticketPrice">Ticket Price</Label>
          <Input
            id="ticketPrice"
            type="text"
            value={isFree ? "Free" : ticketPrice}
            onChange={e => setTicketPrice(e.target.value)}
            disabled={isFree}
            placeholder="e.g. 10, 10-20, etc."
            required={!isFree}
          />
        </div>
        <div>
          <Label htmlFor="image">Event Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding Event..." : "Add Event"}
        </Button>
      </form>
    </div>
  );
} 