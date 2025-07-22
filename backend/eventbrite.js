const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const CATEGORY_MAPPING = {
  "Business & Professional": "101",
  "Music": "103",
  "Health & Wellness": "107",
  "Arts & Culture": "105",
  "Food & Drink": "110",
  "Sports & Fitness": "108",
  "Technology": "102"
};

class EventbriteService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://www.eventbriteapi.com/v3";
  }

  async fetchWorldwideEvents(options = {}) {
    try {
      if (!this.apiKey) {
        return { events: [], pagination: {} };
      }
      const params = new URLSearchParams();
      if (options.latitude && options.longitude) {
        params.append("location.latitude", options.latitude.toString());
        params.append("location.longitude", options.longitude.toString());
        params.append("location.within", options.radius || "100km");
      }
      params.append("expand", "venue,category,subcategory,format,ticket_availability");
      params.append("sort_by", "date");
      params.append("start_date.range_start", new Date().toISOString());
      if (options.category && options.category !== "all") {
        const categoryId = CATEGORY_MAPPING[options.category];
        if (categoryId) {
          params.append("categories", categoryId);
        }
      }
      if (options.query) {
        params.append("q", options.query);
      }
      if (options.priceFilter === "free") {
        params.append("price", "free");
      } else if (options.priceFilter === "paid") {
        params.append("price", "paid");
      }
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
      return {
        events: (data.events || []).map(event => ({
          id: String(event.id || ""),
          name: event.name?.text || "",
          description: event.description?.text || "",
          start: event.start || {},
          end: event.end || {},
          url: event.url || "",
          is_free: !!event.is_free,
          ticket_availability: event.ticket_availability,
          venue: event.venue ? {
            name: event.venue.name || "",
            address: {
              localized_address_display: event.venue.address?.localized_address_display || ""
            }
          } : undefined,
          category: {
            name: event.category?.name || "Other"
          },
          logo: event.logo ? { url: event.logo.url || "" } : undefined
        })),
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error("Error fetching worldwide Eventbrite events:", error);
      return { events: [], pagination: {} };
    }
  }
}

module.exports = { EventbriteService }; 