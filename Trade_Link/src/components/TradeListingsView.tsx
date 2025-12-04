import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { ArrowLeft, MapPin, Clock, Mail, Phone, MessageSquare, DollarSign } from 'lucide-react';
import { TradeType, ServiceArea, TradeListing } from '../types';
import { serviceAreas } from '../lib/mockData';
import { getTradeListings } from '../lib/api';

interface TradeListingsViewProps {
  tradeType: TradeType;
  onBack: () => void;
  onOpenChat: (tradesmanId: string, tradesmanName: string) => void;
}

export function TradeListingsView({
  tradeType,
  onBack,
  onOpenChat
}: TradeListingsViewProps) {
  const [selectedArea, setSelectedArea] = useState<ServiceArea | 'all'>('all');
  const [maxRate, setMaxRate] = useState<number>(200);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [allListings, setAllListings] = useState<TradeListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const listings = await getTradeListings({ tradeType });
        setAllListings(listings);
      } catch (err) {
        console.error('Failed to fetch trade listings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tradeType]);

  const filteredListings = useMemo(() => {
    return allListings.filter(listing => {
      if (selectedArea !== 'all' && !listing.serviceAreas.includes(selectedArea)) return false;
      if (listing.rate > maxRate) return false;
      if (listing.experience < minExperience) return false;
      return true;
    });
  }, [allListings, selectedArea, maxRate, minExperience]);

  const averageRate = useMemo(() => {
    if (filteredListings.length === 0) return 0;
    const total = filteredListings.reduce((sum, listing) => sum + listing.rate, 0);
    return Math.round(total / filteredListings.length);
  }, [filteredListings]);

  return (

    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="outline" onClick={onBack} className="mb-2 hover-lift">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div className="animate-slide-up">
              <h1 className="text-3xl font-bold text-foreground drop-shadow-sm">{tradeType}</h1>
              <p className="text-muted-foreground">
                {filteredListings.length} {filteredListings.length === 1 ? 'tradesman' : 'tradesmen'} found
              </p>
            </div>
            <div className="text-right animate-slide-up animate-delay-100">
              <p className="text-sm text-muted-foreground">Average Rate</p>
              <p className="text-3xl font-bold text-foreground drop-shadow-sm">${averageRate}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 animate-fade-in shadow-steel">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine your search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Service Area</Label>
                  <Select value={selectedArea} onValueChange={(value: any) => setSelectedArea(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      {serviceAreas.map(area => (
                        <SelectItem key={area} value={area}>{area} Calgary</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Max Rate: ${maxRate}</Label>
                  <Slider
                    value={[maxRate]}
                    onValueChange={(value) => setMaxRate(value[0])}
                    min={0}
                    max={200}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Min Experience: {minExperience} years</Label>
                  <Slider
                    value={[minExperience]}
                    onValueChange={(value) => setMinExperience(value[0])}
                    min={0}
                    max={25}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedArea('all');
                    setMaxRate(200);
                    setMinExperience(0);
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Listings */}
          <div className="lg:col-span-3 space-y-4">
            {filteredListings.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No tradesmen found matching your criteria. Try adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredListings.map((listing, index) => {
                const delayClass = `animate-delay-${Math.min(index * 100, 400)}`;
                return (
                  <Card key={listing.id} className={`hover-lift hover-glow transition-all animate-slide-up ${delayClass} border-l-4 border-l-transparent hover:border-l-orange-500`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{listing.tradesmanName}</CardTitle>
                          <CardDescription>{listing.tradeType}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-foreground">
                            <DollarSign className="h-5 w-5" />
                            <span className="text-2xl">{listing.rate}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{listing.rateUnit}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{listing.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{listing.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {listing.serviceAreas.map((area) => (
                              <Badge key={area} variant="secondary" className="ml-1">
                                {area}
                              </Badge>
                            ))}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => onOpenChat(listing.tradesmanId, listing.tradesmanName)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            window.location.href = `mailto:${listing.email}?subject=Inquiry about ${listing.tradeType} services`;
                          }}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            window.location.href = `tel:${listing.phone}`;
                          }}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
