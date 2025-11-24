import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { ArrowLeft, MapPin, Clock, Mail, Phone, MessageSquare, DollarSign } from 'lucide-react';
import { TradeType, ServiceArea } from '../types';
import { mockTradeListings, serviceAreas } from '../lib/mockData';

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

  const filteredListings = useMemo(() => {
    return mockTradeListings.filter(listing => {
      if (listing.tradeType !== tradeType) return false;
      if (selectedArea !== 'all' && !listing.serviceAreas.includes(selectedArea)) return false;
      if (listing.rate > maxRate) return false;
      if (listing.experience < minExperience) return false;
      return true;
    });
  }, [tradeType, selectedArea, maxRate, minExperience]);

  const averageRate = useMemo(() => {
    if (filteredListings.length === 0) return 0;
    const total = filteredListings.reduce((sum, listing) => sum + listing.rate, 0);
    return Math.round(total / filteredListings.length);
  }, [filteredListings]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-slate-900">{tradeType}</h1>
              <p className="text-slate-600">
                {filteredListings.length} {filteredListings.length === 1 ? 'tradesman' : 'tradesmen'} found
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Average Rate</p>
              <p className="text-2xl text-slate-900">${averageRate}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
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
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-600">
                    No tradesmen found matching your criteria. Try adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{listing.tradesmanName}</CardTitle>
                        <CardDescription>{listing.tradeType}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-slate-900">
                          <DollarSign className="h-5 w-5" />
                          <span className="text-2xl">{listing.rate}</span>
                        </div>
                        <p className="text-xs text-slate-600">{listing.rateUnit}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">{listing.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
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
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
