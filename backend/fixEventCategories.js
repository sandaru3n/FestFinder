const mongoose = require('mongoose');
const Event = require('./models/Event');

const allowedCategories = [
  "Business & Professional",
  "Music",
  "Health & Wellness",
  "Arts & Culture",
  "Food & Drink"
];

function mapToCategory(oldValue) {
  const lower = oldValue.toLowerCase();
  if (lower.includes('music')) return "Music";
  if (lower.includes('business')) return "Business & Professional";
  if (lower.includes('health')) return "Health & Wellness";
  if (lower.includes('art')) return "Arts & Culture";
  if (lower.includes('food')) return "Food & Drink";
  // fallback
  return "Business & Professional";
}

async function fixCategories() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/festfinder');

  const events = await Event.find();
  for (const event of events) {
    if (event.category && event.category.name && event.category.name.includes(',')) {
      // Move old value to tags
      event.tags = event.category.name;
      // Set category to mapped value
      event.category.name = mapToCategory(event.category.name);
      await event.save();
      console.log(`Updated event ${event._id}: category set to ${event.category.name}, tags set to ${event.tags}`);
    }
  }
  mongoose.disconnect();
}

fixCategories(); 