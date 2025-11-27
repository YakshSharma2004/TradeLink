import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Hammer } from 'lucide-react';
import { UserRole } from '../types';
import { login } from '../lib/api';
import { gradients, hoverLift } from '../lib/styles';

const styles = {
  container: "min-h-screen bg-slate-50 flex items-center justify-center p-4 dark:bg-slate-950",
  card: "w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 border border-slate-100 dark:bg-slate-900 dark:border-slate-800",
  header: {
    wrapper: "mb-8",
    iconContainer: `w-12 h-12 ${gradients.construction} rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/10`,
    title: "text-3xl font-bold text-slate-900 tracking-tight dark:text-white",
    subtitle: "text-slate-500 font-medium dark:text-slate-400"
  },
  roleButton: (isActive: boolean) =>
    `flex-1 py-3 px-4 rounded-lg transition-all ${isActive
      ? 'bg-white shadow-sm dark:bg-slate-800 dark:text-white'
      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-400'}`,
  form: {
    label: "text-slate-900 dark:text-slate-200",
    input: "mt-2 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white",
    submitButton: `w-full bg-slate-900 hover:bg-slate-800 py-6 text-base dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 ${hoverLift}`
  },
  signupLink: {
    text: "text-center mt-6 text-slate-600 dark:text-slate-400",
    button: "text-slate-900 hover:underline dark:text-white"
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
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. User not found.');
    }
  };


  return (
    <div className={styles.container}>
      <div className="w-full max-w-xl">
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
          <div className="bg-slate-100 rounded-xl p-1 flex gap-1 mb-6 dark:bg-slate-800/50">
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
