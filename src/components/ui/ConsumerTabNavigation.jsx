import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ConsumerTabNavigation = ({ className = '' }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navigationItems = [
        {
            label: 'Início',
            path: '/consumer-home-search',
            icon: 'Home',
            tooltip: 'Encontrar vendedores locais'
        },
        {
            label: 'Vendedor',
            path: '/vendor-profile-products',
            icon: 'Store',
            tooltip: 'Ver produtos e informações'
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <>
            {/* Desktop Navigation - Top */}
            <nav className={`hidden md:flex bg-card border-b border-border sticky top-0 z-50 ${className}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Icon name="Leaf" size={20} color="white" />
                                </div>
                                <span className="font-heading font-bold text-xl text-foreground">FreshLink</span>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <div className="flex items-center space-x-8">
                            {navigationItems?.map((item) => {
                                const isActive = location?.pathname === item?.path;
                                return (
                                    <button
                                        key={item?.path}
                                        onClick={() => handleNavigation(item?.path)}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-body font-medium transition-colors duration-200 ${isActive
                                            ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                            }`}
                                        title={item?.tooltip}
                                    >
                                        <Icon name={item?.icon} size={18} />
                                        <span>{item?.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <button
                                onClick={() => navigate('/vendor-registration')}
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-body font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
                            >
                                Cadastrar-se
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Mobile Navigation - Bottom */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
                <div className="flex items-center justify-around h-16 px-4">
                    {navigationItems?.map((item) => {
                        const isActive = location?.pathname === item?.path;
                        return (
                            <button
                                key={item?.path}
                                onClick={() => handleNavigation(item?.path)}
                                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                                    ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                title={item?.tooltip}
                            >
                                <Icon name={item?.icon} size={20} />
                                <span className="text-xs font-caption font-medium">{item?.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default ConsumerTabNavigation;