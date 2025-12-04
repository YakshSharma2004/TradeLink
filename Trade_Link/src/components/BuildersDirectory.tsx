import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Loader2, Search, Briefcase, User } from 'lucide-react';
import { Input } from './ui/input';
import { User as UserType } from '../types';
import { getUsers } from '../lib/api';
import { PublicProfileView } from './PublicProfileView';

interface BuildersDirectoryProps {
    onBack: () => void;
    onChat: (recipientId: string, recipientName: string) => void;
}

export function BuildersDirectory({ onBack, onChat }: BuildersDirectoryProps) {
    const [builders, setBuilders] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBuilderId, setSelectedBuilderId] = useState<string | null>(null);

    useEffect(() => {
        fetchBuilders();
    }, [searchQuery]);

    const fetchBuilders = async () => {
        try {
            setLoading(true);
            // Filter by role 'builder' at the database level
            const data = await getUsers({ role: 'builder', search: searchQuery });
            setBuilders(data);
        } catch (error) {
            console.error('Failed to fetch builders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (selectedBuilderId) {
        return (
            <PublicProfileView
                userId={selectedBuilderId}
                onBack={() => setSelectedBuilderId(null)}
                onChat={onChat}
            />
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Builders Directory</h2>
                    <p className="text-muted-foreground">Connect with top construction companies and builders</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search builders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : builders.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <User className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No builders found</h3>
                        <p className="text-muted-foreground">Try adjusting your search terms.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {builders.map((builder) => (
                        <Card key={builder.id} className="hover-lift transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>
                                        {builder.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                    <CardTitle className="text-lg truncate">{builder.name}</CardTitle>
                                    <CardDescription className="truncate flex items-center gap-1">
                                        <Briefcase className="h-3 w-3" />
                                        Builder
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {/* Placeholder for bio/company description since it's not in UserType yet */}
                                        Professional builder based in Calgary. View profile to see completed projects and contact information.
                                    </p>
                                    <Button
                                        className="w-full"
                                        variant="secondary"
                                        onClick={() => setSelectedBuilderId(builder.id)}
                                    >
                                        View Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
