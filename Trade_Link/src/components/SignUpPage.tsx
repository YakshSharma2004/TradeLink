import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Hammer, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';
import { signup } from '../lib/api';
import { gradients, hoverLift } from '../lib/styles';

const styles = {
    container: "min-h-screen bg-slate-50 flex items-center justify-center p-4 dark:bg-slate-950",
    card: "w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 border border-slate-100 dark:bg-slate-900 dark:border-slate-800",
    backButton: "flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium dark:text-slate-400 dark:hover:text-white",
    header: {
        wrapper: "mb-8",
        iconContainer: `w-12 h-12 ${gradients.construction} rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/10`,
        title: "text-3xl font-bold text-slate-900 tracking-tight dark:text-white",
        subtitle: "text-slate-500 font-medium dark:text-slate-400"
    },
    roleButton: (isActive: boolean) =>
        `flex-1 py-3 px-4 rounded-lg font-medium transition-all ${isActive
            ? `${gradients.construction} text-white shadow-md`
            : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}`,
    form: {
        label: "text-slate-900 font-medium dark:text-slate-200",
        input: "mt-2 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white",
        submitButton: `w-full ${gradients.construction} hover:opacity-90 py-6 text-base font-semibold shadow-construction text-white ${hoverLift}`
    },
    loginLink: {
        text: "text-center mt-6 text-slate-600 dark:text-slate-400",
        button: "text-orange-600 hover:text-orange-700 font-medium hover:underline dark:text-orange-500"
    }
};

interface SignUpPageProps {
    onSignup: (role: UserRole, email: string, name: string, phone?: string) => void;
    onBackToLogin: () => void;
}

export function SignUpPage({ onSignup, onBackToLogin }: SignUpPageProps) {
    const [selectedRole, setSelectedRole] = useState<UserRole>('builder');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && name && password) {
            try {
                const user = await signup({
                    email,
                    name,
                    role: selectedRole,
                    phone,
                    password
                });
                onSignup(user.role, user.email, user.name, user.phone);
            } catch (err) {
                console.error('Signup failed:', err);
                alert('Signup failed. Please try again.');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className="w-full max-w-xl">
                <div className={styles.card}>
                    {/* Back Button */}
                    <button
                        onClick={onBackToLogin}
                        className={styles.backButton}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Login
                    </button>

                    {/* Header */}
                    <div className={styles.header.wrapper}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={styles.header.iconContainer}>
                                <Hammer className="w-6 h-6 text-white" />
                            </div>
                            <h1 className={styles.header.title}>Create Account</h1>
                        </div>
                        <p className={styles.header.subtitle}>
                            Join Calgary's premier construction network
                        </p>
                    </div>

                    {/* Role Selection Tabs */}
                    <div className="bg-slate-100 rounded-xl p-1 flex gap-1 mb-6 dark:bg-slate-800/50">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('builder')}
                            className={styles.roleButton(selectedRole === 'builder')}
                        >
                            Builder
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('tradesman')}
                            className={styles.roleButton(selectedRole === 'tradesman')}
                        >
                            Tradesman
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('other')}
                            className={styles.roleButton(selectedRole === 'other')}
                        >
                            Other
                        </button>
                    </div>

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="name" className={styles.form.label}>
                                Full Name *
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.form.input}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className={styles.form.label}>
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.form.input}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className={styles.form.label}>
                                Password *
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

                        <div>
                            <Label htmlFor="phone" className={styles.form.label}>
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="403-555-0123"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={styles.form.input}
                            />
                            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">Optional - helps others contact you</p>
                        </div>

                        <Button
                            type="submit"
                            className={styles.form.submitButton}
                        >
                            Create {selectedRole === 'builder' ? 'Builder' : selectedRole === 'tradesman' ? 'Tradesman' : 'Guest'} Account
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className={styles.loginLink.text}>
                        Already have an account?{' '}
                        <button
                            type="button"
                            className={styles.loginLink.button}
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
