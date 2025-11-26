import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { BuilderDashboard } from './components/BuilderDashboard';
import { TradesmanDashboard } from './components/TradesmanDashboard';
import { TradeListingsView } from './components/TradeListingsView';
import { ChatInterface } from './components/ChatInterface';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ProfileView } from './components/ProfileView';
import { Toaster } from './components/ui/sonner';
import { UserRole, TradeType } from './types';

type View =
  | 'login'
  | 'signup'
  | 'builder-dashboard'
  | 'tradesman-dashboard'
  | 'other-dashboard'
  | 'trade-listings'
  | 'chat'
  | 'analytics'
  | 'profile';

interface AppState {
  view: View;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
  selectedTrade: TradeType | null;
  chatRecipient: { id: string; name: string } | null;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    view: 'login',
    user: null,
    selectedTrade: null,
    chatRecipient: null,
  });

  const handleLogin = (role: UserRole, email: string, name: string, id?: string) => {
    const userId = id || Date.now().toString();
    setState({
      view: role === 'builder'
        ? 'builder-dashboard'
        : role === 'tradesman'
          ? 'tradesman-dashboard'
          : 'other-dashboard',
      user: { id: userId, name, email, role },
      selectedTrade: null,
      chatRecipient: null,
    });
  };

  const handleSignup = (role: UserRole, email: string, name: string, phone?: string) => {
    // For now, just log them in after signup
    // In production, this would call the API first
    handleLogin(role, email, name);
  };

  const handleSelectTrade = (trade: TradeType) => {
    setState(prev => ({ ...prev, view: 'trade-listings', selectedTrade: trade }));
  };

  const handleOpenChat = (recipientId: string, recipientName: string) => {
    setState(prev => ({
      ...prev,
      view: 'chat',
      chatRecipient: { id: recipientId, name: recipientName }
    }));
  };

  const handleNavigate = (view: 'analytics' | 'chat' | 'profile') => {
    setState(prev => ({ ...prev, view }));
  };

  const handleBackToDashboard = () => {
    if (!state.user) return;

    setState(prev => ({
      ...prev,
      view: state.user?.role === 'builder'
        ? 'builder-dashboard'
        : state.user?.role === 'tradesman'
          ? 'tradesman-dashboard'
          : 'other-dashboard',
      selectedTrade: null,
      chatRecipient: null,
    }));
  };

  // Render based on current view
  console.log('Current view:', state.view);

  // Check signup FIRST before checking login/user
  if (state.view === 'signup') {
    return <SignUpPage onSignup={handleSignup} onBackToLogin={() => setState(prev => ({ ...prev, view: 'login' }))} />;
  }

  if (state.view === 'login' || !state.user) {
    return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => {
      console.log('Navigating to signup...');
      setState(prev => ({ ...prev, view: 'signup' }));
    }} />;
  }

  if (state.view === 'builder-dashboard') {
    return (
      <>
        <BuilderDashboard
          onSelectTrade={handleSelectTrade}
          onNavigate={handleNavigate}
          userName={state.user.name}
        />
        <Toaster />
      </>
    );
  }

  if (state.view === 'tradesman-dashboard') {
    return (
      <>
        <TradesmanDashboard
          userName={state.user.name}
          userId={state.user.id}
          userEmail={state.user.email}
          onNavigate={handleNavigate}
        />
        <Toaster />
      </>
    );
  }

  if (state.view === 'other-dashboard') {
    return (
      <>
        <BuilderDashboard
          onSelectTrade={handleSelectTrade}
          onNavigate={handleNavigate}
          userName={state.user.name}
        />
        <Toaster />
      </>
    );
  }

  if (state.view === 'trade-listings' && state.selectedTrade) {
    return (
      <>
        <TradeListingsView
          tradeType={state.selectedTrade}
          onBack={handleBackToDashboard}

          onOpenChat={handleOpenChat}
        />
        <Toaster />
      </>
    );
  }

  if (state.view === 'chat') {
    return (
      <>
        <ChatInterface
          currentUserId={state.user.id}
          currentUserName={state.user.name}
          onBack={handleBackToDashboard}
          initialRecipientId={state.chatRecipient?.id}
          initialRecipientName={state.chatRecipient?.name}
        />
        <Toaster />
      </>
    );
  }

  if (state.view === 'analytics') {
    return (
      <>
        <AnalyticsDashboard onBack={handleBackToDashboard} />
        <Toaster />
      </>
    );
  }

  if (state.view === 'profile') {
    return (
      <>
        <ProfileView
          userName={state.user.name}
          userEmail={state.user.email}
          userRole={state.user.role}
          onBack={handleBackToDashboard}
        />
        <Toaster />
      </>
    );
  }

  return null;
}
