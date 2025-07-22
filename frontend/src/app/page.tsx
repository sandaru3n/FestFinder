"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Search, TrendingUp, Star } from "lucide-react";

const majorCities = [
  {
    name: "New York",
    slug: "new-york",
    state: "NY",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop",
    eventCount: "2,500+",
    popular: ["Concerts", "Business", "Arts"]
  },
  {
    name: "Los Angeles",
    slug: "los-angeles",
    state: "CA",
    image: "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=250&fit=crop",
    eventCount: "1,800+",
    popular: ["Entertainment", "Tech", "Food"]
  },
  {
    name: "Chicago",
    slug: "chicago",
    state: "IL",
    image: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=400&h=250&fit=crop",
    eventCount: "1,200+",
    popular: ["Music", "Sports", "Culture"]
  },
  {
    name: "Miami",
    slug: "miami",
    state: "FL",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    eventCount: "900+",
    popular: ["Nightlife", "Beach", "Art"]
  },
  {
    name: "San Francisco",
    slug: "san-francisco",
    state: "CA",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
    eventCount: "1,100+",
    popular: ["Tech", "Startup", "Innovation"]
  },
  {
    name: "Austin",
    slug: "austin",
    state: "TX",
    image: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&h=250&fit=crop",
    eventCount: "800+",
    popular: ["Music", "SXSW", "Food"]
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    // Auto-detect user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setUserLocation("Detected location");
        },
        () => {
          // Fallback if location access denied
          setUserLocation(null);
        }
      );
    }
  }, []);

  const filteredCities = majorCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Discover Amazing Events
            <span className="text-blue-600"> Near You</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Find concerts, workshops, networking events, and more happening in major cities across the country.
            Updated in real-time from Eventbrite.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">15,000+</div>
              <div className="text-slate-600">Active Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-slate-600">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-slate-600">Auto Updates</div>
            </div>
          </div>
        </div>

        {/* Auto-Location Section */}
        {userLocation && (
          <div className="mb-8 text-center">
            <Badge variant="outline" className="text-sm py-2 px-4">
              <MapPin className="w-4 h-4 mr-2" />
              Location detected - showing nearby cities
            </Badge>
          </div>
        )}

        {/* City Selection Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCities.map((city) => (
            <Link key={city.slug} href={`/city/${city.slug}`}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-300">
                <div className="relative">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600 text-white">
                      {city.eventCount} events
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{city.name}, {city.state}</span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </CardTitle>
                  <CardDescription>
                    Popular categories in {city.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {city.popular.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Events
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Sidebar Ad Zone */}
        <div className="lg:absolute lg:right-4 lg:top-1/2 lg:transform lg:-translate-y-1/2 mb-8 lg:mb-0">
          <div className="w-full lg:w-80 bg-slate-200 rounded-lg p-4 text-center">
            <div className="h-64 bg-slate-300 rounded flex items-center justify-center text-slate-600">
              Sidebar Ad Zone (300x250)
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-slate-600">
              Events are automatically updated every hour from Eventbrite to ensure you never miss out.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
            <p className="text-slate-600">
              Find events near you with smart location detection and distance filtering.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">All Categories</h3>
            <p className="text-slate-600">
              From concerts to workshops, find events that match your interests and schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Between Content Ad Zone */}
      <div className="container mx-auto px-4 mb-12">
        <div className="w-full bg-slate-200 rounded-lg p-6 text-center">
          <div className="h-32 bg-slate-300 rounded flex items-center justify-center text-slate-600">
            Between Content Ad Zone (728x90 or Native)
          </div>
        </div>
      </div>

      {/* Footer Ad Zone */}
      <footer className="bg-slate-200 py-8">
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
            © 2025 Events Finder. Powered by Eventbrite API.
          </p>
        </div>
      </footer>
    </div>
  );
}
