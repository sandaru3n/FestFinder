import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Disclaimer</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Important Notice */}
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700">
                Please read this disclaimer carefully before using Events Finder.
                By using our website, you agree to the terms outlined below.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Event Information */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Events Finder aggregates event information from Eventbrite and other third-party sources.
                  While we strive to provide accurate and up-to-date information, we cannot guarantee
                  the accuracy, completeness, or reliability of all event details.
                </p>
                <p className="text-slate-600">
                  Event details including dates, times, locations, prices, and availability are subject
                  to change by event organizers. We recommend verifying all event information directly
                  with the event organizer or on the official Eventbrite page before making any commitments.
                </p>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Events Finder serves as an aggregator and directory service. We do not organize,
                  host, or manage any of the events listed on our platform. All events are organized
                  by independent third parties.
                </p>
                <p className="text-slate-600">
                  When you click through to purchase tickets or get more information about an event,
                  you will be redirected to Eventbrite or the event organizer's website. Your
                  interactions with these third-party services are governed by their respective
                  terms of service and privacy policies.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Events Finder and its operators shall not be liable for any direct, indirect,
                  incidental, special, or consequential damages arising from:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Use of information provided on our website</li>
                  <li>Event cancellations, postponements, or changes</li>
                  <li>Issues with ticket purchases or refunds</li>
                  <li>Problems attending events</li>
                  <li>Technical issues or website downtime</li>
                </ul>
              </CardContent>
            </Card>

            {/* Advertising */}
            <Card>
              <CardHeader>
                <CardTitle>Advertising and Monetization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Events Finder displays advertisements from third-party ad networks to support
                  our free service. These advertisements are clearly marked and separate from
                  our event content.
                </p>
                <p className="text-slate-600">
                  We are not responsible for the content of third-party advertisements or any
                  products or services advertised. Your interactions with advertisers are solely
                  between you and the advertiser.
                </p>
              </CardContent>
            </Card>

            {/* No Warranties */}
            <Card>
              <CardHeader>
                <CardTitle>No Warranties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Events Finder is provided on an "as is" and "as available" basis. We make no
                  warranties, express or implied, regarding:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>The accuracy or completeness of event information</li>
                  <li>The availability or functionality of our website</li>
                  <li>The quality or success of any events listed</li>
                  <li>Your satisfaction with events you attend</li>
                </ul>
              </CardContent>
            </Card>

            {/* Changes to Events */}
            <Card>
              <CardHeader>
                <CardTitle>Event Changes and Cancellations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Event organizers may change or cancel events at any time. While we attempt to
                  update our listings regularly, there may be delays in reflecting these changes
                  on our website.
                </p>
                <p className="text-slate-600">
                  Always confirm event details directly with the organizer before attending.
                  For refunds or other issues related to ticket purchases, contact the event
                  organizer or Eventbrite directly.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Questions About This Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  If you have any questions about this disclaimer or our services, please contact us at:
                </p>
                <p className="text-slate-600 mt-4">
                  Email: legal@eventsfinder.com
                </p>
                <p className="text-slate-600 text-sm mt-4">
                  Last updated: January 21, 2025
                </p>
              </CardContent>
            </Card>
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
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/about" className="hover:text-blue-600">About</Link>
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
