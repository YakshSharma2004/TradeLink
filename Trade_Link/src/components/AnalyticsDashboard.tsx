import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, TrendingUp, DollarSign, MapPin, Briefcase } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TradeType } from '../types';
import { tradeTypes, serviceAreas, mockTradeListings } from '../lib/mockData';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [selectedTrade, setSelectedTrade] = useState<TradeType>('Framing');

  // Calculate statistics
  const totalListings = mockTradeListings.length;
  const uniqueTradesmen = new Set(mockTradeListings.map(l => l.tradesmanId)).size;
  const averageRate = Math.round(
    mockTradeListings.reduce((sum, l) => sum + l.rate, 0) / totalListings
  );
  const averageExperience = Math.round(
    mockTradeListings.reduce((sum, l) => sum + l.experience, 0) / totalListings
  );

  // Data for charts
  const ratesByTrade = tradeTypes.map(trade => {
    const tradeListings = mockTradeListings.filter(l => l.tradeType === trade.name);
    const avgRate = tradeListings.length > 0
      ? Math.round(tradeListings.reduce((sum, l) => sum + l.rate, 0) / tradeListings.length)
      : 0;
    return {
      trade: trade.name,
      avgRate,
      count: tradeListings.length,
    };
  }).filter(d => d.count > 0);

  const ratesByArea = serviceAreas.map(area => {
    const areaListings = mockTradeListings.filter(l => l.serviceAreas.includes(area));
    const avgRate = areaListings.length > 0
      ? Math.round(areaListings.reduce((sum, l) => sum + l.rate, 0) / areaListings.length)
      : 0;
    return {
      area: `${area} Calgary`,
      avgRate,
      count: areaListings.length,
    };
  });

  const experienceDistribution = [
    { range: '0-5 years', count: mockTradeListings.filter(l => l.experience <= 5).length },
    { range: '6-10 years', count: mockTradeListings.filter(l => l.experience > 5 && l.experience <= 10).length },
    { range: '11-15 years', count: mockTradeListings.filter(l => l.experience > 10 && l.experience <= 15).length },
    { range: '16-20 years', count: mockTradeListings.filter(l => l.experience > 15 && l.experience <= 20).length },
    { range: '20+ years', count: mockTradeListings.filter(l => l.experience > 20).length },
  ].filter(d => d.count > 0);

  const tradeDistribution = tradeTypes.map(trade => ({
    name: trade.name,
    value: mockTradeListings.filter(l => l.tradeType === trade.name).length,
  })).filter(d => d.value > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  // Detailed trade analysis
  const tradeDetails = mockTradeListings.filter(l => l.tradeType === selectedTrade);
  const tradeAvgRate = tradeDetails.length > 0
    ? Math.round(tradeDetails.reduce((sum, l) => sum + l.rate, 0) / tradeDetails.length)
    : 0;
  const tradeAvgExp = tradeDetails.length > 0
    ? Math.round(tradeDetails.reduce((sum, l) => sum + l.experience, 0) / tradeDetails.length)
    : 0;

  const areaComparison = serviceAreas.map(area => {
    const areaTradeListings = tradeDetails.filter(l => l.serviceAreas.includes(area));
    return {
      area: `${area}`,
      avgRate: areaTradeListings.length > 0
        ? Math.round(areaTradeListings.reduce((sum, l) => sum + l.rate, 0) / areaTradeListings.length)
        : 0,
      count: areaTradeListings.length,
    };
  }).filter(d => d.count > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl text-slate-900 mt-2">Market Analytics</h1>
          <p className="text-slate-600">
            Real-time insights into Calgary's construction trade market
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Listings</CardDescription>
              <CardTitle className="text-3xl">{totalListings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Active marketplace
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Tradesmen</CardDescription>
              <CardTitle className="text-3xl">{uniqueTradesmen}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <Briefcase className="h-4 w-4 mr-1" />
                Registered users
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Rate</CardDescription>
              <CardTitle className="text-3xl">${averageRate}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <DollarSign className="h-4 w-4 mr-1" />
                Across all trades
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Experience</CardDescription>
              <CardTitle className="text-3xl">{averageExperience}y</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="h-4 w-4 mr-1" />
                Years in trade
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trade Analysis</TabsTrigger>
            <TabsTrigger value="areas">Area Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Average Rates by Trade</CardTitle>
                  <CardDescription>Compare rates across different trades</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ratesByTrade}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="trade"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgRate" fill="#3b82f6" name="Avg Rate ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Listings by Area</CardTitle>
                  <CardDescription>Distribution across Calgary quadrants</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ratesByArea}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="area" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" name="Listings" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experience Distribution</CardTitle>
                  <CardDescription>Years of experience among tradesmen</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={experienceDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" name="Tradesmen" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trade Category Distribution</CardTitle>
                  <CardDescription>Most popular trade categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tradeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tradeDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trade-Specific Analysis</CardTitle>
                <CardDescription>
                  Detailed insights for a specific trade category
                </CardDescription>
                <div className="mt-4">
                  <Select value={selectedTrade} onValueChange={(value: TradeType) => setSelectedTrade(value)}>
                    <SelectTrigger className="w-64">
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
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">Active Listings</p>
                    <p className="text-2xl text-slate-900">{tradeDetails.length}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">Average Rate</p>
                    <p className="text-2xl text-slate-900">${tradeAvgRate}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">Avg Experience</p>
                    <p className="text-2xl text-slate-900">{tradeAvgExp} years</p>
                  </div>
                </div>

                {areaComparison.length > 0 && (
                  <div>
                    <h3 className="mb-4">Rate Comparison by Area</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={areaComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="area" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgRate" fill="#3b82f6" name="Avg Rate ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="areas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Area Comparison</CardTitle>
                <CardDescription>
                  Compare rates and availability across Calgary quadrants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={ratesByArea}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgRate" fill="#3b82f6" name="Avg Rate ($)" />
                    <Bar yAxisId="right" dataKey="count" fill="#10b981" name="Listings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
