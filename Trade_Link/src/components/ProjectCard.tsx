import { Project } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Calendar } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
    onDelete?: (id: string) => void;
    showDelete?: boolean;
}

export function ProjectCard({ project, onDelete, showDelete }: ProjectCardProps) {
    return (
        <Card className="overflow-hidden">
            {project.images && project.images.length > 0 && (
                <div className="aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        {project.completionDate && (
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(project.completionDate).toLocaleDateString()}
                            </CardDescription>
                        )}
                    </div>
                    {showDelete && onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2"
                            onClick={() => onDelete(project.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-600 line-clamp-3">
                    {project.description}
                </p>
            </CardContent>
        </Card>
    );
}
