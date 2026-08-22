// Dynamic Destination Engine providing authentic destination data
// for Japan, India (Delhi, Mumbai, Goa), Europe (Paris, Barcelona, Rome, London), Australia, etc.

export interface DestinationInfo {
  name: string;
  country: string;
  airportCode: string;
  airportName: string;
  coverImage: string;
  lat: number;
  lng: number;
  guide: {
    title: string;
    curator: string;
    curatorRole: string;
    bio: string;
    highlights: Array<{
      name: string;
      category: string;
      tag: string;
      desc: string;
      image: string;
      note: string;
      walkInfo?: string;
    }>;
  };
  hotels: Array<{
    id: string;
    name: string;
    rating: string;
    ratingText: string;
    reviews: number;
    details: string;
    pricePerNight: number;
    totalPrice: number;
    image: string;
    rates: Array<{ provider: string; price: number; isBest?: boolean; isOfficial?: boolean }>;
    latOffset: number;
    lngOffset: number;
  }>;
  flights: Array<{
    flightNumber: string;
    airline: string;
    fromCode: string;
    fromCity: string;
    toCode: string;
    toCity: string;
    schedule: string;
    duration: string;
    depTime: string;
    arrTime: string;
    terminalDep: string;
    gateDep: string;
    terminalArr: string;
    gateArr: string;
    status: 'ON SCHEDULE' | 'DELAYED' | 'LANDED';
    cost: number;
    confirmationCode: string;
  }>;
  activities: Array<{
    name: string;
    cost: number;
    duration: string;
    category: string;
    description: string;
    image: string;
    walkInfo: string;
    lat: number;
    lng: number;
  }>;
}

export const DESTINATIONS: Record<string, DestinationInfo> = {
  japan: {
    name: 'Japan',
    country: 'Japan',
    airportCode: 'NRT',
    airportName: 'Tokyo Narita / Haneda Airport',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
    lat: 35.6762,
    lng: 139.6503,
    guide: {
      title: 'Japan Explorer: Shrines, Mount Fuji & Tokyo Neon',
      curator: 'Kenji Sato',
      curatorRole: 'Tokyo Resident & Cultural Guide • 40+ Trips',
      bio: 'Konnichiwa! Welcome to Japan. From historic temples in Kyoto to the neon crossings of Shibuya and tranquil Mount Fuji vistas, immerse yourself in Japan!',
      highlights: [
        {
          name: 'Shibuya Crossing & Meiji Shrine',
          category: 'Tokyo Urban • Shinto Heritage',
          tag: 'Must Visit',
          desc: 'World famous Shibuya pedestrian scramble followed by serene forested Meiji Jingu shrine.',
          image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80',
          note: 'Best visited early morning for peaceful shrine walk',
          walkInfo: '10 min walk • 0.8 km • Directions',
        },
        {
          name: 'Senso-ji Temple & Asakusa Market',
          category: 'Buddhist Temple • Traditional Crafts',
          tag: 'Iconic Landmark',
          desc: 'Tokyo’s oldest ancient temple with the iconic Kaminarimon thunder gate and Nakamise shopping street.',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80',
          note: 'Ranked #1 historic attraction in Tokyo',
          walkInfo: '15 min metro • 4 km • Directions',
        },
        {
          name: 'Mount Fuji 5th Station & Lake Kawaguchiko',
          category: 'Nature • UNESCO World Heritage',
          tag: 'Scenic Viewpoint',
          desc: 'Iconic snow-capped volcano peak reflected across pristine lakeside views and pagoda shrines.',
          image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80',
          note: 'Top rated day trip from Tokyo with scenic express trains',
          walkInfo: '1.5 hr train • 85 km • Directions',
        },
      ],
    },
    hotels: [
      {
        id: 'h-jp-1',
        name: 'Park Hyatt Tokyo (Shinjuku)',
        rating: '9.9',
        ratingText: 'Exceptional',
        reviews: 1890,
        details: '5-star luxury • Shinjuku skyline & Mount Fuji views • Peak Lounge • Indoor pool',
        pricePerNight: 28000,
        totalPrice: 56000,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
        rates: [
          { provider: 'GlobeTrotter Direct', price: 52000, isBest: true },
          { provider: 'Hyatt.com', price: 56000, isOfficial: true },
          { provider: 'Booking.com', price: 58000 },
        ],
        latOffset: 0.01,
        lngOffset: 0.01,
      },
      {
        id: 'h-jp-2',
        name: 'Hoshinoya Tokyo - Modern Ryokan',
        rating: '9.8',
        ratingText: 'Authentic Ryokan',
        reviews: 950,
        details: 'Luxury Japanese Ryokan with natural hot spring onsen and tatami rooms • Otemachi',
        pricePerNight: 35000,
        totalPrice: 70000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        rates: [
          { provider: 'GlobeTrotter Direct', price: 68000, isBest: true },
          { provider: 'Hoshinoya.com', price: 70000, isOfficial: true },
        ],
        latOffset: -0.01,
        lngOffset: -0.01,
      },
    ],
    flights: [
      {
        flightNumber: 'AI 306',
        airline: 'Air India',
        fromCode: 'DEL',
        fromCity: 'Delhi',
        toCode: 'NRT',
        toCity: 'Tokyo Narita',
        schedule: 'Daily Non-Stop',
        duration: '7 hr 45 min',
        depTime: '09:15 PM',
        arrTime: '08:45 AM+1',
        terminalDep: 'T3',
        gateDep: '19B',
        terminalArr: 'T1',
        gateArr: '42',
        status: 'ON SCHEDULE',
        cost: 46000,
        confirmationCode: 'AI-NRT810',
      },
      {
        flightNumber: 'JL 750',
        airline: 'Japan Airlines',
        fromCode: 'DEL',
        fromCity: 'Delhi',
        toCode: 'HND',
        toCity: 'Tokyo Haneda',
        schedule: 'Daily Non-Stop',
        duration: '7 hr 30 min',
        depTime: '07:30 PM',
        arrTime: '06:55 AM+1',
        terminalDep: 'T3',
        gateDep: '14',
        terminalArr: 'T3',
        gateArr: '112',
        status: 'ON SCHEDULE',
        cost: 54000,
        confirmationCode: 'JL-TYO992',
      },
    ],
    activities: [
      {
        name: 'Senso-ji Temple & Nakamise Street',
        cost: 0,
        duration: '2.5 hrs',
        category: 'Ancient Buddhist Temple',
        description: 'Explore Tokyo’s oldest temple with red lantern gates, incense burners, and traditional street snacks.',
        image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80',
        walkInfo: '2 min walk • 0.1 km',
        lat: 35.7148,
        lng: 139.7967,
      },
      {
        name: 'Shibuya Crossing & Hachiko Statue',
        cost: 0,
        duration: '1.5 hrs',
        category: 'Urban Landmark',
        description: 'Walk across the world’s busiest intersection and visit the faithful Hachiko dog statue.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80',
        walkInfo: '15 min metro • 5 km',
        lat: 35.6595,
        lng: 139.7004,
      },
      {
        name: 'Meiji Jingu Shinto Shrine',
        cost: 0,
        duration: '2 hrs',
        category: 'Shinto Forest Shrine',
        description: 'Serene forested shrine dedicated to Emperor Meiji surrounded by 170 acres of evergreen trees.',
        image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=600&q=80',
        walkInfo: '10 min walk • 1 km',
        lat: 35.6764,
        lng: 139.6993,
      },
      {
        name: 'Tsukiji Outer Market Food Tour',
        cost: 2500,
        duration: '2.5 hrs',
        category: 'Culinary Market',
        description: 'Savor fresh sashimi, wagyu beef skewers, tamagoyaki omelet, and matcha tea from local master chefs.',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
        walkInfo: '10 min drive • 4 km',
        lat: 35.6655,
        lng: 139.7708,
      },
    ],
  },
  delhi: {
    name: 'Delhi',
    country: 'India',
    airportCode: 'DEL',
    airportName: 'Indira Gandhi International Airport',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
    lat: 28.6139,
    lng: 77.209,
    guide: {
      title: 'Delhi Explorer: Heritage, Spices & Mughal Grandeur',
      curator: 'Aarav Sharma',
      curatorRole: 'Heritage Historian & Food Writer • 30+ Trips',
      bio: 'Namaste! Welcome to Delhi. From narrow fragrant alleys of Chandni Chowk to the majestic lawns of India Gate, explore the heart of India!',
      highlights: [
        {
          name: 'Red Fort & Chandni Chowk Food Trail',
          category: 'Mughal Heritage • Street Food',
          tag: 'Must Visit',
          desc: '17th-century Mughal fortress followed by parathas in Paranthe Wali Gali and royal jalebis in Old Delhi.',
          image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
          note: 'Best experienced in the morning with a local guide',
          walkInfo: '10 min walk • 0.5 km • Directions',
        },
        {
          name: 'Qutub Minar & Mehrauli Archaeological Park',
          category: 'UNESCO World Heritage • Architecture',
          tag: 'Iconic Landmark',
          desc: 'World’s tallest brick minaret standing at 72.5m surrounded by medieval Sultanate ruins and lush parklands.',
          image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
          note: 'Featured in top heritage architectural lists',
          walkInfo: '15 min drive • 8 km • Directions',
        },
        {
          name: 'Humayun’s Tomb & Sunder Nursery',
          category: 'Persian Architecture • Garden Oasis',
          tag: 'Sunset Viewpoint',
          desc: 'Magnificent garden tomb that inspired the Taj Mahal, adjacent to Delhi’s premier 90-acre heritage botanical park.',
          image: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80',
          note: 'Top rated in 2025 for evening strolls and photography',
          walkInfo: '12 min drive • 6 km • Directions',
        },
      ],
    },
    hotels: [
      {
        id: 'h-del-1',
        name: 'The Taj Mahal Hotel, New Delhi',
        rating: '9.8',
        ratingText: 'Exceptional',
        reviews: 1420,
        details: '5-star luxury • Lutyens Delhi • Free WiFi • Pool • Award-winning Dining (House of Ming)',
        pricePerNight: 12500,
        totalPrice: 25000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        rates: [
          { provider: 'GlobeTrotter Direct', price: 23500, isBest: true },
          { provider: 'TajHotels.com', price: 25000, isOfficial: true },
          { provider: 'Booking.com', price: 26200 },
          { provider: 'MakeMyTrip', price: 25800 },
        ],
        latOffset: 0.01,
        lngOffset: -0.01,
      },
      {
        id: 'h-del-2',
        name: 'The Oberoi, New Delhi',
        rating: '9.9',
        ratingText: 'World Class',
        reviews: 2100,
        details: '5-star heritage luxury • Golf Course views • Clean Air Filtration • Heated Pools',
        pricePerNight: 16000,
        totalPrice: 32000,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
        rates: [
          { provider: 'GlobeTrotter Direct', price: 30500, isBest: true },
          { provider: 'OberoiHotels.com', price: 32000, isOfficial: true },
          { provider: 'Agoda', price: 33500 },
        ],
        latOffset: -0.02,
        lngOffset: 0.02,
      },
    ],
    flights: [
      {
        flightNumber: 'AI 101',
        airline: 'Air India',
        fromCode: 'BOM',
        fromCity: 'Mumbai',
        toCode: 'DEL',
        toCity: 'Delhi',
        schedule: 'Daily Non-Stop',
        duration: '2 hr 10 min',
        depTime: '08:00 AM',
        arrTime: '10:10 AM',
        terminalDep: 'T2',
        gateDep: '44B',
        terminalArr: 'T3',
        gateArr: '18A',
        status: 'ON SCHEDULE',
        cost: 6500,
        confirmationCode: 'AI-DEL992',
      },
    ],
    activities: [
      {
        name: 'Red Fort & Chandni Chowk Food Trail',
        cost: 1500,
        duration: '3 hrs',
        category: 'Heritage & Food',
        description: 'Guided tour of the Mughal citadel followed by heritage street food tasting in Old Delhi.',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
        walkInfo: '2 min walk • 0.1 km',
        lat: 28.6562,
        lng: 77.241,
      },
      {
        name: 'Qutub Minar Complex',
        cost: 500,
        duration: '2 hrs',
        category: 'Monument',
        description: 'Explore the 12th-century victory tower, Iron Pillar, and surrounding Sultanate architecture.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
        walkInfo: '15 min drive • 12 km',
        lat: 28.5244,
        lng: 77.1855,
      },
    ],
  },
  paris: {
    name: 'Paris',
    country: 'France',
    airportCode: 'CDG',
    airportName: 'Charles de Gaulle Airport',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    lat: 48.8566,
    lng: 2.3522,
    guide: {
      title: 'Paris Explorer: Art, Cafés & Seine Sunsets',
      curator: 'Jenny Wilson',
      curatorRole: 'Local Food & Culture Curator • 24 Trips',
      bio: 'Bonjour! Welcome to Paris. Here are my favorite art spots, quaint bakeries, and romantic Seine strolls.',
      highlights: [
        {
          name: 'Louvre Museum VIP Guided Tour',
          category: 'Art & History',
          tag: 'Must Visit',
          desc: 'Skip-the-line access to Mona Lisa, Venus de Milo, and French Crown Jewels.',
          image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600&q=80',
          note: 'Book morning slot to avoid crowds',
          walkInfo: '5 min walk • 0.3 km',
        },
      ],
    },
    hotels: [
      {
        id: 'h-par-1',
        name: 'Grand Hotel Central Paris',
        rating: '9.7',
        ratingText: 'Exceptional',
        reviews: 980,
        details: '4-star boutique hotel • Free WiFi • Eiffel Tower views • Central 1st Arrondissement',
        pricePerNight: 14500,
        totalPrice: 29000,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
        rates: [
          { provider: 'GlobeTrotter Direct', price: 27500, isBest: true },
          { provider: 'Booking.com', price: 29800 },
        ],
        latOffset: 0.01,
        lngOffset: 0.01,
      },
    ],
    flights: [
      {
        flightNumber: 'AF 218',
        airline: 'Air France',
        fromCode: 'DEL',
        fromCity: 'Delhi',
        toCode: 'CDG',
        toCity: 'Paris',
        schedule: 'Daily Non-Stop',
        duration: '8 hr 45 min',
        depTime: '01:30 PM',
        arrTime: '06:15 PM',
        terminalDep: 'T3',
        gateDep: '18',
        terminalArr: '2E',
        gateArr: 'K32',
        status: 'ON SCHEDULE',
        cost: 54000,
        confirmationCode: 'AF-PAR771',
      },
    ],
    activities: [
      {
        name: 'Louvre Museum Guided Tour',
        cost: 3500,
        duration: '2.5 hrs',
        category: 'Art & Culture',
        description: 'Explore the world’s largest art museum with fast-track entry.',
        image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600&q=80',
        walkInfo: '5 min walk • 0.3 km',
        lat: 48.8606,
        lng: 2.3376,
      },
    ],
  },
  barcelona: {
    name: 'Barcelona',
    country: 'Spain',
    airportCode: 'BCN',
    airportName: 'Josep Tarradellas Barcelona–El Prat',
    coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80',
    lat: 41.3879,
    lng: 2.1699,
    guide: {
      title: 'Barcelona Explorer: Gaudí, Tapas & Mediterranean Sun',
      curator: 'Elena Gomez',
      curatorRole: 'Architect & Catalan Foodie • 18 Trips',
      bio: '¡Hola! Experience Gaudí masterpieces, fresh seafood tapas in Gothic Quarter, and sunny Mediterranean beaches.',
      highlights: [
        {
          name: 'Sagrada Família Guided Tour',
          category: 'Architecture',
          tag: 'Masterpiece',
          desc: 'Antoni Gaudí’s awe-inspiring basilica with stained-glass reflections and soaring towers.',
          image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
          note: 'Tower access included for panoramic city views',
          walkInfo: '10 min walk • 0.8 km',
        },
      ],
    },
    hotels: [
      {
        id: 'h-bcn-1',
        name: 'Hotel Arts Barcelona',
        rating: '9.8',
        ratingText: 'Exceptional',
        reviews: 820,
        details: '5-star seafront luxury • Michelin-starred dining • Infinity pool overlooking beach',
        pricePerNight: 16500,
        totalPrice: 33000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        rates: [
          { provider: 'GlobeTrotter Direct', price: 31000, isBest: true },
          { provider: 'Booking.com', price: 34000 },
        ],
        latOffset: 0.01,
        lngOffset: 0.01,
      },
    ],
    flights: [
      {
        flightNumber: 'IB 3120',
        airline: 'Iberia',
        fromCode: 'DEL',
        fromCity: 'Delhi',
        toCode: 'BCN',
        toCity: 'Barcelona',
        schedule: 'Non-Stop / 1 Stop',
        duration: '9 hr 30 min',
        depTime: '11:00 AM',
        arrTime: '06:00 PM',
        terminalDep: 'T3',
        gateDep: '14',
        terminalArr: 'T1',
        gateArr: 'B22',
        status: 'ON SCHEDULE',
        cost: 49000,
        confirmationCode: 'IB-BCN441',
      },
    ],
    activities: [
      {
        name: 'Sagrada Família & Towers',
        cost: 3200,
        duration: '2 hrs',
        category: 'Heritage',
        description: 'Explore the world-famous basilica designed by Antoni Gaudí.',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
        walkInfo: '10 min walk • 0.8 km',
        lat: 41.4036,
        lng: 2.1744,
      },
    ],
  },
};

// Helper to get destination info for ANY city or country query
export function getDestinationInfo(query: string = 'Japan'): DestinationInfo {
  if (!query) return DESTINATIONS.japan;
  const normalized = query.toLowerCase().trim();

  // 1. Direct dictionary match
  for (const [key, dest] of Object.entries(DESTINATIONS)) {
    if (
      normalized.includes(key) ||
      normalized.includes(dest.name.toLowerCase()) ||
      normalized.includes(dest.country.toLowerCase())
    ) {
      return dest;
    }
  }

  // 2. Specific city aliases
  if (normalized.includes('tokyo') || normalized.includes('kyoto') || normalized.includes('osaka') || normalized.includes('japan')) {
    return DESTINATIONS.japan;
  }
  if (normalized.includes('delhi') || normalized.includes('india') || normalized.includes('agra')) {
    return DESTINATIONS.delhi;
  }
  if (normalized.includes('paris') || normalized.includes('france')) {
    return DESTINATIONS.paris;
  }
  if (normalized.includes('barcelona') || normalized.includes('spain') || normalized.includes('madrid')) {
    return DESTINATIONS.barcelona;
  }

  // 3. Dynamic generic destination for any city (Australia, London, Rome, etc.)
  const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
  return {
    name: capitalized,
    country: 'International',
    airportCode: capitalized.slice(0, 3).toUpperCase(),
    airportName: `${capitalized} International Airport`,
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
    lat: 35.6762,
    lng: 139.6503,
    guide: {
      title: `${capitalized} Explorer: Sights, Culture & Local Highlights`,
      curator: 'GlobeTrotter Curator',
      curatorRole: 'Global Travel Guide • 50+ Trips',
      bio: `Welcome to ${capitalized}! Explore top-rated landmarks, authentic local food, and cultural highlights.`,
      highlights: [
        {
          name: `Iconic ${capitalized} City Center`,
          category: 'Landmark • Sights',
          tag: 'Must Visit',
          desc: `Historic central district of ${capitalized} featuring vibrant promenades, shops, and architecture.`,
          image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
          note: 'Top rated sightseeing spot',
          walkInfo: '5 min walk • 0.3 km',
        },
      ],
    },
    hotels: [
      {
        id: `h-dyn-1`,
        name: `Grand Hotel ${capitalized}`,
        rating: '9.8',
        ratingText: 'Exceptional',
        reviews: 780,
        details: `4-star luxury stay located in central ${capitalized} • Free WiFi • Pool`,
        pricePerNight: 9500,
        totalPrice: 19000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        rates: [
          { provider: 'GlobeTrotter Direct', price: 17500, isBest: true },
          { provider: 'Booking.com', price: 19000 },
        ],
        latOffset: 0.01,
        lngOffset: 0.01,
      },
    ],
    flights: [
      {
        flightNumber: `GT 402`,
        airline: 'Air India / Global Partner',
        fromCode: 'DEL',
        fromCity: 'Delhi',
        toCode: capitalized.slice(0, 3).toUpperCase(),
        toCity: capitalized,
        schedule: 'Daily Schedule',
        duration: '7 hr 30 min',
        depTime: '10:00 AM',
        arrTime: '06:30 PM',
        terminalDep: 'T3',
        gateDep: '18',
        terminalArr: 'T1',
        gateArr: '22',
        status: 'ON SCHEDULE',
        cost: 38000,
        confirmationCode: `GT-${capitalized.slice(0, 3).toUpperCase()}99`,
      },
    ],
    activities: [
      {
        name: `${capitalized} Historic Sights Tour`,
        cost: 1500,
        duration: '2.5 hrs',
        category: 'Heritage & Culture',
        description: `Explore the top cultural and architectural sights of ${capitalized}.`,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
        walkInfo: '5 min walk • 0.3 km',
        lat: 35.6762,
        lng: 139.6503,
      },
    ],
  };
}
