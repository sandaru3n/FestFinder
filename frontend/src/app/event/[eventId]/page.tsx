"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetch(`http://localhost:5000/events/${eventId}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load event details.");
        setLoading(false);
      });
  }, [eventId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Event Not Found</h1>
          <p className="text-slate-600">{error || "The event you are looking for does not exist."}</p>
        </div>
      </div>
    );
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const imageUrl =
    event.logo?.url && event.logo.url.startsWith("http")
      ? event.logo.url
      : event.logo?.url
        ? `${backendUrl}${event.logo.url}`
        : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=300&fit=crop";

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-lg">
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold">{event.name}</CardTitle>
              {event.is_free ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  FREE
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  ${event.ticket_availability?.minimum_ticket_price?.major_value}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-600 mt-2">
              <span className="bg-slate-100 px-2 py-1 rounded text-sm">
                {event.category?.name}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-lg text-slate-700">{event.description}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Date & Time</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span>{formatDate(event.start?.local || "")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-500" />
                    <span>{formatTime(event.start?.local || "")} </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Location</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-slate-500" />
                    <span>{event.venue?.name}</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    {event.venue?.address?.localized_address_display}
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full md:w-auto">
                  View on Eventbrite
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 