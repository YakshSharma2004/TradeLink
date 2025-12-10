import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Hammer, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';
import { signup } from '../lib/api';
import { gradients, hoverLift } from '../lib/styles';
import Squares from './ui/Squares';

const styles = {
    container: "min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden",
    card: "w-full max-w-xl bg-card rounded-3xl shadow-xl p-8 border border-border relative z-10",
    backButton: "flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium",
    header: {
        wrapper: "mb-8",
        iconContainer: `w-12 h-12 ${gradients.construction} rounded-xl flex items-center justify-center shadow-lg shadow-primary/10`,
        title: "text-3xl font-bold text-foreground tracking-tight",
        subtitle: "text-muted-foreground font-medium"
    },
    roleButton: (isActive: boolean) =>
        `flex-1 py-3 px-4 rounded-lg font-medium transition-all ${isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'}`,
    form: {
        label: "text-foreground font-medium",
        input: "mt-2 bg-input-background border-input focus:border-ring focus:ring-ring text-foreground",
        submitButton: `w-full ${gradients.construction} hover:opacity-90 py-6 text-base font-semibold shadow-construction text-white ${hoverLift}`
    },
    loginLink: {
        text: "text-center mt-6 text-muted-foreground",
        button: "text-orange-600 hover:text-orange-700 font-medium hover:underline dark:text-orange-500"
    }
};

interface SignUpPageProps {
    onSignup: (role: UserRole, email: string, name: string, phone?: string) => void;
    onBackToLogin: () => void;
}

export function SignUpPage({ onSignup, onBackToLogin }: SignUpPageProps) {
    const [selectedRole, setSelectedRole] = useState<UserRole>('builder');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && firstName && lastName && password) {
            try {
                const user = await signup({
                    email,
                    firstName,
                    lastName,
                    role: selectedRole,
                    phone,
                    password
                });
                toast.success('Account created successfully! Please log in.');
                onSignup(user.role, user.email, `${user.firstName} ${user.lastName}`, user.phone);
            } catch (err: any) {
                console.error('Signup failed:', err);
                const errorMessage = err.message || 'Signup failed. Please try again.';
                toast.error(errorMessage);
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
                    hoverFillColor='#222'
                />
            </div>
            <div className="w-full max-w-xl relative z-10">
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
                    <div className="bg-muted rounded-xl p-1 flex gap-1 mb-6">
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
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="firstName" className={styles.form.label}>
                                    First Name *
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={styles.form.input}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="lastName" className={styles.form.label}>
                                    Last Name *
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className={styles.form.input}
                                    required
                                />
                            </div>
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
                            <p className="text-sm text-muted-foreground mt-1">Optional - helps others contact you</p>
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
