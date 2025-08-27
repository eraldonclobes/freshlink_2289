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

    const getNavLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `flex items-center space-x-2 px-4 py-2.5 rounded-md text-sm font-body transition-all duration-300 transform hover:scale-[1.02] ${
            isActive
                ? 'text-foreground bg-muted shadow-md font-semibold ring-1 ring-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium hover:shadow-sm'
        }`;
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

                    {/* Navigation Links - Desktop */}
                    <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center max-w-2xl">
                        <button
                            onClick={() => navigate('/consumer-home-search')}
                            className={getNavLinkClass('/consumer-home-search')}
                        >
                            <Icon name="Home" size={18} />
                            <span className="font-medium">Início</span>
                        </button>

                        <button
                            onClick={() => navigate('/products')}
                            className={getNavLinkClass('/products')}
                        >
                            <Icon name="Package" size={18} />
                            <span className="font-medium">Produtos</span>
                        </button>

                        <button
                            onClick={() => navigate('/vendors')}
                            className={getNavLinkClass('/vendors')}
                        >
                            <Icon name="Store" size={18} />
                            <span className="font-medium">Vendedores</span>
                        </button>
                    </nav>

                    {/* User Profile or Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {userAuth ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-muted transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-muted transition-all duration-300 hover:ring-primary/50">
                                        <Image
                                            src={getProfileImage()}
                                            alt="Perfil"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="hidden lg:inline text-sm font-body font-medium text-foreground">
                                        {getUserName()}
                                    </span>
                                    <Icon name="ChevronDown" size={16} className="hidden lg:inline text-muted-foreground transition-transform duration-300" />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-3 w-64 bg-card/95 backdrop-blur-lg border border-border/80 rounded-xl shadow-2xl py-3 animate-fade-in z-50">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-border/50">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                                    <Image
                                                        src={getProfileImage()}
                                                        alt="Perfil"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{getUserName()}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{userAuth?.type || 'Usuário'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <button
                                                onClick={handleProfileClick}
                                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/80 transition-all duration-200 hover:translate-x-1"
                                            >
                                                <Icon name="User" size={18} className="text-muted-foreground" />
                                                <span>Meu Perfil</span>
                                            </button>

                                            {userAuth?.type === 'vendor' && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            navigate('/vendor-dashboard');
                                                            setIsProfileDropdownOpen(false);
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/80 transition-all duration-200 hover:translate-x-1"
                                                    >
                                                        <Icon name="BarChart3" size={18} className="text-muted-foreground" />
                                                        <span>Dashboard</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate('/product-management');
                                                            setIsProfileDropdownOpen(false);
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/80 transition-all duration-200 hover:translate-x-1"
                                                    >
                                                        <Icon name="Package" size={18} className="text-muted-foreground" />
                                                        <span>Gerenciar Produtos</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        <div className="border-t border-border/50 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 hover:translate-x-1"
                                            >
                                                <Icon name="LogOut" size={18} />
                                                <span>Sair</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center space-x-3">
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                                >
                                    Entrar
                                </button>
                                <button
                                    onClick={() => navigate('/auth?tab=register')}
                                    className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-body font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    Cadastrar-se
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-card/95 backdrop-blur-lg border-b border-border/80 shadow-2xl animate-slide-down max-h-96 overflow-y-auto">
                        <nav className="px-4 py-6 space-y-1">
                            <button
                                onClick={() => {
                                    navigate('/consumer-home-search');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300 hover:translate-x-2"
                            >
                                <Icon name="Home" size={20} />
                                <span>Início</span>
                            </button>

                            <button
                                onClick={() => {
                                    navigate('/products');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300 hover:translate-x-2"
                            >
                                <Icon name="Package" size={20} />
                                <span>Produtos</span>
                            </button>

                            <button
                                onClick={() => {
                                    navigate('/vendors');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300 hover:translate-x-2"
                            >
                                <Icon name="Store" size={20} />
                                <span>Vendedores</span>
                            </button>

                            {!userAuth && (
                                <div className="pt-6 border-t border-border/50 space-y-3">
                                    <button
                                        onClick={() => {
                                            navigate('/auth');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300 hover:translate-x-2"
                                    >
                                        <Icon name="LogIn" size={20} />
                                        <span>Entrar</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/auth?tab=register');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-sm font-body font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                                    >
                                        <Icon name="UserPlus" size={20} />
                                        <span>Cadastrar-se</span>
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default ResponsiveHeader;