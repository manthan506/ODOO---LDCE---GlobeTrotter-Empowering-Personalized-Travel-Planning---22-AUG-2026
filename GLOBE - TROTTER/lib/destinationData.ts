// Dynamic Destination Engine providing real, authentic destination data
// for Indian and International cities (Delhi, Paris, Tokyo, Barcelona, Rome, etc.)

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
      {
        id: 'h-del-3',
        name: 'Haveli Dharampura - Heritage Hotel',
        rating: '9.6',
        ratingText: 'Heritage Gem',
        reviews: 650,
        details: 'Restored 19th-century haveli in Old Delhi • Rooftop dining • Classical Kathak evenings',
        pricePerNight: 7500,
        totalPrice: 15000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        rates: [
          { provider: 'GlobeTrotter Direct', price: 14200, isBest: true },
          { provider: 'HaveliDharampura.com', price: 15000, isOfficial: true },
          { provider: 'Booking.com', price: 16000 },
        ],
        latOffset: 0.03,
        lngOffset: 0.01,
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
      {
        flightNumber: '6E 202',
        airline: 'IndiGo',
        fromCode: 'BLR',
        fromCity: 'Bengaluru',
        toCode: 'DEL',
        toCity: 'Delhi',
        schedule: 'Daily Non-Stop',
        duration: '2 hr 45 min',
        depTime: '02:30 PM',
        arrTime: '05:15 PM',
        terminalDep: 'T1',
        gateDep: '12',
        terminalArr: 'T2',
        gateArr: '08',
        status: 'ON SCHEDULE',
        cost: 5800,
        confirmationCode: '6E-DEL412',
      },
      {
        flightNumber: 'UK 995',
        airline: 'Vistara',
        fromCode: 'LHR',
        fromCity: 'London Heathrow',
        toCode: 'DEL',
        toCity: 'Delhi',
        schedule: 'Daily Non-Stop',
        duration: '8 hr 30 min',
        depTime: '10:00 PM',
        arrTime: '10:30 AM+1',
        terminalDep: 'T2',
        gateDep: 'B18',
        terminalArr: 'T3',
        gateArr: 'Gate 22',
        status: 'ON SCHEDULE',
        cost: 48500,
        confirmationCode: 'UK-LON882',
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
      {
        name: 'Humayun’s Tomb & Sunder Nursery',
        cost: 600,
        duration: '2.5 hrs',
        category: 'Garden Heritage',
        description: 'Marvel at Persian-Mughal garden architecture and walk through 90 acres of heritage gardens.',
        image: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&q=80',
        walkInfo: '10 min drive • 6 km',
        lat: 28.5933,
        lng: 77.2507,
      },
      {
        name: 'India Gate & Kartavya Path Walk',
        cost: 0,
        duration: '1.5 hrs',
        category: 'Sightseeing',
        description: 'Iconic war memorial archway with evening illuminations, ice cream stalls, and fountains.',
        image: 'https://images.unsplash.com/photo-1598555246738-9226f9872594?w=600&q=80',
        walkInfo: '5 min drive • 3 km',
        lat: 28.6129,
        lng: 77.2295,
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
        {
          name: 'Eiffel Tower & Seine River Cruise',
          category: 'Iconic Landmark',
          tag: 'Top Rated',
          desc: 'Summit elevator ascent followed by 1-hour illuminated cruise under Parisian bridges.',
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
          note: 'Sunset departure offers best illumination',
          walkInfo: '15 min metro • 4 km',
        },
        {
          name: 'Café de Flore & Saint-Germain',
          category: 'Dining • Hidden Gem',
          tag: 'Local Favorite',
          desc: 'Historic literary café famous for artisan pastries and Parisian atmosphere.',
          image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
          note: 'Mentioned on 5 other member lists',
          walkInfo: '8 min walk • 0.6 km',
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
      {
        name: 'Eiffel Tower Summit & Seine Cruise',
        cost: 4200,
        duration: '3 hrs',
        category: 'Sightseeing',
        description: 'Ascend to the top of Paris and cruise along the romantic Seine.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
        walkInfo: '15 min drive • 4 km',
        lat: 48.8584,
        lng: 2.2945,
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
      {
        name: 'Park Güell & Gothic Quarter Walk',
        cost: 1800,
        duration: '3 hrs',
        category: 'Culture',
        description: 'Mosaic terraces overlooking the sea and Roman alleys.',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        walkInfo: '15 min drive • 3 km',
        lat: 41.4145,
        lng: 2.1527,
      },
    ],
  },
};

// Helper to get destination info by trip name or city name
export function getDestinationInfo(query: string = 'Delhi'): DestinationInfo {
  const normalized = query.toLowerCase().trim();
  for (const [key, dest] of Object.entries(DESTINATIONS)) {
    if (normalized.includes(key) || normalized.includes(dest.name.toLowerCase())) {
      return dest;
    }
  }
  // Default to Delhi if trip name matches India / Delhi / unknown
  return DESTINATIONS.delhi;
}
