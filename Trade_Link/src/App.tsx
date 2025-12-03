import { useState, useEffect, JSX } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
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

interface AppState {
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
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<AppState>({
    user: null,
    selectedTrade: null,
    chatRecipient: null,
  });

  const handleLogin = (role: UserRole, email: string, name: string, id?: string) => {
    const userId = id || Date.now().toString();
    setState(prev => ({
      ...prev,
      user: { id: userId, name, email, role },
    }));

    if (role === 'builder') {
      navigate('/dashboard');
    } else if (role === 'tradesman') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignup = (role: UserRole, email: string, name: string, phone?: string) => {
    // For now, just log them in after signup
    handleLogin(role, email, name);
  };

  const handleSelectTrade = (trade: TradeType) => {
    setState(prev => ({ ...prev, selectedTrade: trade }));
    navigate('/trade-listings');
  };

  const handleOpenChat = (recipientId: string, recipientName: string) => {
    setState(prev => ({
      ...prev,
      chatRecipient: { id: recipientId, name: recipientName }
    }));
    navigate('/chat');
  };

  const handleNavigate = (view: 'analytics' | 'chat' | 'profile') => {
    navigate(`/${view}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!state.user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={
          !state.user ? (
            <LoginPage
              onLogin={handleLogin}
              onNavigateToSignup={() => navigate('/signup')}
            />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />

        <Route path="/signup" element={
          !state.user ? (
            <SignUpPage
              onSignup={handleSignup}
              onBackToLogin={() => navigate('/login')}
            />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            {state.user?.role === 'tradesman' ? (
              <TradesmanDashboard
                userName={state.user.name}
                userId={state.user.id}
                userEmail={state.user.email}
                onNavigate={handleNavigate}
              />
            ) : (
              <BuilderDashboard
                onSelectTrade={handleSelectTrade}
                onNavigate={handleNavigate}
                userName={state.user?.name || ''}
              />
            )}
          </ProtectedRoute>
        } />

        <Route path="/trade-listings" element={
          <ProtectedRoute>
            {state.selectedTrade ? (
              <TradeListingsView
                tradeType={state.selectedTrade}
                onBack={handleBackToDashboard}
                onOpenChat={handleOpenChat}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatInterface
              currentUserId={state.user?.id || ''}
              currentUserName={state.user?.name || ''}
              onBack={handleBackToDashboard}
              initialRecipientId={state.chatRecipient?.id}
              initialRecipientName={state.chatRecipient?.name}
            />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute>
            <AnalyticsDashboard onBack={handleBackToDashboard} />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileView
              userName={state.user?.name || ''}
              userEmail={state.user?.email || ''}
              userRole={state.user?.role || 'builder'}
              userId={state.user?.id || ''}
              onBack={handleBackToDashboard}
            />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to={state.user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
