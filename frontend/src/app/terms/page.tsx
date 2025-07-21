import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Terms of Service Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Welcome to Events Finder. These Terms of Service ("Terms") govern your use of our
                website and services. By accessing or using Events Finder, you agree to be bound
                by these Terms. If you do not agree to these Terms, please do not use our service.
              </p>
              <p className="text-slate-600 mt-4">
                <strong>Effective Date:</strong> January 21, 2025
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle>1. Service Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Events Finder is a web-based service that aggregates and displays event information
                  from Eventbrite and other third-party sources. Our service allows users to:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Browse events by location and category</li>
                  <li>Search for specific events or event types</li>
                  <li>Filter events by various criteria</li>
                  <li>Access links to event organizer pages for ticket purchases</li>
                </ul>
                <p className="text-slate-600">
                  We do not organize, host, or sell tickets for any events listed on our platform.
                </p>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card>
              <CardHeader>
                <CardTitle>2. Acceptable Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  When using Events Finder, you agree to:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Use the service only for lawful purposes</li>
                  <li>Not attempt to circumvent any security measures</li>
                  <li>Not use automated tools to scrape or extract data</li>
                  <li>Not interfere with the proper functioning of the website</li>
                  <li>Not violate any applicable laws or regulations</li>
                </ul>
                <p className="text-slate-600">
                  You may not use our service to:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Distribute malware or harmful content</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Violate intellectual property rights</li>
                  <li>Harass or harm other users</li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>3. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  The Events Finder website design, functionality, and original content are owned
                  by us and protected by copyright and other intellectual property laws.
                </p>
                <p className="text-slate-600">
                  Event information, images, and descriptions are owned by their respective event
                  organizers and are used in accordance with fair use principles for informational purposes.
                </p>
                <p className="text-slate-600">
                  You may not reproduce, distribute, or create derivative works from our website
                  content without express written permission.
                </p>
              </CardContent>
            </Card>

            {/* Third-Party Links */}
            <Card>
              <CardHeader>
                <CardTitle>4. Third-Party Links and Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Our website contains links to third-party websites and services, including
                  Eventbrite and event organizer websites. These links are provided for your
                  convenience only.
                </p>
                <p className="text-slate-600">
                  We do not endorse, control, or assume responsibility for the content, privacy
                  policies, or practices of any third-party websites or services. Your use of
                  third-party websites is at your own risk and subject to their terms of service.
                </p>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>5. Privacy and Data Collection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  We collect minimal personal information and use cookies and analytics to improve
                  our service. Our data collection practices include:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Website usage analytics</li>
                  <li>Location data (if permitted) for location-based features</li>
                  <li>Cookies for website functionality and advertising</li>
                </ul>
                <p className="text-slate-600">
                  We do not sell personal information to third parties. We may share aggregated,
                  non-personal information for analytical purposes.
                </p>
              </CardContent>
            </Card>

            {/* Advertising */}
            <Card>
              <CardHeader>
                <CardTitle>6. Advertising</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Events Finder displays advertisements from third-party ad networks to support
                  our free service. By using our website, you acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Advertisements are clearly distinguished from our content</li>
                  <li>We are not responsible for advertiser content or claims</li>
                  <li>Your interactions with advertisers are solely between you and them</li>
                  <li>Ad networks may use cookies to serve relevant advertisements</li>
                </ul>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle>7. Disclaimers and Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Events Finder is provided "as is" without warranties of any kind. We disclaim
                  all warranties, express or implied, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Accuracy of event information</li>
                  <li>Availability of our service</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement of third-party rights</li>
                </ul>
                <p className="text-slate-600">
                  Our liability for any claims related to your use of Events Finder is limited
                  to the maximum extent permitted by law.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  We reserve the right to terminate or suspend access to our service at any time,
                  without notice, for any reason, including violation of these Terms.
                </p>
                <p className="text-slate-600">
                  You may stop using our service at any time. Upon termination, your right to
                  use the service will cease immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>9. Changes to These Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  We may update these Terms from time to time. When we make changes, we will
                  update the "Effective Date" at the top of this page.
                </p>
                <p className="text-slate-600">
                  Your continued use of Events Finder after any changes constitute acceptance
                  of the new Terms. We encourage you to review these Terms periodically.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>10. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  These Terms are governed by and construed in accordance with the laws of the
                  United States. Any disputes arising from these Terms or your use of Events Finder
                  will be resolved in the appropriate courts.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>11. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-slate-600 mt-4">
                  Email: legal@eventsfinder.com<br />
                  Subject: Terms of Service Inquiry
                </p>
                <p className="text-slate-600 text-sm mt-6">
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
            <Link href="/disclaimer" className="hover:text-blue-600">Disclaimer</Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            © 2025 Events Finder. Powered by Eventbrite API.
          </p>
        </div>
      </footer>
    </div>
  );
}
