import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Hero from './components/Home/Hero';
import Features from './components/Home/Features';
import AuthModal from './components/Auth/AuthModal';
import Dashboard from './components/Dashboard/Dashboard';

const AppContent: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onAuthClick={() => setShowAuthModal(true)} />
      <main>
        <Hero onGetStarted={() => setShowAuthModal(true)} />
        <Features />
      </main>
      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;