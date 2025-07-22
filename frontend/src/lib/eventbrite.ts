// Eventbrite API integration for automated event fetching
export interface EventbriteEvent {
  id: string;
  name: string;
  description: string;
  start: {
    local: string;
    timezone: string;
  };
  end: {
    local: string;
    timezone: string;
  };
  url: string;
  is_free: boolean;
  ticket_availability?: {
    minimum_ticket_price?: {
      major_value: string;
      currency: string;
    };
  };
  venue?: {
    name: string;
    address: {
      localized_address_display: string;
    };
  };
  category: {
    name: string;
  };
  logo?: {
    url: string;
  };
}

export interface EventbriteResponse {
  events: EventbriteEvent[];
  pagination: {
    page_number: number;
    page_size: number;
    page_count: number;
    object_count: number;
    has_more_items: boolean;
  };
}

// City configuration for Eventbrite API
export const CITY_CONFIG = {
  "new-york": {
    name: "New York",
    state: "NY",
    eventbriteLocationId: "108424744",
    timezone: "America/New_York",
    latitude: 40.7128,
    longitude: -74.0060
  },
  "los-angeles": {
    name: "Los Angeles",
    state: "CA",
    eventbriteLocationId: "108424745",
    timezone: "America/Los_Angeles",
    latitude: 34.0522,
    longitude: -118.2437
  },
  "chicago": {
    name: "Chicago",
    state: "IL",
    eventbriteLocationId: "108424746",
    timezone: "America/Chicago",
    latitude: 41.8781,
    longitude: -87.6298
  },
  "miami": {
    name: "Miami",
    state: "FL",
    eventbriteLocationId: "108424747",
    timezone: "America/New_York",
    latitude: 25.7617,
    longitude: -80.1918
  },
  "san-francisco": {
    name: "San Francisco",
    state: "CA",
    eventbriteLocationId: "108424748",
    timezone: "America/Los_Angeles",
    latitude: 37.7749,
    longitude: -122.4194
  },
  "austin": {
    name: "Austin",
    state: "TX",
    eventbriteLocationId: "108424749",
    timezone: "America/Chicago",
    latitude: 30.2672,
    longitude: -97.7431
  }
} as const;

export type CitySlug = keyof typeof CITY_CONFIG;

// Category mapping for Eventbrite API
export const CATEGORY_MAPPING = {
  "Business & Professional": "101",
  "Music": "103",
  "Health & Wellness": "107",
  "Arts & Culture": "105",
  "Food & Drink": "110",
  "Sports & Fitness": "108",
  "Technology": "102"
} as const;

export class EventbriteService {
  private apiKey: string;
  private baseUrl = "https://www.eventbriteapi.com/v3";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.EVENTBRITE_API_KEY || "";
  }

  /**
   * Fetch events for a specific city
   */
  async fetchCityEvents(
    citySlug: CitySlug,
    options: {
      category?: string;
      priceFilter?: "free" | "paid" | "all";
      dateFilter?: "today" | "weekend" | "week" | "all";
      query?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<EventbriteResponse> {
    try {
      const city = CITY_CONFIG[citySlug];
      if (!city) {
        throw new Error(`City ${citySlug} not found`);
      }

      // If no API key, return mock data
      if (!this.apiKey) {
        return this.getMockEvents(citySlug, options);
      }

      const params = this.buildEventbriteParams(city, options);
      const url = `${this.baseUrl}/events/search/?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Eventbrite API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformEventbriteResponse(data);

    } catch (error) {
      console.error("Error fetching Eventbrite events:", error);
      // Fallback to mock data on error
      return this.getMockEvents(citySlug, options);
    }
  }

  /**
   * Fetch worldwide events with optional location filter
   */
  async fetchWorldwideEvents(options: {
    latitude?: number;
    longitude?: number;
    radius?: string; // e.g., '50km', '100mi'
    category?: string;
    priceFilter?: "free" | "paid" | "all";
    dateFilter?: "today" | "weekend" | "week" | "all";
    query?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<EventbriteResponse> {
    try {
      if (!this.apiKey) {
        // fallback to mock events for New York if no API key
        return this.getMockEvents("new-york", options);
      }
      const params = new URLSearchParams();
      // Location filter
      if (options.latitude && options.longitude) {
        params.append("location.latitude", options.latitude.toString());
        params.append("location.longitude", options.longitude.toString());
        params.append("location.within", options.radius || "100km");
      }
      // Expand related objects
      params.append("expand", "venue,category,subcategory,format,ticket_availability");
      params.append("sort_by", "date");
      params.append("start_date.range_start", new Date().toISOString());
      // Category filter
      if (options.category && options.category !== "all") {
        const categoryId = CATEGORY_MAPPING[options.category as keyof typeof CATEGORY_MAPPING];
        if (categoryId) {
          params.append("categories", categoryId);
        }
      }
      // Search query
      if (options.query) {
        params.append("q", options.query);
      }
      // Price filter
      if (options.priceFilter === "free") {
        params.append("price", "free");
      } else if (options.priceFilter === "paid") {
        params.append("price", "paid");
      }
      // Date filter
      if (options.dateFilter === "today") {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        params.append("start_date.range_end", tomorrow.toISOString());
      } else if (options.dateFilter === "weekend") {
        const now = new Date();
        const daysUntilSaturday = (6 - now.getDay()) % 7;
        const saturday = new Date(now);
        saturday.setDate(now.getDate() + daysUntilSaturday);
        const monday = new Date(saturday);
        monday.setDate(saturday.getDate() + 2);
        params.append("start_date.range_start", saturday.toISOString());
        params.append("start_date.range_end", monday.toISOString());
      }
      // Pagination
      params.append("page", (options.page || 1).toString());
      params.append("page_size", (options.limit || 50).toString());
      const url = `${this.baseUrl}/events/search/?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Eventbrite API error: ${response.status}`);
      }
      const data = await response.json();
      return this.transformEventbriteResponse(data);
    } catch (error) {
      console.error("Error fetching worldwide Eventbrite events:", error);
      // fallback to mock events for New York
      return this.getMockEvents("new-york", options);
    }
  }

  /**
   * Build URL parameters for Eventbrite API
   */
  private buildEventbriteParams(
    city: typeof CITY_CONFIG[CitySlug],
    options: {
      category?: string;
      priceFilter?: "free" | "paid" | "all";
      dateFilter?: "today" | "weekend" | "week" | "all";
      query?: string;
      page?: number;
      limit?: number;
    }
  ): URLSearchParams {
    const params = new URLSearchParams();

    // Location - using latitude/longitude for better accuracy
    params.append("location.latitude", city.latitude.toString());
    params.append("location.longitude", city.longitude.toString());
    params.append("location.within", "25km"); // 25km radius

    // Expand related objects
    params.append("expand", "venue,category,subcategory,format,ticket_availability");

    // Sort by date
    params.append("sort_by", "date");

    // Only future events
    params.append("start_date.range_start", new Date().toISOString());

    // Category filter
    if (options.category && options.category !== "all") {
      const categoryId = CATEGORY_MAPPING[options.category as keyof typeof CATEGORY_MAPPING];
      if (categoryId) {
        params.append("categories", categoryId);
      }
    }

    // Search query
    if (options.query) {
      params.append("q", options.query);
    }

    // Price filter
    if (options.priceFilter === "free") {
      params.append("price", "free");
    } else if (options.priceFilter === "paid") {
      params.append("price", "paid");
    }

    // Date filter
    if (options.dateFilter === "today") {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      params.append("start_date.range_end", tomorrow.toISOString());
    } else if (options.dateFilter === "weekend") {
      const now = new Date();
      const daysUntilSaturday = (6 - now.getDay()) % 7;
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + daysUntilSaturday);
      const monday = new Date(saturday);
      monday.setDate(saturday.getDate() + 2);

      params.append("start_date.range_start", saturday.toISOString());
      params.append("start_date.range_end", monday.toISOString());
    }

    // Pagination
    params.append("page", (options.page || 1).toString());
    params.append("page_size", (options.limit || 50).toString());

    return params;
  }

  /**
   * Transform Eventbrite API response to our format
   */
  private transformEventbriteResponse(data: {
    events?: unknown[];
    pagination?: unknown;
  }): EventbriteResponse {
    return {
      events: (data.events as Record<string, unknown>[])?.map((event) => ({
        id: String(event.id || ""),
        name: String((event.name as { text?: string })?.text || ""),
        description: String((event.description as { text?: string })?.text || ""),
        start: {
          local: String((event.start as { local?: string })?.local || ""),
          timezone: String((event.start as { timezone?: string })?.timezone || "")
        },
        end: {
          local: String((event.end as { local?: string })?.local || ""),
          timezone: String((event.end as { timezone?: string })?.timezone || "")
        },
        url: String(event.url || ""),
        is_free: Boolean(event.is_free),
        ticket_availability: event.ticket_availability as EventbriteEvent["ticket_availability"],
        venue: event.venue ? {
          name: String((event.venue as { name?: string }).name || ""),
          address: {
            localized_address_display: String(((event.venue as { address?: { localized_address_display?: string } }).address?.localized_address_display || ""))
          }
        } : undefined,
        category: {
          name: String((event.category as { name?: string })?.name || "Other")
        },
        logo: event.logo ? {
          url: String((event.logo as { url?: string }).url || "")
        } : undefined
      })) || [],
      pagination: (data.pagination as EventbriteResponse["pagination"]) || {
        page_number: 1,
        page_size: 0,
        page_count: 1,
        object_count: 0,
        has_more_items: false
      }
    };
  }

  /**
   * Mock events for demonstration and fallback
   */
  private getMockEvents(citySlug: CitySlug, options: {
    category?: string;
    priceFilter?: "free" | "paid" | "all";
    dateFilter?: "today" | "weekend" | "week" | "all";
    query?: string;
    page?: number;
    limit?: number;
  }): EventbriteResponse {
    const mockEvents: EventbriteEvent[] = [
      {
        id: "1",
        name: "Tech Startup Networking Night",
        description: "Connect with fellow entrepreneurs and investors in the tech space. This event features keynote speakers, networking sessions, and startup pitches.",
        start: { local: "2025-01-25T19:00:00", timezone: "America/New_York" },
        end: { local: "2025-01-25T22:00:00", timezone: "America/New_York" },
        url: "https://www.eventbrite.com/e/tech-startup-networking-example",
        is_free: false,
        ticket_availability: { minimum_ticket_price: { major_value: "25", currency: "USD" } },
        venue: { name: "WeWork Downtown", address: { localized_address_display: "123 Main St, Downtown" } },
        category: { name: "Business & Professional" },
        logo: { url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=300&h=200&fit=crop" }
      },
      {
        id: "2",
        name: "Jazz Live at Blue Note",
        description: "An evening of smooth jazz featuring local and touring musicians. Experience the best of contemporary and classic jazz.",
        start: { local: "2025-01-26T20:00:00", timezone: "America/New_York" },
        end: { local: "2025-01-26T23:00:00", timezone: "America/New_York" },
        url: "https://www.eventbrite.com/e/jazz-live-example",
        is_free: false,
        ticket_availability: { minimum_ticket_price: { major_value: "45", currency: "USD" } },
        venue: { name: "Blue Note Jazz Club", address: { localized_address_display: "456 Music Ave, Midtown" } },
        category: { name: "Music" },
        logo: { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop" }
      },
      {
        id: "3",
        name: "Free Yoga in the Park",
        description: "Join us for a relaxing morning yoga session in the heart of the city. All skill levels welcome. Bring your own mat.",
        start: { local: "2025-01-27T08:00:00", timezone: "America/New_York" },
        end: { local: "2025-01-27T09:30:00", timezone: "America/New_York" },
        url: "https://www.eventbrite.com/e/free-yoga-park-example",
        is_free: true,
        venue: { name: "Central Park", address: { localized_address_display: "Central Park, 59th St" } },
        category: { name: "Health & Wellness" },
        logo: { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop" }
      }
    ];

    // Apply filters
    let filteredEvents = [...mockEvents];

    if (options.category && options.category !== "all") {
      filteredEvents = filteredEvents.filter(event => event.category.name === options.category);
    }

    if (options.priceFilter === "free") {
      filteredEvents = filteredEvents.filter(event => event.is_free);
    } else if (options.priceFilter === "paid") {
      filteredEvents = filteredEvents.filter(event => !event.is_free);
    }

    if (options.query) {
      const query = options.query.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
      );
    }

    return {
      events: filteredEvents,
      pagination: {
        page_number: 1,
        page_size: filteredEvents.length,
        page_count: 1,
        object_count: filteredEvents.length,
        has_more_items: false
      }
    };
  }
}

// Singleton instance
export const eventbriteService = new EventbriteService();
