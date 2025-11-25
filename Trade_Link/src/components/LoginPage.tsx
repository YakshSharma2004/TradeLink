import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Hammer } from 'lucide-react';
import { UserRole } from '../types';
import { login } from '../lib/api';

interface LoginPageProps {
  onLogin: (role: UserRole, email: string, name: string) => void;
  onNavigateToSignup: () => void;
}

export function LoginPage({ onLogin, onNavigateToSignup }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('builder');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt for:', email);

    try {
      // Call the API to verify user exists and matches role
      const user = await login({ email, role: selectedRole });

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Call parent's onLogin with the data from API
      onLogin(user.role, user.email, user.name);
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. User not found.');
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-construction rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trade Link</h1>
            </div>
            <p className="text-slate-500 font-medium">
              Connect with Calgary's construction community
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="bg-slate-100 rounded-xl p-1 flex gap-1 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('builder')}
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${selectedRole === 'builder'
                ? 'bg-white shadow-sm'
                : 'hover:bg-slate-50'
                }`}
            >
              Builder Login
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('tradesman')}
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${selectedRole === 'tradesman'
                ? 'bg-white shadow-sm'
                : 'hover:bg-slate-50'
                }`}
            >
              Tradesman Login
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('other')}
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${selectedRole === 'other'
                ? 'bg-white shadow-sm'
                : 'hover:bg-slate-50'
                }`}
            >
              Other
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-slate-900">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 bg-slate-50 border-slate-200"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-900">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-slate-50 border-slate-200"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 py-6 text-base"
            >
              Login as {selectedRole === 'builder' ? 'Builder' : selectedRole === 'tradesman' ? 'Tradesman' : 'Guest'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-slate-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-slate-900 hover:underline"
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
