import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VendorCard = ({ vendor, className = '' }) => {
  const navigate = useNavigate();

  const handleViewProducts = () => {
    navigate('/vendor-profile-products', { state: { vendorId: vendor?.id } });
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Olá ${vendor?.name}! Vi seus produtos no FreshLink e gostaria de saber mais informações.`);
    const whatsappUrl = `https://wa.me/55${vendor?.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={14} className="text-warning fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group ${className}`}>
      {/* Sponsored Badge */}
      {vendor?.isSponsored && (
        <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-xs font-caption font-medium px-2 py-1 rounded-full">
          Patrocinado
        </div>
      )}
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={vendor?.image}
          alt={vendor?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-1 line-clamp-1">
              {vendor?.name}
            </h3>
            <div className="flex items-center space-x-1 mb-2">
              <Icon name="MapPin" size={14} className="text-muted-foreground" />
              <span className="text-sm font-caption text-muted-foreground">
                {vendor?.distance} • {vendor?.location}
              </span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(vendor?.rating)}
          </div>
          <span className="text-sm font-body font-medium text-foreground">
            {vendor?.rating?.toFixed(1)}
          </span>
          <span className="text-sm font-caption text-muted-foreground">
            ({vendor?.reviewCount} avaliações)
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {vendor?.categories?.slice(0, 3)?.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-full"
            >
              {category}
            </span>
          ))}
          {vendor?.categories?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-full">
              +{vendor?.categories?.length - 3}
            </span>
          )}
        </div>

        {/* Operating Hours */}
        <div className="flex items-center space-x-2 mb-4">
          <Icon 
            name="Clock" 
            size={14} 
            className={vendor?.isOpen ? 'text-success' : 'text-error'} 
          />
          <span className={`text-sm font-caption ${vendor?.isOpen ? 'text-success' : 'text-error'}`}>
            {vendor?.isOpen ? 'Aberto agora' : 'Fechado'}
          </span>
          <span className="text-sm font-caption text-muted-foreground">
            • {vendor?.hours}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProducts}
            className="flex-1"
          >
            Ver Produtos
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="MessageCircle"
            onClick={handleWhatsAppContact}
            className="bg-success hover:bg-success/90"
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;