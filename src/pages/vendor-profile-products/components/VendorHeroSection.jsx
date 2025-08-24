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
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Vendor Image */}
          <div className="flex-shrink-0 mb-6 lg:mb-0">
            <div className="w-full h-48 lg:w-64 lg:h-48 rounded-xl overflow-hidden bg-muted">
              <Image
                src={vendor?.image}
                alt={vendor?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Vendor Information */}
          <div className="flex-1">
            <div className="flex flex-col space-y-4">
              {/* Name and Location */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                  {vendor?.name}
                </h1>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="MapPin" size={16} />
                  <span className="font-body text-sm">{vendor?.location}</span>
                  <span className="text-xs">•</span>
                  <span className="font-body text-sm">{vendor?.distance}</span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">
                    {formatOperatingHours(vendor?.operatingHours)}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-caption font-medium ${
                  isCurrentlyOpen(vendor?.operatingHours)
                    ? 'bg-success/10 text-success' :'bg-error/10 text-error'
                }`}>
                  {isCurrentlyOpen(vendor?.operatingHours) ? 'Aberto' : 'Fechado'}
                </div>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4">
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <Button
                  variant="default"
                  iconName="MessageCircle"
                  iconPosition="left"
                  onClick={onWhatsAppContact}
                  className="flex-1 sm:flex-none"
                >
                  Contatar no WhatsApp
                </Button>
                <Button
                  variant="outline"
                  iconName="Navigation"
                  iconPosition="left"
                  onClick={onDirections}
                  className="flex-1 sm:flex-none"
                >
                  Como chegar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeroSection;