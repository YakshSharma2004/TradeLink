import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Hammer } from 'lucide-react';
import { UserRole } from '../types';
import { login } from '../lib/api';
import { gradients, hoverLift } from '../lib/styles';
import Squares from './ui/Squares';

const styles = {
  container: "min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden",
  card: "w-full max-w-xl bg-card rounded-3xl shadow-xl p-8 border border-border relative z-10",
  header: {
    wrapper: "mb-8",
    iconContainer: `w-12 h-12 ${gradients.construction} rounded-xl flex items-center justify-center shadow-lg shadow-primary/10`,
    title: "text-3xl font-bold text-foreground tracking-tight",
    subtitle: "text-muted-foreground font-medium"
  },
  roleButton: (isActive: boolean) =>
    `flex-1 py-3 px-4 rounded-lg transition-all ${isActive
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'}`,
  form: {
    label: "text-foreground",
    input: "mt-2 bg-input-background text-foreground border-input focus:border-ring focus:ring-1 focus:ring-ring",
    submitButton: `w-full bg-primary hover:bg-primary/90 py-6 text-base text-primary-foreground ${hoverLift}`
  },
  signupLink: {
    text: "text-center mt-6 text-muted-foreground",
    button: "text-foreground hover:underline"
  }
};

interface LoginPageProps {
  onLogin: (role: UserRole, email: string, name: string, id?: string) => void;
  onNavigateToSignup: () => void;
}

export function LoginPage({ onLogin, onNavigateToSignup }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('builder');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt for:', email);

    try {
      // Call the API to verify user exists and matches role
      const user = await login({ email, role: selectedRole, password });

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Call parent's onLogin with the data from API
      onLogin(user.role, user.email, user.name, user.id);
    } catch (err: any) {
      console.error('Login failed:', err);

      const errorMessage = err.message || 'Login failed';

      if (errorMessage.includes('Account not found')) {
        toast.error('No account found with this email');
      } else if (errorMessage.includes('Incorrect password')) {
        toast.error('Incorrect password');
      } else if (errorMessage.includes('Please login as')) {
        toast.error(errorMessage);
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network request failed')) {
        toast.error('Unable to connect to server. Please check your internet connection.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };


  return (
    <div className={styles.container}>
      <div className="absolute inset-0 z-0 hidden dark:block">
        <Squares
          speed={0.5}
          squareSize={30}
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#383cafff'
        />
      </div>
      <div className="w-full max-w-xl relative z-10">
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header.wrapper}>
            <div className="flex items-center gap-3 mb-4">
              <div className={styles.header.iconContainer}>
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <h1 className={styles.header.title}>Trade Link</h1>
            </div>
            <p className={styles.header.subtitle}>
              Connect with Calgary's construction community
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="bg-muted rounded-xl p-1 flex gap-1 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('builder')}
              className={styles.roleButton(selectedRole === 'builder')}
            >
              Builder Login
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('tradesman')}
              className={styles.roleButton(selectedRole === 'tradesman')}
            >
              Tradesman Login
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('other')}
              className={styles.roleButton(selectedRole === 'other')}
            >
              Other
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className={styles.form.label}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.form.input}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className={styles.form.label}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.form.input}
                required
              />
            </div>

            <Button
              type="submit"
              className={styles.form.submitButton}
            >
              Login as {selectedRole === 'builder' ? 'Builder' : selectedRole === 'tradesman' ? 'Tradesman' : 'Guest'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className={styles.signupLink.text}>
            Don't have an account?{' '}
            <button
              type="button"
              className={styles.signupLink.button}
              onClick={() => {
                console.log('Sign up clicked!');
                onNavigateToSignup();
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
