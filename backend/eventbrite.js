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
  constructor(apiKey, privateToken = null) {
    this.apiKey = apiKey;
    this.privateToken = privateToken || apiKey; // Use private token if provided, else fallback to apiKey
    this.oauthToken = null; // Store OAuth token when retrieved
    this.baseUrl = 'https://www.eventbriteapi.com/v3'; // Ensure correct base URL
    console.log(`EventbriteService initialized with API key: ${apiKey ? 'Key provided (hidden)' : 'No key provided'} and Private Token: ${privateToken ? 'Token provided (hidden)' : 'No token provided'}`);
  }

  // Method to set OAuth token after retrieval
  setOAuthToken(token) {
    this.oauthToken = token;
    console.log(`OAuth token set for EventbriteService: ${token ? 'Token provided (hidden)' : 'No token provided'}`);
  }

  // Get the most appropriate token for API requests
  getAuthToken() {
    return this.oauthToken || this.privateToken;
  }

  async fetchWorldwideEvents({
    latitude,
    longitude,
    radius = '50km',
    category = '',
    priceFilter = '',
    dateFilter = '',
    query = '',
    page = 1,
    limit = 12
  }) {
    try {
      const token = this.getAuthToken();
      if (!token && !this.apiKey) {
        console.error('No API key, private token, or OAuth token provided for Eventbrite service.');
        return { events: [], pagination: { page_count: 1, page_number: 1 }, message: 'API key or token missing. Please configure Eventbrite credentials.' };
      }
      let url = `${this.baseUrl}/events/search?page=${page}&page_size=${limit}`;
      let isLocationSearch = false;
      if (latitude && longitude) {
        url += `&location.latitude=${latitude}&location.longitude=${longitude}&location.within=${radius}`;
        isLocationSearch = true;
      }
      if (category) {
        url += `&categories=${category}`;
      }
      if (priceFilter === 'free') {
        url += `&price=free`;
      }
      if (dateFilter) {
        if (dateFilter === 'today') {
          url += `&start_date.keyword=today`;
        } else if (dateFilter === 'tomorrow') {
          url += `&start_date.keyword=tomorrow`;
        } else if (dateFilter === 'this_week') {
          url += `&start_date.keyword=this_week`;
        } else if (dateFilter === 'next_week') {
          url += `&start_date.keyword=next_week`;
        } else if (dateFilter === 'this_month') {
          url += `&start_date.keyword=this_month`;
        }
      }
      if (query) {
        url += `&q=${encodeURIComponent(query)}`;
      }
      // Ensure the search is expanded to include venue and category details
      url += `&expand=venue,category`;

      console.log(`Fetching events from Eventbrite with URL: ${url}`);
      console.log(`Using token type: ${this.oauthToken ? 'OAuth Token' : this.privateToken !== this.apiKey ? 'Private Token' : 'API Key'}`);
      let headers = {
        'Content-Type': 'application/json'
      };
      let response;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Attempting request with Bearer token...');
        response = await fetch(url, { headers });
        if (!response.ok && (response.status === 401 || response.status === 403)) {
          console.error(`Bearer token authentication failed with status ${response.status}. Falling back to API key as query parameter...`);
          if (this.apiKey) {
            url += `&token=${this.apiKey}`;
            headers = { 'Content-Type': 'application/json' }; // Remove Authorization header
            console.log(`Retrying with API key in query parameter: ${url.replace(this.apiKey, '***HIDDEN***')}`);
            response = await fetch(url, { headers });
          }
        }
      } else if (this.apiKey) {
        url += `&token=${this.apiKey}`;
        console.log(`Using API key in query parameter: ${url.replace(this.apiKey, '***HIDDEN***')}`);
        response = await fetch(url, { headers });
      } else {
        throw new Error('No authentication method available');
      }

      if (!response.ok) {
        if (response.status === 404 && isLocationSearch) {
          console.error('Eventbrite API returned 404 - No events or location found with the given parameters. Retrying without location...');
          // Retry without location parameters
          let fallbackUrl = `${this.baseUrl}/events/search?page=${page}&page_size=${limit}`;
          if (category) {
            fallbackUrl += `&categories=${category}`;
          }
          if (priceFilter === 'free') {
            fallbackUrl += `&price=free`;
          }
          if (dateFilter) {
            if (dateFilter === 'today') {
              fallbackUrl += `&start_date.keyword=today`;
            } else if (dateFilter === 'tomorrow') {
              fallbackUrl += `&start_date.keyword=tomorrow`;
            } else if (dateFilter === 'this_week') {
              fallbackUrl += `&start_date.keyword=this_week`;
            } else if (dateFilter === 'next_week') {
              fallbackUrl += `&start_date.keyword=next_week`;
            } else if (dateFilter === 'this_month') {
              fallbackUrl += `&start_date.keyword=this_month`;
            }
          }
          if (query) {
            fallbackUrl += `&q=${encodeURIComponent(query)}`;
          }
          fallbackUrl += `&expand=venue,category`;
          console.log(`Retrying with fallback URL: ${fallbackUrl}`);
          let fallbackResponse;
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('Attempting fallback request with Bearer token...');
            fallbackResponse = await fetch(fallbackUrl, { headers });
            if (!fallbackResponse.ok && (fallbackResponse.status === 401 || fallbackResponse.status === 403) && this.apiKey) {
              console.error(`Bearer token authentication failed for fallback with status ${fallbackResponse.status}. Falling back to API key as query parameter...`);
              fallbackUrl += `&token=${this.apiKey}`;
              headers = { 'Content-Type': 'application/json' }; // Remove Authorization header
              console.log(`Retrying fallback with API key in query parameter: ${fallbackUrl.replace(this.apiKey, '***HIDDEN***')}`);
              fallbackResponse = await fetch(fallbackUrl, { headers });
            }
          } else if (this.apiKey) {
            fallbackUrl += `&token=${this.apiKey}`;
            console.log(`Using API key in query parameter for fallback: ${fallbackUrl.replace(this.apiKey, '***HIDDEN***')}`);
            fallbackResponse = await fetch(fallbackUrl, { headers });
          } else {
            throw new Error('No authentication method available for fallback request');
          }

          if (!fallbackResponse.ok) {
            if (fallbackResponse.status === 404) {
              console.error('Eventbrite API returned 404 on fallback search - No events found even without location.');
              return { events: [], pagination: { page_count: 1, page_number: 1 }, message: 'No events found near your location or globally with the given filters.' };
            }
            throw new Error(`Eventbrite API error on fallback search: ${fallbackResponse.status}`);
          }
          const fallbackData = await fallbackResponse.json();
          console.log(`Received ${fallbackData.events?.length || 0} events from Eventbrite on fallback search.`);
          return { ...fallbackData, message: 'No events found near your location. Showing results from a broader search.' };
        } else if (response.status === 404) {
          console.error('Eventbrite API returned 404 - No events or location found with the given parameters.');
          console.error(`Full response details: Status ${response.status}, URL: ${url}`);
          return { events: [], pagination: { page_count: 1, page_number: 1 }, message: 'No events found with the given filters. The API path may be incorrect.' };
        } else if (response.status === 401 || response.status === 403) {
          console.error('Eventbrite API authentication error:', response.status);
          console.error(`Authentication attempted with: ${this.oauthToken ? 'OAuth Token' : this.privateToken !== this.apiKey ? 'Private Token' : 'API Key'}`);
          return { events: [], pagination: { page_count: 1, page_number: 1 }, message: 'Authentication error with Eventbrite API. Please check API credentials.' };
        }
        throw new Error(`Eventbrite API error: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Received ${data.events?.length || 0} events from Eventbrite.`);
      return data;
    } catch (error) {
      console.error(`Error fetching worldwide Eventbrite events:`, error);
      // Fallback to empty results instead of mock data to avoid confusion
      return { events: [], pagination: { page_count: 1, page_number: 1 }, message: 'Error fetching events. Please try again later.' };
    }
  }

  async fetchUserOrganizations() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        console.error('No API key, private token, or OAuth token provided for Eventbrite service.');
        return { organizations: [], message: 'API key or token missing. Please configure Eventbrite credentials.' };
      }
      const url = `${this.baseUrl}/users/me/organizations/`;
      console.log(`Fetching user organizations from Eventbrite with URL: ${url}`);
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await fetch(url, { headers });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error('Eventbrite API authentication error for organizations:', response.status);
          return { organizations: [], message: 'Authentication error fetching organizations. Please check API credentials.' };
        }
        throw new Error(`Eventbrite API error fetching organizations: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Received ${data.organizations?.length || 0} organizations from Eventbrite.`);
      return data;
    } catch (error) {
      console.error(`Error fetching user organizations from Eventbrite:`, error);
      return { organizations: [], message: 'Error fetching organizations. Please try again later.' };
    }
  }
}

module.exports = { EventbriteService }; 