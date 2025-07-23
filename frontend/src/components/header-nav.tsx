"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Search, MapPin, Calendar, User, Menu, ChevronDown } from "lucide-react";
import { UserDropdown } from "@/components/ui/user-dropdown";

const cities = [
  { name: "New York, NY", slug: "new-york" },
  { name: "Los Angeles, CA", slug: "los-angeles" },
  { name: "Chicago, IL", slug: "chicago" },
  { name: "Miami, FL", slug: "miami" },
  { name: "San Francisco, CA", slug: "san-francisco" },
  { name: "Austin, TX", slug: "austin" }
];

const categories = [
  "Business & Professional",
  "Music",
  "Health & Wellness",
  "Arts & Culture",
  "Food & Drink",
  "Sports & Fitness"
];

export function HeaderNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("United States");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // List of countries for manual selection
  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "India", "Brazil", "Japan", "South Africa", "Sri Lanka"
  ];

  // Handle manual country selection
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
  };

  // Detect user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use Nominatim API to reverse geocode coordinates to country
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&zoom=3`)
            .then(res => res.json())
            .then(data => {
              const country = data.address?.country || "United States"; // Fallback to United States if country not found
              setSelectedLocation(country);
            })
            .catch(() => {
              console.error("Failed to fetch country from Nominatim API");
              setSelectedLocation("United States"); // Fallback on API error
            });
        },
        () => {
          // Fallback if location access denied
          console.log("Location access denied");
          setSelectedLocation("United States");
        }
      );
    } else {
      console.log("Geolocation not supported");
      setSelectedLocation("United States");
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would search across all cities
      router.push(`/city/new-york?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">FestFinder</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </form>

          {/* Location Selector - Desktop */}
          <div className="hidden md:block">
            <select 
              className="rounded-md border p-2 text-sm bg-white text-slate-900 border-slate-300 h-10 px-3"
              value={selectedLocation}
              onChange={handleLocationChange}
              aria-label="Select your location"
            >
              {countries.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ml-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/all-events" className="text-slate-700 hover:text-orange-600 text-base font-medium">
                    All Events
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {/* Remove the old Browse Events trigger/menu */}
                {/* ...other nav items... */}
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/" className="text-slate-700 hover:text-orange-600 text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-orange-600 text-sm font-medium">
              About
            </Link>

            <Badge variant="outline" className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border-orange-200">
              Free to Use
            </Badge>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-3 ml-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            ) : (
              <UserDropdown />
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </form>

            {/* Mobile Location Selector */}
            <div className="mb-4">
              <select 
                className="rounded-md border p-2 text-sm bg-white text-slate-900 border-slate-300 w-full"
                value={selectedLocation}
                onChange={handleLocationChange}
                aria-label="Select your location"
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Cities */}
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900 mb-2">Cities</h3>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/city/${city.slug}`}
                    className="block p-2 text-sm text-slate-600 hover:bg-slate-50 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Links */}
            <Link
              href="/"
              className="block text-slate-700 hover:text-orange-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-slate-700 hover:text-orange-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/all-events"
              className="block text-slate-700 hover:text-orange-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Events
            </Link>
            <div className="flex space-x-3 pt-2">
              {!isLoggedIn ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      router.push('/login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Log In
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      router.push('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <UserDropdown />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
