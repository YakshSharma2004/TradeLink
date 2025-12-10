import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Mail, Phone, Briefcase } from 'lucide-react';
import { User as UserType } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Project, getProjects, getUser } from '../lib/api';
import { ProjectCard } from './ProjectCard';

import { MessageSquare } from 'lucide-react';

interface PublicProfileViewProps {
    userId: string;
    initialUserData?: UserType;
    onBack: () => void;
    onChat: (recipientId: string, recipientName: string) => void;
}

export function PublicProfileView({ userId, initialUserData, onBack, onChat }: PublicProfileViewProps) {
    const [user, setUser] = useState<UserType | null>(initialUserData || null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(!initialUserData);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                let currentUser = user;
                // Load user data if not provided
                if (!currentUser) {
                    currentUser = await getUser(userId);
                    setUser(currentUser);
                }
                // Always load projects
                const projectData = await getProjects(userId);
                console.log('PublicProfileView - Loaded User:', currentUser);
                console.log('PublicProfileView - Loaded Projects:', projectData);
                setProjects(projectData);
            } catch (error) {
                console.error('Failed to load profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">User not found</p>
                    <Button onClick={onBack}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background animate-fade-in">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Directory
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Profile Header Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarFallback className="text-2xl">
                                            {user.firstName ? user.firstName[0] : ''}{user.lastName ? user.lastName[0] : ''}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
                                        <CardDescription className="text-base capitalize">
                                            {user.role}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button onClick={() => onChat(user.id, `${user.firstName} ${user.lastName}`)}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Chat
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Tabs for Personal Info and Projects */}
                    <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="info">About</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                                            <div className="flex items-center gap-2 mt-1 text-foreground">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{user.email}</span>
                                            </div>
                                        </div>

                                        {user.phone && (
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                                <div className="flex items-center gap-2 mt-1 text-foreground">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span>{user.phone}</span>
                                                </div>
                                            </div>
                                        )}

                                        {user.role === 'builder' && (
                                            <div className="col-span-2">
                                                <p className="text-sm font-medium text-muted-foreground">Company</p>
                                                <div className="flex items-center gap-2 mt-1 text-foreground">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                    <span>{user.firstName} {user.lastName}'s Construction Co.</span> {/* Placeholder as company isn't in User type yet */}
                                                </div>
                                            </div>
                                        )}

                                        {user.role === 'tradesman' && (
                                            <>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Trade</p>
                                                    <div className="flex items-center gap-2 mt-1 text-foreground">
                                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                        {/* We might need to fetch specific trade info if not in user object, 
                                                            but for now let's assume it might be available or generic */}
                                                        <span className="capitalize">Skilled Tradesman</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Experience</p>
                                                    <div className="flex items-center gap-2 mt-1 text-foreground">
                                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                        <span>Experienced</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="projects">
                            <div className="space-y-6">
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-foreground">Project Portfolio</h2>
                                    <p className="text-muted-foreground">Recent work and completed projects</p>
                                </div>

                                {projects.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium text-foreground">No projects listed</h3>
                                            <p className="text-muted-foreground">This builder hasn't added any projects yet.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {projects.map(project => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                showDelete={false} // Read-only mode
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
