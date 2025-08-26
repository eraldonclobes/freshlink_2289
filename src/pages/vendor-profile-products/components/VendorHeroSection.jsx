import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VendorHeroSection = ({ vendor, onWhatsAppContact, onDirections, onShare }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="relative w-full">
      {/* Gradient Background */}
      <div className="h-64 md:h-80 bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 relative overflow-hidden">
        {vendor?.bannerImage && (
          <Image
            src={vendor.bannerImage}
            alt={`${vendor.name} banner`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
      </div>
      
      {/* Content Container */}
      <div className="relative -mt-32 px-4 pb-6">
        <div className="container mx-auto">
          {/* Profile Section */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 mb-6">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={vendor?.image}
                alt={vendor?.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {vendor?.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                  <Icon name="CheckCircle" size={24} color="white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
                    {vendor?.name}
                  </h1>
                  <p className="text-muted-foreground font-body mb-4 max-w-2xl leading-relaxed">
                    {vendor?.description || vendor?.story?.substring(0, 150) + '...'}
                  </p>
                  
                  {/* Social Links, Location, Products, Rating */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                      <Icon name="AtSign" size={16} />
                      <div className="flex space-x-2">
                        <button className="text-primary hover:text-primary/80 transition-colors duration-200">
                          <Icon name="Facebook" size={16} />
                        </button>
                        <button className="text-primary hover:text-primary/80 transition-colors duration-200">
                          <Icon name="Instagram" size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1">
                      <Icon name="MapPin" size={16} />
                      <span>{vendor?.location}</span>
                    </div>
                    
                    {/* Product Count */}
                    <div className="flex items-center gap-1">
                      <Icon name="Package" size={16} />
                      <span>{vendor?.productCount} produtos</span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center space-x-1">
                        {renderStars(vendor?.rating)}
                      </div>
                      <span className="font-medium text-foreground">{vendor?.rating?.toFixed(1)}</span>
                      <span>({vendor?.reviewCount})</span>
                    </div>
                  </div>

                  {/* Achievement Stats */}
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="ShoppingCart" size={24} className="text-primary" />
                      </div>
                      <div className="text-xl font-heading font-bold text-primary">
                        1.2k+
                      </div>
                      <div className="text-xs font-caption text-muted-foreground">Vendas</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="Calendar" size={24} className="text-success" />
                      </div>
                      <div className="text-xl font-heading font-bold text-success">
                        3+
                      </div>
                      <div className="text-xs font-caption text-muted-foreground">Anos de Experiência</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="Award" size={24} className="text-warning" />
                      </div>
                      <div className="text-xl font-heading font-bold text-warning">
                        98%
                      </div>
                      <div className="text-xs font-caption text-muted-foreground">Satisfação</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 lg:min-w-fit">
                  <Button
                    variant="default"
                    size="lg"
                    iconName="MessageCircle"
                    iconPosition="left"
                    onClick={onWhatsAppContact}
                    className="bg-success hover:bg-success/90 px-8 py-3"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    iconName="Share"
                    iconPosition="left"
                    onClick={onShare}
                    className="px-8 py-3"
                  >
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeroSection;