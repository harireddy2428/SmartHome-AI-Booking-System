require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Service = require('../models/Service');

const services = [
  { title: 'Electrical Wiring & Repair', category: 'Electrician', description: 'Complete home electrical repairs, wiring, MCB, switches, and fan installations.', basePrice: 400, duration: '1-3 hours' },
  { title: 'Plumbing & Pipe Repair', category: 'Plumber', description: 'Leak repairs, pipe fitting, drain cleaning, tap replacement, and bathroom plumbing.', basePrice: 350, duration: '1-2 hours' },
  { title: 'Carpentry & Furniture Repair', category: 'Carpenter', description: 'Door/window repairs, furniture assembly, custom woodwork, and cabinet making.', basePrice: 500, duration: '2-4 hours' },
  { title: 'Home Deep Cleaning', category: 'Cleaner', description: 'Full home cleaning, kitchen scrubbing, bathroom sanitization, and floor polishing.', basePrice: 300, duration: '3-5 hours' },
  { title: 'Wall Painting & Finishing', category: 'Painter', description: 'Interior/exterior painting, POP work, texture painting, and waterproofing.', basePrice: 200, duration: '4-8 hours' },
  { title: 'Appliance Repair', category: 'Appliance Repair', description: 'AC, washing machine, refrigerator, microwave, and geyser repair services.', basePrice: 300, duration: '1-2 hours' },
];

const workerData = [
  { name: 'Rajesh Kumar', email: 'rajesh@worker.com', phone: '9876543210', city: 'Mumbai', category: 'Electrician', skills: ['Wiring', 'MCB', 'Fan Installation'], experience: 8, rating: 4.8, hourlyRate: 450 },
  { name: 'Suresh Patel', email: 'suresh@worker.com', phone: '9876543211', city: 'Delhi', category: 'Plumber', skills: ['Pipe Fitting', 'Drain Cleaning', 'Tap Repair'], experience: 6, rating: 4.6, hourlyRate: 380 },
  { name: 'Anil Sharma', email: 'anil@worker.com', phone: '9876543212', city: 'Bangalore', category: 'Carpenter', skills: ['Furniture Repair', 'Door Fitting', 'Custom Wood'], experience: 10, rating: 4.9, hourlyRate: 520 },
  { name: 'Priya Devi', email: 'priya@worker.com', phone: '9876543213', city: 'Mumbai', category: 'Cleaner', skills: ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Sanitization'], experience: 4, rating: 4.7, hourlyRate: 280 },
  { name: 'Mohan Lal', email: 'mohan@worker.com', phone: '9876543214', city: 'Hyderabad', category: 'Painter', skills: ['Interior Painting', 'Texture Work', 'Waterproofing'], experience: 7, rating: 4.5, hourlyRate: 350 },
  { name: 'Vikram Singh', email: 'vikram@worker.com', phone: '9876543215', city: 'Chennai', category: 'Appliance Repair', skills: ['AC Repair', 'Washing Machine', 'Refrigerator'], experience: 9, rating: 4.8, hourlyRate: 400 },
  { name: 'Deepak Gupta', email: 'deepak@worker.com', phone: '9876543216', city: 'Delhi', category: 'Electrician', skills: ['Wiring', 'Solar Panels', 'CCTV'], experience: 12, rating: 5.0, hourlyRate: 600 },
  { name: 'Kavitha Rao', email: 'kavitha@worker.com', phone: '9876543217', city: 'Bangalore', category: 'Cleaner', skills: ['Sofa Cleaning', 'Carpet Cleaning', 'Office Cleaning'], experience: 5, rating: 4.6, hourlyRate: 300 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Worker.deleteMany(), Service.deleteMany()]);

  await Service.insertMany(services);
  console.log('✅ Services seeded');

  await User.create({ name: 'Admin', email: 'admin@smarthome.com', phone: '9999999999', password: 'admin123', role: 'admin', isActive: true });
  console.log('✅ Admin seeded: admin@smarthome.com / admin123');

  await User.create({ name: 'Test Customer', email: 'customer@test.com', phone: '8888888888', password: 'customer123', role: 'customer', city: 'Mumbai', address: 'Andheri West', isActive: true });
  console.log('✅ Customer seeded: customer@test.com / customer123');

  for (const w of workerData) {
    const user = await User.create({ name: w.name, email: w.email, phone: w.phone, password: 'worker123', role: 'worker', city: w.city, isActive: true });
    await Worker.create({ userId: user._id, category: w.category, skills: w.skills, experience: w.experience, rating: w.rating, city: w.city, hourlyRate: w.hourlyRate, availability: true, isVerified: true, totalReviews: Math.floor(Math.random() * 50 + 10) });
  }
  console.log('✅ Workers seeded (password: worker123)');

  mongoose.disconnect();
  console.log('🎉 Database seeded successfully!');
};

seed().catch(console.error);
