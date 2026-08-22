import City from '@/models/City';
import Activity from '@/models/Activity';
import { connectDB } from './db';

export async function ensureSeedData() {
  await connectDB();
  const cityCount = await City.countDocuments();
  if (cityCount > 0) return;

  console.log('Seeding initial cities and activities (INR currency)...');

  const citiesData = [
    {
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      costIndex: 3,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      description: 'The City of Light, famous for art, fashion, gastronomy, and culture.',
    },
    {
      name: 'Swiss Alps',
      country: 'Switzerland',
      region: 'Europe',
      costIndex: 3,
      imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
      description: 'Dramatic snow-capped peaks, alpine meadows, and pristine lakes.',
    },
    {
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
      description: 'The Eternal City packed with ancient history, architecture, and cuisine.',
    },
    {
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
      description: 'Vibrant Mediterranean city known for Gaudí art and lively beach promenades.',
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      costIndex: 3,
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
      description: 'Ultramodern neon metropolis seamlessly intertwined with timeless temples.',
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      costIndex: 1,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      description: 'Tropical paradise of lush volcanic hills, coral reefs, and spiritual serenity.',
    },
    {
      name: 'New York',
      country: 'USA',
      region: 'Americas',
      costIndex: 3,
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      description: 'The city that never sleeps with iconic skyline, Broadway, and diverse food.',
    },
    {
      name: 'Cape Town',
      country: 'South Africa',
      region: 'Africa',
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80',
      description: 'Stunning coastal city anchored by Table Mountain and scenic beaches.',
    },
    {
      name: 'Cappadocia',
      country: 'Turkey',
      region: 'Europe',
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800&q=80',
      description: 'Fairytale landscape of fairy chimneys, cave suites, and hot air balloon skies.',
    },
    {
      name: 'Dubai',
      country: 'UAE',
      region: 'Middle East',
      costIndex: 3,
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      description: 'Futuristic desert oasis of luxury shopping, skyscrapers, and desert adventures.',
    },
    {
      name: 'Bangkok',
      country: 'Thailand',
      region: 'Asia',
      costIndex: 1,
      imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
      description: 'Bustling capital famed for ornate shrines, floating markets, and rich street food.',
    },
    {
      name: 'Kerala',
      country: 'India',
      region: 'Asia',
      costIndex: 1,
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      description: "God's Own Country, famed for tranquil backwaters, tea gardens, and Ayurveda.",
    },
  ];

  const createdCities = await City.insertMany(citiesData);

  const cityMap = new Map<string, string>();
  createdCities.forEach((c) => cityMap.set(c.name, c._id.toString()));

  const activitiesData = [
    {
      cityName: 'Cappadocia',
      name: 'Hot Air Balloon Ride',
      cost: 16000,
      duration: 210,
      category: 'adventure',
      description: "Experience the breathtaking views of Cappadocia's unique landscape as you float above fairy chimneys and valleys at dawn.",
      imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800&q=80',
      bestTime: 'Sunrise',
      includes: [
        'Hotel pickup & drop-off',
        'Light breakfast buffet',
        'Commemorative flight certificate',
        'Passenger insurance',
      ],
    },
    {
      cityName: 'Paris',
      name: 'Louvre Museum Tour',
      cost: 3500,
      duration: 150,
      category: 'culture',
      description: 'Skip-the-line guided exploration of the world’s largest art museum, including the Mona Lisa and Venus de Milo.',
      imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=800&q=80',
      bestTime: 'Morning',
      includes: ['Skip-the-line ticket', 'Licensed art historian guide', 'Audio headset'],
    },
    {
      cityName: 'Paris',
      name: 'Eiffel Tower & Seine River Cruise',
      cost: 4200,
      duration: 180,
      category: 'sightseeing',
      description: 'Summit access to the Eiffel Tower followed by an evening illuminated cruise along the River Seine.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      bestTime: 'Sunset',
      includes: ['Tower summit elevator ticket', '1-hour Seine boat cruise', 'Audio commentary'],
    },
    {
      cityName: 'Bali',
      name: 'Scuba Diving & Coral Reef Safari',
      cost: 5500,
      duration: 270,
      category: 'adventure',
      description: 'Discover crystal clear waters, vibrant tropical fish, and manta rays in Nusa Penida.',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      bestTime: 'Morning',
      includes: ['Full dive gear', 'Certified PADI instructor', 'Speedboat transfers', 'Lunch buffet'],
    },
    {
      cityName: 'Tokyo',
      name: 'Sushi Making Masterclass',
      cost: 4800,
      duration: 120,
      category: 'food',
      description: 'Learn the ancient art of Edomae sushi crafting from an authentic Tsukiji master chef.',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
      bestTime: 'Afternoon',
      includes: ['Fresh sashimi grade fish', 'Take-home sushi rolling mat', 'Sake pairing tasting'],
    },
    {
      cityName: 'Dubai',
      name: 'Desert Safari with Dune Bashing',
      cost: 6000,
      duration: 360,
      category: 'adventure',
      description: '4x4 red dune bashing, camel riding, sandboarding, and an Arabian BBQ buffet under the desert stars.',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      bestTime: 'Afternoon',
      includes: ['4x4 Land Cruiser pickup', 'Dune bashing session', 'BBQ dinner & show', 'Henna painting'],
    },
    {
      cityName: 'Bangkok',
      name: 'Midnight Street Food Tuk-Tuk Tour',
      cost: 2200,
      duration: 200,
      category: 'food',
      description: 'Zip through Bangkok alleys in neon tuk-tuks tasting Michelin-guide pad thai, satay, and mango sticky rice.',
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
      bestTime: 'Evening',
      includes: ['Tuk-tuk driver & English guide', '7 food & drink tastings', 'Flower market visit'],
    },
    {
      cityName: 'Rome',
      name: 'Colosseum & Ancient Rome VIP Tour',
      cost: 3800,
      duration: 180,
      category: 'culture',
      description: 'Walk onto the Colosseum arena floor and explore the Roman Forum & Palatine Hill.',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
      bestTime: 'Morning',
      includes: ['Arena floor access ticket', 'Expert archaeologist guide', 'Headset system'],
    },
    {
      cityName: 'Swiss Alps',
      name: 'Jungfraujoch Top of Europe Excursion',
      cost: 14500,
      duration: 360,
      category: 'sightseeing',
      description: 'Ascend by cogwheel train to Europe’s highest railway station at 3,454m with Ice Palace access.',
      imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
      bestTime: 'Morning',
      includes: ['Eiger Express & Jungfrau train', 'Sphinx Observatory access', 'Alpine Sensation tunnel'],
    },
    {
      cityName: 'Tokyo',
      name: 'Mount Fuji Panoramic Day Tour',
      cost: 7500,
      duration: 480,
      category: 'sightseeing',
      description: 'Lake Kawaguchiko views, Chureito Pagoda photo stop, and Oshino Hakkai spring ponds.',
      imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80',
      bestTime: 'Morning',
      includes: ['Deluxe coach transport', 'English-speaking guide', 'Matcha tasting experience'],
    },
    {
      cityName: 'Kerala',
      name: 'Alleppey Backwaters Houseboat Cruise',
      cost: 8000,
      duration: 360,
      category: 'relaxation',
      description: 'Glide along coconut-fringed canals on a traditional kettuvallam boat with authentic Kerala meals.',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      bestTime: 'Full Day',
      includes: ['Private houseboat cruise', 'Traditional banana leaf lunch', 'Evening snacks & tea'],
    },
  ];

  const activitiesToInsert = activitiesData
    .filter((a) => cityMap.has(a.cityName))
    .map((a) => ({
      cityId: cityMap.get(a.cityName),
      name: a.name,
      cost: a.cost,
      duration: a.duration,
      category: a.category,
      description: a.description,
      imageUrl: a.imageUrl,
      bestTime: a.bestTime,
      includes: a.includes,
    }));

  await Activity.insertMany(activitiesToInsert);
  console.log('Successfully seeded cities and activities!');
}
