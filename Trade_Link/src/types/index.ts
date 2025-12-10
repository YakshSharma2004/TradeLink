export type UserRole = 'builder' | 'tradesman' | 'other';

export type ServiceArea = 'NE' | 'NW' | 'SE' | 'SW';

export type TradeType =
  | 'Demolition'
  | 'Foundation Grader'
  | 'Foundation Pouring'
  | 'Framing'
  | 'Plumber'
  | 'Electrician'
  | 'Heating'
  | 'Roofing'
  | 'Drywall'
  | 'Siding'
  | 'Finisher'
  | 'Tile/Floor'
  | 'Counter'
  | 'Fireplace'
  | 'Door and Window'
  | 'Lumber';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  experience?: number;
  bio?: string;
  createdAt: Date;
}

export interface TradeListing {
  id: string;
  tradesmanId: string;
  tradesmanName: string;
  tradeType: TradeType;
  rate: number;
  rateUnit: 'per hour' | 'per sq ft' | 'per linear ft' | 'per project';
  serviceAreas: ServiceArea[];
  experience: number;
  description: string;
  phone: string;
  email: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatConversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}
