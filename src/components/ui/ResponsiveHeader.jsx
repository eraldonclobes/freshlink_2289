import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const ResponsiveHeader = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userAuth, setUserAuth] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check for authentication
    const clientAuth = localStorage.getItem('clientAuth');
    const vendorAuth = localStorage.getItem('vendorAuth');
    
    if (clientAuth) {
      setUserAuth({ ...JSON.parse(clientAuth), type: 'client' });
    } else if (vendorAuth) {
      setUserAuth({ ...JSON.parse(vendorAuth), type: 'vendor' });
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    navigate('/consumer-home-search');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('clientAuth');
    localStorage.removeItem('vendorAuth');
    setUserAuth(null);
    setIsProfileDropdownOpen(false);
    navigate('/consumer-home-search');
  };

  const handleProfileClick = () => {
    if (userAuth?.type === 'vendor') {
      navigate('/vendor-profile');
    } else {
      navigate('/client-profile');
    }
    setIsProfileDropdownOpen(false);
  };

  const getProfileImage = () => {
    if (userAuth?.profileImage) {
      return userAuth.profileImage;
    }
    return userAuth?.type === 'vendor' 
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
  };

  const getUserName = () => {
    return userAuth?.name || userAuth?.businessName || 'Usuário';
  };

  return (
    <header className={`bg-card border-b border-border fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>

          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Leaf" size={20} color="white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">FreshLink</span>
          </button>

          {/* Desktop Navigation */}
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="w-full relative">
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Buscar produtos ou vendedores..."
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* User Profile or Auth Buttons */}
          <div className="flex items-center space-x-4">
            {userAuth ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-muted transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={getProfileImage()}
                      alt="Perfil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden sm:inline text-sm font-body font-medium text-foreground">
                    {getUserName()}
                  </span>
                  <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 animate-fade-in">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="User" size={16} />
                      <span>Meu Perfil</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => navigate('/auth?tab=register')}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-body font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    Cadastrar-se
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg animate-slide-down max-h-96 overflow-y-auto">
            {/* Mobile Search Bar */}
            <div className="px-4 py-4 border-b border-border">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
                <input
                  type="text"
                  placeholder="Buscar produtos ou vendedores..."
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => {
                  navigate('/consumer-home-search');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              >
                <Icon name="Search" size={20} />
                <span>Buscar Produtos</span>
              </button>

              <button
                onClick={() => {
                  navigate('/products');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              >
                <Icon name="Package" size={20} />
                <span>Produtos</span>
              </button>

              <button
                onClick={() => {
                  navigate('/vendors');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              >
                <Icon name="Store" size={20} />
                <span>Vendedores</span>
              </button>

              {userAuth?.type === 'vendor' && (
                <>
                  <button
                    onClick={() => {
                      navigate('/vendor-dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="BarChart3" size={20} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/product-management');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="Package" size={20} />
                    <span>Produtos</span>
                  </button>
                </>
              )}

              {!userAuth && (
                <div className="pt-4 border-t border-border space-y-2">
                  <button
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="LogIn" size={20} />
                    <span>Entrar</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/auth?tab=register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-body font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                  >
                    <Icon name="UserPlus" size={20} />
                    <span>Cadastrar-se</span>
                  </button>
                </div>
              )}
            </nav>
            
            {/* Bottom Navigation Links */}
            <div className="px-4 py-4 border-t border-border bg-muted/30">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    navigate('/consumer-home-search');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="Home" size={20} />
                  <span className="text-xs font-caption">Início</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/products');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="Package" size={20} />
                  <span className="text-xs font-caption">Produtos</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/vendors');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="Store" size={20} />
                  <span className="text-xs font-caption">Vendedores</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop Bottom Navigation */}
        <div className="hidden md:block border-t border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-8 py-3">
              <button
                onClick={() => navigate('/consumer-home-search')}
                className="flex items-center space-x-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Icon name="Home" size={16} />
                <span>Início</span>
              </button>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center space-x-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Icon name="Package" size={16} />
                <span>Produtos</span>
              </button>
              <button
      </div>
    </header>
  );
};

export default ResponsiveHeader;