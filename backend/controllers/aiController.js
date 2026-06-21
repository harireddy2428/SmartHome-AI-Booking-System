const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

/**
 * AI Recommendation Score Formula:
 * score = (ratingScore * 0.35) + (locationScore * 0.25) + (categoryScore * 0.20) + (historyScore * 0.15) + (availabilityScore * 0.05)
 */
const computeScore = (worker, userCity, category, bookedWorkerIds) => {
  const ratingScore = (worker.rating / 5) * 35;

  const locationScore = worker.city?.toLowerCase() === userCity?.toLowerCase() ? 25 : 0;

  const categoryScore = worker.category?.toLowerCase() === category?.toLowerCase() ? 20 : 0;

  const historyScore = bookedWorkerIds.includes(worker._id.toString()) ? 15 : 0;

  const availabilityScore = worker.availability ? 5 : 0;

  return ratingScore + locationScore + categoryScore + historyScore + availabilityScore;
};

const getRecommendations = async (req, res) => {
  try {
    const { category, city } = req.query;
    const userId = req.user._id;

    const pastBookings = await Booking.find({ customerId: userId }).select('workerId');
    const bookedWorkerIds = pastBookings.map(b => b.workerId?.toString());

    const filter = { isVerified: true };
    if (category) filter.category = category;

    const workers = await Worker.find(filter)
      .populate('userId', 'name email phone profileImage');

    const scored = workers.map(worker => ({
      ...worker.toObject(),
      score: computeScore(worker, city || req.user.city, category, bookedWorkerIds)
    })).sort((a, b) => b.score - a.score);

    res.json({ recommendations: scored.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const chatAssistant = async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim())
    return res.status(400).json({ message: 'Message is required' });
  const msg = message.toLowerCase();

  const responses = {
    plumb: { reply: "🔧 For plumbing issues like leaks, blocked drains, or pipe repairs, I recommend booking a verified plumber. Most jobs take 1-2 hours. Average rate: ₹300-₹600/hr.", category: "Plumber" },
    electr: { reply: "⚡ Electrical issues need certified electricians. Safety first! Common services: wiring, MCB faults, fan installations. Average rate: ₹400-₹800/hr.", category: "Electrician" },
    clean: { reply: "🧹 For home cleaning, our verified cleaners handle deep cleaning, bathroom, kitchen & full home. Average rate: ₹200-₹400/hr.", category: "Cleaner" },
    carpen: { reply: "🪚 Carpenter services include furniture repair, door fixing, custom woodwork. Average rate: ₹350-₹700/hr.", category: "Carpenter" },
    paint: { reply: "🎨 Painting services for interior/exterior walls. Includes POP work and texture painting. Average rate: ₹15-₹25 per sq ft.", category: "Painter" },
    appl: { reply: "🔌 Appliance repair for AC, washing machine, refrigerator, microwave, etc. Average rate: ₹250-₹500 per visit.", category: "Appliance Repair" },
    book: { reply: "📅 To book a service: Go to Services → Choose a category → Select a worker → Pick date & time → Confirm booking. It's that simple!", category: null },
    emergency: { reply: "🚨 For emergencies, filter workers by 'Available Now'. Our verified workers respond within 30 minutes for urgent jobs.", category: null },
    price: { reply: "💰 Pricing varies by service type and duration. You'll see hourly rates on each worker's profile. Final amount is confirmed after the job.", category: null },
    default: { reply: "👋 Hi! I'm your Smart Home Assistant. Ask me about plumbing, electrical, cleaning, carpentry, painting, or appliance repair services. I'll guide you to the right professional!", category: null }
  };

  let matched = responses.default;
  for (const [key, val] of Object.entries(responses)) {
    if (key !== 'default' && msg.includes(key)) { matched = val; break; }
  }

  res.json({ reply: matched.reply, suggestedCategory: matched.category });
};

module.exports = { getRecommendations, chatAssistant };
