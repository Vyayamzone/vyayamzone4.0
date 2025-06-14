
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [trainerStatus, setTrainerStatus] = useState<string | null>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const checkTrainerStatus = async () => {
      if (user?.email && user?.user_metadata?.signup_type === 'trainer') {
        const { data: trainerProfile } = await supabase
          .from('trainer_profiles')
          .select('status')
          .eq('email', user.email)
          .single();
        
        setTrainerStatus(trainerProfile?.status || null);
      }
    };

    checkTrainerStatus();
  }, [user]);

  const isActivePath = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  const getDashboardPath = () => {
    if (user?.user_metadata?.signup_type === 'trainer') {
      return '/dashboards/trainer';
    }
    return '/dashboards/user';
  };

  const shouldShowDashboard = () => {
    if (!user) return false;
    
    // If user is a trainer and status is pending, hide dashboard
    if (user?.user_metadata?.signup_type === 'trainer' && trainerStatus === 'pending') {
      return false;
    }
    
    return true;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/lovable-uploads/4e754411-f45d-4a91-ab35-0a83455e3623.png" 
              alt="VyayamZone Logo" 
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-2xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors duration-300">
              VyayamZone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-all duration-300 relative ${
                  isActivePath(item.path)
                    ? 'text-teal-600'
                    : 'text-slate-700 hover:text-teal-600'
                }`}
              >
                {item.name}
                {isActivePath(item.path) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {shouldShowDashboard() && (
                  <Link 
                    to={getDashboardPath()}
                    className="px-4 py-2 text-slate-700 font-medium hover:text-teal-600 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <User size={16} />
                      <span>{user.user_metadata?.full_name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link 
                  to="/auth"
                  className="px-4 py-2 text-slate-700 font-medium hover:text-teal-600 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/auth"
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-full hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-teal-600 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium transition-colors duration-300 ${
                    isActivePath(item.path)
                      ? 'text-teal-600'
                      : 'text-slate-700 hover:text-teal-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <>
                    {shouldShowDashboard() && (
                      <Link 
                        to={getDashboardPath()}
                        className="px-4 py-2 text-slate-700 font-medium hover:text-teal-600 transition-colors duration-300 text-left"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Button 
                      onClick={handleSignOut}
                      variant="outline"
                      className="justify-start"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/auth"
                      className="px-4 py-2 text-slate-700 font-medium hover:text-teal-600 transition-colors duration-300 text-left"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/auth"
                      className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg w-fit"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
