import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash2, DollarSign, BarChart3, MessageSquare, User, Loader2 } from 'lucide-react';
import { TradeType, ServiceArea, TradeListing } from '../types';
import { tradeTypes, serviceAreas } from '../lib/mockData';
import { getTradeListings, createTradeListing, updateTradeListing, deleteTradeListing } from '../lib/api';
import { toast } from 'sonner';

interface TradesmanDashboardProps {
  userName: string;
  userId: string;
  onNavigate: (view: 'analytics' | 'chat' | 'profile') => void;
}

export function TradesmanDashboard({ userName, userId, onNavigate }: TradesmanDashboardProps) {
  const [myListings, setMyListings] = useState<TradeListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<TradeListing | null>(null);

  // Form state
  const [tradeType, setTradeType] = useState<TradeType>('Framing');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState<'per hour' | 'per sq ft' | 'per linear ft' | 'per project'>('per hour');
  const [selectedAreas, setSelectedAreas] = useState<ServiceArea[]>([]);
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchListings();
  }, [userId]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const listings = await getTradeListings({ tradesmanId: userId });
      setMyListings(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleAreaToggle = (area: ServiceArea) => {
    setSelectedAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rate || !experience || selectedAreas.length === 0 || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const listingData = {
        tradesmanId: userId,
        tradesmanName: userName,
        tradeType,
        rate: parseFloat(rate),
        rateUnit,
        serviceAreas: selectedAreas,
        experience: parseInt(experience),
        description,
        phone: '403-555-0000', // In a real app, fetch from user profile
        email: 'user@example.com', // In a real app, fetch from user profile
      };

      if (editingListing) {
        const updated = await updateTradeListing(editingListing.id, listingData);
        setMyListings(prev => prev.map(l => l.id === editingListing.id ? updated : l));
        toast.success('Listing updated successfully');
      } else {
        const created = await createTradeListing(listingData);
        setMyListings(prev => [...prev, created]);
        toast.success('Listing created successfully');
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error('Failed to save listing');
    }
  };

  const handleEdit = (listing: TradeListing) => {
    setEditingListing(listing);
    setTradeType(listing.tradeType);
    setRate(listing.rate.toString());
    setRateUnit(listing.rateUnit);
    setSelectedAreas(listing.serviceAreas);
    setExperience(listing.experience.toString());
    setDescription(listing.description);
    setIsDialogOpen(true);
  };

  const handleDelete = async (listingId: string) => {
    try {
      await deleteTradeListing(listingId);
      setMyListings(prev => prev.filter(l => l.id !== listingId));
      toast.success('Listing deleted');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const resetForm = () => {
    setEditingListing(null);
    setTradeType('Framing');
    setRate('');
    setRateUnit('per hour');
    setSelectedAreas([]);
    setExperience('');
    setDescription('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl text-slate-900">{myListings.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(myListings.flatMap(l => l.serviceAreas))).map(area => (
                  <Badge key={area} variant="secondary">{area}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trade Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl text-slate-900">
                {new Set(myListings.map(l => l.tradeType)).size}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Listings Management */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-slate-900">My Listings</h2>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingListing ? 'Edit Listing' : 'Create New Listing'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for your trade listing
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tradeType">Trade Type</Label>
                  <Select value={tradeType} onValueChange={(value: TradeType) => setTradeType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tradeTypes.map(trade => (
                        <SelectItem key={trade.name} value={trade.name}>
                          {trade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rate">Rate</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rateUnit">Rate Unit</Label>
                    <Select value={rateUnit} onValueChange={(value: any) => setRateUnit(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per hour">Per Hour</SelectItem>
                        <SelectItem value="per sq ft">Per Sq Ft</SelectItem>
                        <SelectItem value="per linear ft">Per Linear Ft</SelectItem>
                        <SelectItem value="per project">Per Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Service Areas</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {serviceAreas.map(area => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={selectedAreas.includes(area)}
                          onCheckedChange={() => handleAreaToggle(area)}
                        />
                        <label htmlFor={area} className="text-sm cursor-pointer">
                          {area} Calgary
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your services..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingListing ? 'Update Listing' : 'Create Listing'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Listings Grid */}
        {myListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600 mb-4">You haven't created any listings yet.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {myListings.map(listing => (
              <Card key={listing.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{listing.tradeType}</CardTitle>
                      <CardDescription>
                        Posted {new Date(listing.createdAt).toLocaleDateString()}
                      </CardDescription>
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

                  <div className="flex flex-wrap gap-2">
                    {listing.serviceAreas.map(area => (
                      <Badge key={area} variant="secondary">{area}</Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleEdit(listing)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
