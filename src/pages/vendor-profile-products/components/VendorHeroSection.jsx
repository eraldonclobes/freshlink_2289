import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VendorHeroSection = ({ vendor, onWhatsAppContact, onDirections, onShare }) => {
    const navigate = useNavigate();

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

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="bg-card relative pt-16">
            {/* Banner Section */}
            <div className="relative h-32 lg:h-40 overflow-hidden">
                <Image
                    src={vendor?.bannerImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop'}
                    alt={`Banner ${vendor?.name}`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                {/* Vendor Profile Image - Top Left */}
                <div className="absolute bottom-4 left-4">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-card border-4 border-card shadow-lg">
                        <Image
                            src={vendor?.image}
                            alt={vendor?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Action Buttons - Top Right */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        iconName="Share"
                        onClick={onShare}
                        className="bg-white/80 backdrop-blur-sm text-foreground hover:bg-white/90"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        iconName="MoreHorizontal"
                        className="bg-white/80 backdrop-blur-sm text-foreground hover:bg-white/90"
                    />
                </div>
            </div>

            {/* Vendor Information */}
            <div className="container mx-auto px-4 pt-6 pb-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                            {vendor?.name}
                        </h1>
                        <div className="flex items-center space-x-2 text-muted-foreground mb-4">
                            <Icon name="MapPin" size={16} />
                            <span className="font-body text-sm">{vendor?.location}</span>
                            <span className="text-xs">•</span>
                            <span className="font-body text-sm">{vendor?.distance}</span>
                        </div>

                        {/* Rating and Stats */}
                        <div className="flex items-center space-x-6 mb-4">
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
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <Icon name="Clock" size={16} className="text-muted-foreground" />
                                <span className="font-body text-sm text-muted-foreground">
                                    {formatOperatingHours(vendor?.operatingHours)}
                                </span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-caption font-medium ${isCurrentlyOpen(vendor?.operatingHours)
                                ? 'bg-success/10 text-success'
                                : 'bg-error/10 text-error'
                                }`}>
                                {isCurrentlyOpen(vendor?.operatingHours) ? 'Aberto' : 'Fechado'}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Desktop */}
                    <div className="hidden md:flex flex-col space-y-3">
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
                            variant="ghost"
                            iconName="Navigation"
                            className="text-muted-foreground border hover:bg-muted hover:text-foreground hover:border-primary/30"
                            onClick={onDirections}
                        >
                            Como chegar
                        </Button>
                    </div>
+                </div>
+
+                {/* Mobile Action Buttons */}
+                <div className="md:hidden flex flex-col space-y-3">
+                    <Button
+                        variant="default"
+                        iconName="MessageCircle"
+                        iconPosition="left"
+                        onClick={onWhatsAppContact}
+                        className="bg-success hover:bg-success/90"
+                        fullWidth
+                    >
+                        Contatar no WhatsApp
+                    </Button>
+                    <Button
+                        variant="ghost"
+                        iconName="Navigation"
+                        className="text-muted-foreground border hover:bg-muted hover:text-foreground hover:border-primary/30"
+                        onClick={onDirections}
+                        fullWidth
+                    >
+                        Como chegar
+                    </Button>
                 </div>
             </div>
         </div>
     );
 };

 export default VendorHeroSection;