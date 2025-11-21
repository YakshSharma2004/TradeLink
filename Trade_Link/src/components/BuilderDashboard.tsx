import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Hammer, TrendingDown, Layers, Home, Droplet, Zap, 
  Flame, Triangle, Square, Warehouse, Sparkles, 
  Grid3x3, RectangleHorizontal, DoorClosed, Trees,
  BarChart3, MessageSquare, User
} from 'lucide-react';
import { TradeType } from '../types';
import { mockTradeListings } from '../lib/mockData';

interface BuilderDashboardProps {
  onSelectTrade: (trade: TradeType) => void;
  onNavigate: (view: 'analytics' | 'chat' | 'profile') => void;
  userName: string;
}

export function BuilderDashboard({ onSelectTrade, onNavigate, userName }: BuilderDashboardProps) {
  const tradeCards = [
    { name: 'Demolition' as TradeType, icon: Hammer, color: 'bg-red-500' },
    { name: 'Foundation Grader' as TradeType, icon: TrendingDown, color: 'bg-amber-600' },
    { name: 'Foundation Pouring' as TradeType, icon: Layers, color: 'bg-stone-600' },
    { name: 'Framing' as TradeType, icon: Home, color: 'bg-yellow-600' },
    { name: 'Plumber' as TradeType, icon: Droplet, color: 'bg-blue-500' },
    { name: 'Electrician' as TradeType, icon: Zap, color: 'bg-yellow-500' },
    { name: 'Heating' as TradeType, icon: Flame, color: 'bg-orange-500' },
    { name: 'Roofing' as TradeType, icon: Triangle, color: 'bg-slate-700' },
    { name: 'Drywall' as TradeType, icon: Square, color: 'bg-gray-400' },
    { name: 'Siding' as TradeType, icon: Warehouse, color: 'bg-indigo-500' },
    { name: 'Finisher' as TradeType, icon: Sparkles, color: 'bg-purple-500' },
    { name: 'Tile/Floor' as TradeType, icon: Grid3x3, color: 'bg-teal-500' },
    { name: 'Counter' as TradeType, icon: RectangleHorizontal, color: 'bg-cyan-600' },
    { name: 'Fireplace' as TradeType, icon: Flame, color: 'bg-red-600' },
    { name: 'Door and Window' as TradeType, icon: DoorClosed, color: 'bg-blue-600' },
    { name: 'Lumber' as TradeType, icon: Trees, color: 'bg-green-700' },
  ];

  const getTradeCount = (tradeName: TradeType) => {
    return mockTradeListings.filter(listing => listing.tradeType === tradeName).length;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-slate-900">Trade Link</h1>
            <p className="text-slate-600">Welcome back, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('analytics')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="outline" onClick={() => onNavigate('chat')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button variant="outline" onClick={() => onNavigate('profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl mb-2 text-slate-900">Find Tradesmen by Category</h2>
          <p className="text-slate-600">
            Browse available tradesmen across Calgary's construction sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tradeCards.map((trade) => {
            const Icon = trade.icon;
            const count = getTradeCount(trade.name);
            
            return (
              <Card
                key={trade.name}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => onSelectTrade(trade.name)}
              >
                <CardHeader className="pb-3">
                  <div className={`${trade.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{trade.name}</CardTitle>
                  <CardDescription>
                    {count} {count === 1 ? 'tradesman' : 'tradesmen'} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full" size="sm">
                    View Listings
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calgary Service Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">NE Calgary</Badge>
                <Badge variant="secondary">NW Calgary</Badge>
                <Badge variant="secondary">SE Calgary</Badge>
                <Badge variant="secondary">SW Calgary</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rate Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Compare rates across different tradesmen and service areas to make informed decisions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Direct Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Connect with tradesmen through in-app chat or email to discuss your project needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
