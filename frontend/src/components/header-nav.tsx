"use client";

import { useState } from "react";
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
  const router = useRouter();

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
            <span className="text-xl font-bold text-slate-900">EventsFinder</span>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 px-3 border-slate-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedLocation}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city.slug}
                    onClick={() => {
                      setSelectedLocation(city.name);
                      router.push(`/city/${city.slug}`);
                    }}
                  >
                    {city.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ml-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-slate-700 hover:text-orange-600">
                    Browse Events
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-96 p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-3">By City</h3>
                          <div className="space-y-2">
                            {cities.slice(0, 3).map((city) => (
                              <Link
                                key={city.slug}
                                href={`/city/${city.slug}`}
                                className="block text-sm text-slate-600 hover:text-orange-600"
                              >
                                {city.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-3">By Category</h3>
                          <div className="space-y-2">
                            {categories.slice(0, 3).map((category) => (
                              <Link
                                key={category}
                                href={`/city/new-york?category=${encodeURIComponent(category)}`}
                                className="block text-sm text-slate-600 hover:text-orange-600"
                              >
                                {category}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
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
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-300"
              onClick={() => router.push('/login')}
            >
              Log In
            </Button>
            <Button 
              size="sm" 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </Button>
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
            <div className="flex space-x-3 pt-2">
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
