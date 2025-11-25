import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Hammer, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface SignUpPageProps {
    onSignup: (role: UserRole, email: string, name: string, phone?: string) => void;
    onBackToLogin: () => void;
}

export function SignUpPage({ onSignup, onBackToLogin }: SignUpPageProps) {
    const [selectedRole, setSelectedRole] = useState<UserRole>('builder');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && name) {
            onSignup(selectedRole, email, name, phone);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                    {/* Back Button */}
                    <button
                        onClick={onBackToLogin}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Login
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-construction rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                                <Hammer className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                        </div>
                        <p className="text-slate-500 font-medium">
                            Join Calgary's premier construction network
                        </p>
                    </div>

                    {/* Role Selection Tabs */}
                    <div className="bg-slate-100 rounded-xl p-1 flex gap-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('builder')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${selectedRole === 'builder'
                                ? 'bg-gradient-construction text-white shadow-md'
                                : 'hover:bg-slate-50 text-slate-700'
                                }`}
                        >
                            Builder
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('tradesman')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${selectedRole === 'tradesman'
                                ? 'bg-gradient-construction text-white shadow-md'
                                : 'hover:bg-slate-50 text-slate-700'
                                }`}
                        >
                            Tradesman
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('other')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${selectedRole === 'other'
                                ? 'bg-gradient-construction text-white shadow-md'
                                : 'hover:bg-slate-50 text-slate-700'
                                }`}
                        >
                            Other
                        </button>
                    </div>

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="name" className="text-slate-900 font-medium">
                                Full Name *
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-2 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-slate-900 font-medium">
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone" className="text-slate-900 font-medium">
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="403-555-0123"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-2 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                            />
                            <p className="text-sm text-slate-500 mt-1">Optional - helps others contact you</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-construction hover:opacity-90 py-6 text-base font-semibold shadow-construction"
                        >
                            Create {selectedRole === 'builder' ? 'Builder' : selectedRole === 'tradesman' ? 'Tradesman' : 'Guest'} Account
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-slate-600">
                        Already have an account?{' '}
                        <button
                            type="button"
                            className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                            onClick={onBackToLogin}
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
