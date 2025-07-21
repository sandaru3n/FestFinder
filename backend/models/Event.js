const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  start: { local: String, timezone: String },
  end: { local: String, timezone: String },
  url: String,
  is_free: Boolean,
  ticket_availability: {
    minimum_ticket_price: {
      major_value: String,
      currency: String
    }
  },
  venue: {
    name: String,
    address: {
      localized_address_display: String
    }
  },
  category: {
    name: String
  },
  logo: {
    url: String
  }
});

module.exports = mongoose.model('Event', EventSchema); 