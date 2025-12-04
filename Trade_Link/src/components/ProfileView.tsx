import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, User, Mail, Phone, Briefcase, Edit2, Save } from 'lucide-react';
import { UserRole } from '../types';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Project, getProjects, deleteProject } from '../lib/api';
import { ProjectCard } from './ProjectCard';
import { AddProjectDialog } from './AddProjectDialog';

interface ProfileViewProps {
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userId: string;
  onBack: () => void;
}

export function ProfileView({ userName, userEmail, userRole, userId, onBack }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState('403-555-0000');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadProjects();
  }, [userId]);

  const loadProjects = async () => {
    try {
      const data = await getProjects(userId);
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(userName);
    setEmail(userEmail);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl text-foreground mt-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
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
                      {name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{name}</CardTitle>
                    <CardDescription className="text-base capitalize">
                      {userRole}
                    </CardDescription>
                  </div>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Tabs for Personal Info and Projects */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Personal Information</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {isEditing ? (
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-foreground">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-foreground">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {isEditing ? (
                          <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-foreground">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {userRole === 'tradesman' && (
                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <div className="flex items-center gap-2 mt-2">
                          {isEditing ? (
                            <Input
                              id="experience"
                              type="number"
                              placeholder="0"
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-foreground">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span>{experience || 'Not specified'} years</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {userRole === 'builder' && (
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <div className="flex items-center gap-2 mt-2">
                          {isEditing ? (
                            <Input
                              id="company"
                              placeholder="Your company"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-foreground">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span>{company || 'Not specified'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <div className="mt-2">
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                        />
                      ) : (
                        <p className="text-foreground p-3 bg-muted/50 rounded-md">
                          {bio || 'No bio added yet'}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Your Projects</h2>
                    <p className="text-muted-foreground">Showcase your best work</p>
                  </div>
                  <AddProjectDialog userId={userId} onProjectAdded={loadProjects} />
                </div>

                {projects.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
                      <p className="text-muted-foreground mb-4">Start building your portfolio by adding your first project.</p>
                      <AddProjectDialog userId={userId} onProjectAdded={loadProjects} />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        showDelete={true}
                        onDelete={async (id) => {
                          if (!confirm('Are you sure you want to delete this project?')) return;
                          try {
                            await deleteProject(id);
                            loadProjects();
                            toast.success('Project deleted');
                          } catch (err) {
                            toast.error('Failed to delete project');
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-foreground">Account Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your listings</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-foreground">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-500">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-black rounded-lg">
                <div>
                  <p className="text-red-900 dark:text-red-200">Delete Account</p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/50">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
