import { User, TradeListing, Message, ServiceArea, TradeType } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Builder',
    email: 'john@builder.com',
    phone: '403-555-0001',
    role: 'builder',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Mike Carpenter',
    email: 'mike@carpenter.com',
    phone: '403-555-0002',
    role: 'tradesman',
    experience: 15,
    bio: 'Experienced framing carpenter with 15 years in Calgary construction.',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Sarah Plumber',
    email: 'sarah@plumber.com',
    phone: '403-555-0003',
    role: 'tradesman',
    experience: 10,
    bio: 'Licensed plumber specializing in residential new builds.',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '4',
    name: 'Tom Electrician',
    email: 'tom@electric.com',
    phone: '403-555-0004',
    role: 'tradesman',
    experience: 12,
    bio: 'Master electrician, certified for residential and commercial work.',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '5',
    name: 'Dave Roofer',
    email: 'dave@roofing.com',
    phone: '403-555-0005',
    role: 'tradesman',
    experience: 20,
    bio: 'Roofing specialist with 20 years experience in Calgary climate.',
    createdAt: new Date('2024-03-01'),
  },
];

// Mock trade listings
export const mockTradeListings: TradeListing[] = [
  {
    id: '1',
    tradesmanId: '2',
    tradesmanName: 'Mike Carpenter',
    tradeType: 'Framing',
    rate: 45,
    rateUnit: 'per hour',
    serviceAreas: ['NW', 'NE'],
    experience: 15,
    description: 'Professional framing services for residential construction. Quality work, on time.',
    phone: '403-555-0002',
    email: 'mike@carpenter.com',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    tradesmanId: '3',
    tradesmanName: 'Sarah Plumber',
    tradeType: 'Plumber',
    rate: 85,
    rateUnit: 'per hour',
    serviceAreas: ['SW', 'SE'],
    experience: 10,
    description: 'Licensed plumber for rough-in and finish work. Free estimates.',
    phone: '403-555-0003',
    email: 'sarah@plumber.com',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    tradesmanId: '4',
    tradesmanName: 'Tom Electrician',
    tradeType: 'Electrician',
    rate: 90,
    rateUnit: 'per hour',
    serviceAreas: ['NE', 'SE', 'SW', 'NW'],
    experience: 12,
    description: 'Master electrician. Rough-in, service upgrades, and finish electrical.',
    phone: '403-555-0004',
    email: 'tom@electric.com',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '4',
    tradesmanId: '5',
    tradesmanName: 'Dave Roofer',
    tradeType: 'Roofing',
    rate: 6,
    rateUnit: 'per sq ft',
    serviceAreas: ['NW', 'SW'],
    experience: 20,
    description: 'Complete roofing services. Shingles, metal roofing, and repairs.',
    phone: '403-555-0005',
    email: 'dave@roofing.com',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '5',
    tradesmanId: '2',
    tradesmanName: 'Mike Carpenter',
    tradeType: 'Drywall',
    rate: 2.5,
    rateUnit: 'per sq ft',
    serviceAreas: ['NW', 'NE'],
    experience: 15,
    description: 'Drywall installation and finishing. Smooth finish guaranteed.',
    phone: '403-555-0002',
    email: 'mike@carpenter.com',
    createdAt: new Date('2024-03-05'),
  },
  {
    id: '6',
    tradesmanId: '3',
    tradesmanName: 'Sarah Plumber',
    tradeType: 'Heating',
    rate: 95,
    rateUnit: 'per hour',
    serviceAreas: ['SW', 'SE', 'NE'],
    experience: 10,
    description: 'HVAC installation and service. Furnaces and hot water systems.',
    phone: '403-555-0003',
    email: 'sarah@plumber.com',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '7',
    tradesmanId: '4',
    tradesmanName: 'Tom Electrician',
    tradeType: 'Demolition',
    rate: 3500,
    rateUnit: 'per project',
    serviceAreas: ['NE', 'NW'],
    experience: 12,
    description: 'Interior demolition for renovations. Safe and efficient.',
    phone: '403-555-0004',
    email: 'tom@electric.com',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '8',
    tradesmanId: '5',
    tradesmanName: 'Dave Roofer',
    tradeType: 'Siding',
    rate: 8,
    rateUnit: 'per sq ft',
    serviceAreas: ['NW', 'SW', 'SE'],
    experience: 20,
    description: 'Vinyl and fiber cement siding installation.',
    phone: '403-555-0005',
    email: 'dave@roofing.com',
    createdAt: new Date('2024-03-20'),
  },
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'John Builder',
    receiverId: '2',
    receiverName: 'Mike Carpenter',
    message: 'Hi Mike, I need framing work for a new build in NW Calgary. Are you available next week?',
    timestamp: new Date('2024-03-25T10:30:00'),
    read: true,
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Mike Carpenter',
    receiverId: '1',
    receiverName: 'John Builder',
    message: 'Yes, I have availability next week. Can you send me the project details?',
    timestamp: new Date('2024-03-25T11:15:00'),
    read: true,
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'John Builder',
    receiverId: '2',
    receiverName: 'Mike Carpenter',
    message: 'Great! It\'s a 2400 sq ft single family home. When can we meet on site?',
    timestamp: new Date('2024-03-25T14:20:00'),
    read: false,
  },
];

// Trade types with icons mapping
export const tradeTypes: { name: TradeType; icon: string; description: string }[] = [
  { name: 'Demolition', icon: 'Hammer', description: 'Interior and exterior demolition services' },
  { name: 'Foundation Grader', icon: 'TrendingDown', description: 'Site grading and preparation' },
  { name: 'Foundation Pouring', icon: 'Layers', description: 'Concrete foundation work' },
  { name: 'Framing', icon: 'Home', description: 'Wood and steel framing' },
  { name: 'Plumber', icon: 'Droplet', description: 'Plumbing installation and repair' },
  { name: 'Electrician', icon: 'Zap', description: 'Electrical installation and service' },
  { name: 'Heating', icon: 'Flame', description: 'HVAC systems installation' },
  { name: 'Roofing', icon: 'Triangle', description: 'Roofing installation and repair' },
  { name: 'Drywall', icon: 'Square', description: 'Drywall installation and finishing' },
  { name: 'Siding', icon: 'Warehouse', description: 'Exterior siding installation' },
  { name: 'Finisher', icon: 'Sparkles', description: 'Interior finishing and trim' },
  { name: 'Tile/Floor', icon: 'Grid3x3', description: 'Tile and flooring installation' },
  { name: 'Counter', icon: 'RectangleHorizontal', description: 'Countertop installation' },
  { name: 'Fireplace', icon: 'Flame', description: 'Fireplace installation and service' },
  { name: 'Door and Window', icon: 'DoorClosed', description: 'Door and window installation' },
  { name: 'Lumber', icon: 'Trees', description: 'Lumber supply and delivery' },
];

export const serviceAreas: ServiceArea[] = ['NE', 'NW', 'SE', 'SW'];

// Calculate average rates by trade and area
export function getAverageRates(): Record<TradeType, Record<ServiceArea, number>> {
  const averages: any = {};
  
  tradeTypes.forEach(trade => {
    averages[trade.name] = { NE: 0, NW: 0, SE: 0, SW: 0 };
    serviceAreas.forEach(area => {
      const listings = mockTradeListings.filter(
        listing => listing.tradeType === trade.name && listing.serviceAreas.includes(area)
      );
      if (listings.length > 0) {
        const total = listings.reduce((sum, listing) => sum + listing.rate, 0);
        averages[trade.name][area] = Math.round(total / listings.length);
      }
    });
  });
  
  return averages;
}
