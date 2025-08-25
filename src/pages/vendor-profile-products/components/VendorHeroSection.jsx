import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VendorHeroSection = ({ vendor, onWhatsAppContact, onDirections }) => {
  const formatOperatingHours = (hours) => {
    return `${hours?.open} - ${hours?.close}`;
  };

  const isCurrentlyOpen = (hours) => {
    const now = new Date();
    const currentHour = now?.getHours();
    const openHour = parseInt(hours?.open?.split(':')?.[0]);
    const closeHour = parseInt(hours?.close?.split(':')?.[0]);
    return currentHour >= openHour && currentHour < closeHour;
  };

  return (
    <div className="bg-card">
      {/* Banner Section */}
      <div className="relative h-48 lg:h-64 overflow-hidden">
        <Image
          src={vendor?.bannerImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop'}
          alt={`Banner ${vendor?.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Vendor Profile Image - Overlapping */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-card border-4 border-card shadow-lg">
            <Image
              src={vendor?.image}
              alt={vendor?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Vendor Information */}
      <div className="container mx-auto px-4 pt-16 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
            {vendor?.name}
          </h1>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
            <Icon name="MapPin" size={16} />
            <span className="font-body text-sm">{vendor?.location}</span>
            <span className="text-xs">•</span>
            <span className="font-body text-sm">{vendor?.distance}</span>
          </div>

          {/* Rating and Stats */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={16} className="text-warning fill-current" />
              <span className="font-body font-medium text-foreground">{vendor?.rating}</span>
              <span className="font-body text-sm text-muted-foreground">
                ({vendor?.reviewCount} avaliações)
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Package" size={16} className="text-muted-foreground" />
              <span className="font-body text-sm text-muted-foreground">
                {vendor?.productCount} produtos
              </span>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="font-body text-sm text-muted-foreground">
                {formatOperatingHours(vendor?.operatingHours)}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-caption font-medium ${
              isCurrentlyOpen(vendor?.operatingHours)
                ? 'bg-success/10 text-success' 
                : 'bg-error/10 text-error'
            }`}>
              {isCurrentlyOpen(vendor?.operatingHours) ? 'Aberto' : 'Fechado'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              variant="default"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={onWhatsAppContact}
              className="bg-success hover:bg-success/90"
            >
              Contatar no WhatsApp
            </Button>
            <Button
              variant="outline"
              iconName="Navigation"
              iconPosition="left"
              onClick={onDirections}
            >
              Como chegar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeroSection;