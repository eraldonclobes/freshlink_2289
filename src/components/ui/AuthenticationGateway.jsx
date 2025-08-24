import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const AuthenticationGateway = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/consumer-home-search');
  };

  return (
    <header className={`bg-card border-b border-border ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
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

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/vendor-login')}
              className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/vendor-registration')}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-body font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Cadastrar-se
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthenticationGateway;