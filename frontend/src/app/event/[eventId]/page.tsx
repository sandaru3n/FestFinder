"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ExternalLink, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type Event = {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  start: { local: string; timezone?: string };
  end?: { local: string; timezone?: string };
  url?: string;
  is_free?: boolean;
  ticket_availability?: {
    minimum_ticket_price?: { major_value: string; currency: string };
    has_available_tickets?: boolean;
  };
  venue?: { name?: string; address?: { localized_address_display?: string } };
  category?: { name?: string };
  logo?: { url?: string };
  organizer?: { name?: string; logo?: string };
};

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
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

  // Fetch related events
  useEffect(() => {
    if (!eventId) return;
    fetch(`http://localhost:5000/events/${eventId}/related`)
      .then(res => res.json())
      .then(data => {
        setRelatedEvents(data);
      })
      .catch(() => {
        // Ignore related events error for now
      });
  }, [eventId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
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
  const imageUrl = event.logo?.url && event.logo.url.startsWith("http")
    ? event.logo.url
    : event.logo?.url
      ? `${backendUrl}${event.logo.url}`
      : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-72 md:h-96 bg-slate-200 flex items-end">
        <img
          src={imageUrl}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        <div className="relative z-20 max-w-5xl mx-auto w-full px-4 pb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{event.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white/90 text-base mb-2">
              <span className="flex items-center gap-1"><Calendar className="w-5 h-5" /> {formatDate(event.start?.local || "")}</span>
              <span className="flex items-center gap-1"><Clock className="w-5 h-5" /> {formatTime(event.start?.local || "")}</span>
              <span className="flex items-center gap-1"><MapPin className="w-5 h-5" /> {event.venue?.name}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">{event.category?.name}</Badge>
              {event.is_free ? (
                <Badge variant="secondary" className="bg-green-500/80 text-white border-none">FREE</Badge>
              ) : (
                <Badge variant="secondary" className="bg-blue-500/80 text-white border-none">${event.ticket_availability?.minimum_ticket_price?.major_value}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content + Sticky Sidebar */}
      <div className="max-w-5xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* About Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About this event</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{event.description}</p>
          </section>

          {/* Date & Time Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Date & Time</h2>
            <div className="flex items-center gap-3 text-slate-700">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>{formatDate(event.start?.local || "")}</span>
              <Clock className="w-5 h-5 text-blue-600 ml-4" />
              <span>{formatTime(event.start?.local || "")}</span>
              {event.end?.local && <span>- {formatTime(event.end.local)}</span>}
            </div>
          </section>

          {/* Location Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Location</h2>
            <div className="flex items-center gap-3 text-slate-700 mb-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>{event.venue?.name}</span>
            </div>
            <div className="text-slate-500 mb-4">{event.venue?.address?.localized_address_display}</div>
            {/* Map Placeholder */}
            <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
              Map coming soon
            </div>
          </section>

          {/* Organizer Section */}
          {event.organizer && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Organizer</h2>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={event.organizer.logo} />
                  <AvatarFallback>{event.organizer.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.organizer.name}</p>
                  <p className="text-sm text-slate-500">Event Organizer</p>
                </div>
              </div>
            </section>
          )}

          {/* Related Events Widget */}
          {relatedEvents.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Related Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedEvents.map((rel) => {
                  const relImageUrl = rel.logo?.url && rel.logo.url.startsWith("http")
                    ? rel.logo.url
                    : rel.logo?.url
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${rel.logo.url}`
                      : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=200&fit=crop";
                  return (
                    <Link key={rel._id || rel.id} href={`/event/${rel._id || rel.id}`} className="block group">
                      <div className="rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                        <img src={relImageUrl} alt={rel.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                        <div className="p-3">
                          <div className="font-semibold text-lg truncate" title={rel.name}>{rel.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{rel.category?.name}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sticky Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0 md:sticky md:top-24 h-fit">
          <div className="bg-white border border-slate-200 rounded-xl shadow p-6 mb-6">
            <div className="mb-4">
              <div className="text-2xl font-bold mb-1">{event.is_free ? "Free" : `$${event.ticket_availability?.minimum_ticket_price?.major_value}`}</div>
              <div className="text-slate-500 text-sm">{event.ticket_availability?.has_available_tickets ? "Tickets available" : "Sold out"}</div>
            </div>
            <Button className="w-full mb-2" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              {event.is_free ? "Register" : "Get Tickets"}
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </Button>
          </div>
          {/* Event Policies */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <div>
                <p className="font-medium">Refund Policy</p>
                <p className="text-sm text-slate-500">No refunds will be issued within 24 hours of the event.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <div>
                <p className="font-medium">Age Requirement</p>
                <p className="text-sm text-slate-500">This event is open to all ages.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 