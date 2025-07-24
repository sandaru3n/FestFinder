import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">About Events Finder</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Your Gateway to Amazing Events
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We help you discover the best events happening in major cities across the country,
              all automatically updated from real-time.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Events are automatically synced every hour from real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">50+ Cities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Coverage across major metropolitan areas in the United States.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">All Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  From business networking to concerts, find events that match your interests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Zap className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Smart Filtering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  Advanced filters for date, price, category, and location to find exactly what you want.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mission Statement */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Events Finder was created to solve a simple problem: finding great events in your city
                shouldn't be complicated. We aggregate events from real-time and present them in a
                clean, easy-to-use interface that helps you discover what's happening around you.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Choose Your City</h3>
                  <p className="text-slate-600">
                    Select from 50+ major cities across the United States.
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Filter & Search</h3>
                  <p className="text-slate-600">
                    Use our advanced filters to find events that match your interests.
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Attend & Enjoy</h3>
                  <p className="text-slate-600">
                    Click through to get your tickets and attend the event.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-6">
                Have questions, suggestions, or want to report an issue? We'd love to hear from you.
              </p>
              <div className="space-y-2 text-slate-600">
                <p>Email: contact@eventsfinder.com</p>
                <p>Response time: Within 24 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Ad Zone */}
      <footer className="bg-slate-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="h-20 bg-slate-300 rounded flex items-center justify-center text-slate-600 mb-6">
            Footer Ad Zone (728x90)
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/disclaimer" className="hover:text-blue-600">Disclaimer</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            © 2025 Events Finder. Powered by real-time.
          </p>
        </div>
      </footer>
    </div>
  );
}
