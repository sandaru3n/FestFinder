"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, Filter, Search, ExternalLink } from "lucide-react";

export default function AllEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/events");
      const data = await response.json();
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category?.name === categoryFilter;
    const matchesPrice = priceFilter === "all" ||
      (priceFilter === "free" && event.is_free) ||
      (priceFilter === "paid" && !event.is_free);
    const today = new Date();
    const eventDate = new Date(event.start.local);
    const matchesDate = dateFilter === "all" ||
      (dateFilter === "today" && eventDate.toDateString() === today.toDateString()) ||
      (dateFilter === "weekend" && (eventDate.getDay() === 0 || eventDate.getDay() === 6));
    return matchesSearch && matchesCategory && matchesPrice && matchesDate;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                All Events
              </h1>
              <p className="text-slate-600">
                Discover what's happening everywhere
              </p>
            </div>
            <Badge variant="outline" className="text-lg py-2 px-4">
              {filteredEvents.length} Events Found
            </Badge>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Events</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Business & Professional">Business</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                      <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                      <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Price Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Price</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Date Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">When</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="weekend">This Weekend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Sidebar Ad */}
                <div className="mt-8">
                  <div className="w-full bg-slate-200 rounded-lg p-4 text-center">
                    <div className="h-64 bg-slate-300 rounded flex items-center justify-center text-slate-600 text-sm">
                      Sidebar Ad (300x250)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Main Content - Events List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading events...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredEvents.map((event, index) => {
                  const imageUrl =
                    event.logo?.url
                      ? event.logo.url.startsWith('http')
                        ? event.logo.url
                        : `${backendUrl}${event.logo.url}`
                      : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=200&fit=crop";
                  return (
                    <div key={event.id || event._id}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Event Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={imageUrl}
                                alt={event.name}
                                className="w-24 h-24 rounded-lg object-cover"
                              />
                            </div>
                            {/* Event Details */}
                            <div className="flex-grow">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-slate-900 hover:text-blue-600">
                                  {event.name}
                                </h3>
                                <div className="text-right">
                                  {event.is_free ? (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      FREE
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">
                                      ${event.ticket_availability?.minimum_ticket_price?.major_value}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-slate-600 mb-3 line-clamp-2">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(event.start.local)}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {formatTime(event.start.local)}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {event.venue?.name}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">
                                  {event.category.name}
                                </Badge>
                                <a
                                  href={event.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex"
                                >
                                  <Button size="sm">
                                    Event Details
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      {/* Insert Ad between events */}
                      {(index + 1) % 3 === 0 && index < filteredEvents.length - 1 && (
                        <div className="my-8">
                          <div className="w-full bg-slate-200 rounded-lg p-4 text-center">
                            <div className="h-32 bg-slate-300 rounded flex items-center justify-center text-slate-600">
                              Between Events Ad Zone (728x90)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredEvents.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Events Found</h3>
                    <p className="text-slate-600">
                      Try adjusting your filters to find more events.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Footer Ad Zone */}
      <footer className="bg-slate-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="h-20 bg-slate-300 rounded flex items-center justify-center text-slate-600 mb-6">
            Footer Ad Zone (728x90)
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/disclaimer" className="hover:text-blue-600">Disclaimer</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            © 2025 Events Finder. Events powered by Eventbrite.
          </p>
        </div>
      </footer>
    </div>
  );
} 