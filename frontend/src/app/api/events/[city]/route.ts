import { NextRequest, NextResponse } from "next/server";

// City to Eventbrite location mapping
const cityLocationMap: Record<string, string> = {
  "new-york": "108424744",
  "los-angeles": "108424745",
  "chicago": "108424746",
  "miami": "108424747",
  "san-francisco": "108424748",
  "austin": "108424749"
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const resolvedParams = await params;
    const citySlug = resolvedParams.city;
    const locationId = cityLocationMap[citySlug];

    if (!locationId) {
      return NextResponse.json(
        { error: "City not found" },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "";
    const priceFilter = searchParams.get("price") || "";
    const dateFilter = searchParams.get("date") || "";
    const query = searchParams.get("q") || "";

    // Mock data for demonstration
    const mockEvents = [
      {
        id: "1",
        name: "Tech Startup Networking Night",
        description: "Connect with fellow entrepreneurs and investors in the tech space. This event features keynote speakers, networking sessions, and startup pitches.",
        start: { local: "2025-01-25T19:00:00" },
        end: { local: "2025-01-25T22:00:00" },
        url: "https://www.eventbrite.com/e/tech-startup-networking-example",
        is_free: false,
        ticket_availability: {
          minimum_ticket_price: {
            major_value: "25",
            currency: "USD"
          }
        },
        venue: {
          name: "WeWork Downtown",
          address: {
            localized_address_display: "123 Main St, Downtown"
          }
        },
        category: { name: "Business & Professional" },
        logo: {
          url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=300&h=200&fit=crop"
        }
      },
      {
        id: "2",
        name: "Jazz Live at Blue Note",
        description: "An evening of smooth jazz featuring local and touring musicians. Experience the best of contemporary and classic jazz.",
        start: { local: "2025-01-26T20:00:00" },
        end: { local: "2025-01-26T23:00:00" },
        url: "https://www.eventbrite.com/e/jazz-live-example",
        is_free: false,
        ticket_availability: {
          minimum_ticket_price: {
            major_value: "45",
            currency: "USD"
          }
        },
        venue: {
          name: "Blue Note Jazz Club",
          address: {
            localized_address_display: "456 Music Ave, Midtown"
          }
        },
        category: { name: "Music" },
        logo: {
          url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop"
        }
      },
      {
        id: "3",
        name: "Free Yoga in the Park",
        description: "Join us for a relaxing morning yoga session in the heart of the city. All skill levels welcome. Bring your own mat.",
        start: { local: "2025-01-27T08:00:00" },
        end: { local: "2025-01-27T09:30:00" },
        url: "https://www.eventbrite.com/e/free-yoga-park-example",
        is_free: true,
        venue: {
          name: "Central Park",
          address: {
            localized_address_display: "Central Park, 59th St"
          }
        },
        category: { name: "Health & Wellness" },
        logo: {
          url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop"
        }
      },
      {
        id: "4",
        name: "Art Gallery Opening Night",
        description: "Celebrate the opening of our new contemporary art exhibition featuring local artists and their latest works.",
        start: { local: "2025-01-28T18:00:00" },
        end: { local: "2025-01-28T21:00:00" },
        url: "https://www.eventbrite.com/e/art-gallery-opening-example",
        is_free: true,
        venue: {
          name: "Modern Art Gallery",
          address: {
            localized_address_display: "789 Art District, Downtown"
          }
        },
        category: { name: "Arts & Culture" },
        logo: {
          url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=200&fit=crop"
        }
      },
      {
        id: "5",
        name: "Food Truck Festival",
        description: "Taste the best street food from around the city! Over 20 food trucks serving everything from tacos to ice cream.",
        start: { local: "2025-01-29T11:00:00" },
        end: { local: "2025-01-29T20:00:00" },
        url: "https://www.eventbrite.com/e/food-truck-festival-example",
        is_free: true,
        venue: {
          name: "City Plaza",
          address: {
            localized_address_display: "City Plaza, Main Street"
          }
        },
        category: { name: "Food & Drink" },
        logo: {
          url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop"
        }
      }
    ];

    // Apply filters to mock data
    let filteredEvents = [...mockEvents];

    if (category && category !== "all") {
      filteredEvents = filteredEvents.filter(event =>
        event.category.name === category
      );
    }

    if (priceFilter === "free") {
      filteredEvents = filteredEvents.filter(event => event.is_free);
    } else if (priceFilter === "paid") {
      filteredEvents = filteredEvents.filter(event => !event.is_free);
    }

    if (query) {
      filteredEvents = filteredEvents.filter(event =>
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    return NextResponse.json({
      events: filteredEvents,
      pagination: {
        page_number: 1,
        page_size: filteredEvents.length,
        page_count: 1,
        object_count: filteredEvents.length,
        has_more_items: false
      }
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
