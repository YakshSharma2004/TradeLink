import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Hammer, TrendingDown, Layers, Home, Droplet, Zap,
  Flame, Triangle, Square, Warehouse, Sparkles,
  Grid3x3, RectangleHorizontal, DoorClosed, Trees,
  BarChart3, MessageSquare, User, Loader2
} from 'lucide-react';
import { TradeType, TradeListing } from '../types';
import { getTradeListings } from '../lib/api';

interface BuilderDashboardProps {
  onSelectTrade: (trade: TradeType) => void;
  onNavigate: (view: 'analytics' | 'chat' | 'profile') => void;
  userName: string;
}

export function BuilderDashboard({ onSelectTrade, onNavigate, userName }: BuilderDashboardProps) {
  const [tradeListings, setTradeListings] = useState<TradeListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const listings = await getTradeListings();
        setTradeListings(listings);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch trade listings:', err);
        setError('Failed to load trade listings');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const tradeCards = [
    { name: 'Demolition' as TradeType, icon: Hammer, color: 'bg-gray-800' },
    { name: 'Foundation Grader' as TradeType, icon: TrendingDown, color: 'bg-gray-700' },
    { name: 'Foundation Pouring' as TradeType, icon: Layers, color: 'bg-gray-600' },
    { name: 'Framing' as TradeType, icon: Home, color: 'bg-gray-800' },
    { name: 'Plumber' as TradeType, icon: Droplet, color: 'bg-gray-700' },
    { name: 'Electrician' as TradeType, icon: Zap, color: 'bg-gray-600' },
    { name: 'Heating' as TradeType, icon: Flame, color: 'bg-gray-800' },
    { name: 'Roofing' as TradeType, icon: Triangle, color: 'bg-gray-700' },
    { name: 'Drywall' as TradeType, icon: Square, color: 'bg-gray-600' },
    { name: 'Siding' as TradeType, icon: Warehouse, color: 'bg-gray-800' },
    { name: 'Finisher' as TradeType, icon: Sparkles, color: 'bg-gray-700' },
    { name: 'Tile/Floor' as TradeType, icon: Grid3x3, color: 'bg-gray-600' },
    { name: 'Counter' as TradeType, icon: RectangleHorizontal, color: 'bg-gray-800' },
    { name: 'Fireplace' as TradeType, icon: Flame, color: 'bg-gray-700' },
    { name: 'Door and Window' as TradeType, icon: DoorClosed, color: 'bg-gray-600' },
    { name: 'Lumber' as TradeType, icon: Trees, color: 'bg-gray-800' },
  ];

  const getTradeCount = (tradeName: TradeType) => {
    return tradeListings.filter(listing => listing.tradeType === tradeName).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading trade listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Header */}
      <header className="bg-gradient-construction border-b border-white/10 sticky top-0 z-10 shadow-lg shadow-gray-900/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Trade Link</h1>
            <p className="text-white/90">Welcome back, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="hover-lift" onClick={() => onNavigate('analytics')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="secondary" className="hover-lift" onClick={() => onNavigate('chat')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button variant="secondary" className="hover-lift" onClick={() => onNavigate('profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h2 className="text-3xl font-bold mb-2 text-slate-900">Find Tradesmen by Category</h2>
          <p className="text-lg text-slate-600">
            Browse available tradesmen across Calgary's construction sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tradeCards.map((trade, index) => {
            const Icon = trade.icon;
            const count = getTradeCount(trade.name);
            const delayClass = `animate-delay-${Math.min(index * 100, 400)}`;

            return (
              <Card
                key={trade.name}
                className={`cursor-pointer hover-lift hover-glow transition-all duration-300 animate-slide-up ${delayClass} border-l-4 border-l-transparent hover:border-l-gray-500`}
                onClick={() => onSelectTrade(trade.name)}
              >
                <CardHeader className="pb-3">
                  <div className={`${trade.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{trade.name}</CardTitle>
                  <CardDescription>
                    {count} {count === 1 ? 'tradesman' : 'tradesmen'} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="default" className="w-full bg-gradient-construction hover:opacity-90" size="sm">
                    View Listings
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="hover-scale animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Calgary Service Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gradient-construction text-white">NE Calgary</Badge>
                <Badge className="bg-gradient-construction text-white">NW Calgary</Badge>
                <Badge className="bg-gradient-construction text-white">SE Calgary</Badge>
                <Badge className="bg-gradient-construction text-white">SW Calgary</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in animate-delay-100">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Rate Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Compare rates across different tradesmen and service areas to make informed decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in animate-delay-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Direct Communication</CardTitle>
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
