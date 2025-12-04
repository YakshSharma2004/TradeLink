import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

interface ModeToggleProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export function ModeToggle({ theme, toggleTheme }: ModeToggleProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 w-full h-full transition-all duration-500 ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 text-amber-500'
                        }`}
                />
                <Moon
                    className={`absolute inset-0 w-full h-full transition-all duration-500 ${theme === 'light' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 text-blue-400'
                        }`}
                />
            </div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
