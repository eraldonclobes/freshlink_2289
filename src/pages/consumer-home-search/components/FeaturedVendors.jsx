import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedVendors = ({ className = '' }) => {
    const navigate = useNavigate();

    const featuredVendors = [
        {
            id: 1,
            name: "Fazenda Verde Orgânicos",
            image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
            rating: 4.8,
            reviewCount: 127,
            distance: "2.3 km",
            location: "Vila Madalena",
            categories: ["Orgânicos", "Frutas", "Verduras"],
            isOpen: true,
            hours: "6:00 - 18:00",
            phone: "11987654321",
            isSponsored: true,
            description: "Produtos orgânicos frescos direto da fazenda"
        },
        {
            id: 2,
            name: "Hortifruti do João",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
            rating: 4.6,
            reviewCount: 89,
            distance: "1.8 km",
            location: "Pinheiros",
            categories: ["Frutas", "Verduras", "Legumes"],
            isOpen: true,
            hours: "7:00 - 19:00",
            phone: "11987654322",
            isSponsored: true,
            description: "Tradição em qualidade há mais de 20 anos"
        },
        {
            id: 3,
            name: "Sítio das Frutas",
            image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
            rating: 4.9,
            reviewCount: 156,
            distance: "3.1 km",
            location: "Butantã",
            categories: ["Frutas", "Sucos", "Polpas"],
            isOpen: false,
            hours: "8:00 - 17:00",
            phone: "11987654323",
            isSponsored: true,
            description: "As melhores frutas da região com entrega rápida"
        }
    ];

    const handleViewAll = () => {
        // Scroll to main grid or apply featured filter
        const mainGrid = document.getElementById('vendor-grid');
        if (mainGrid) {
            mainGrid?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleVendorClick = (vendor) => {
        navigate('/vendor-profile-products', { state: { vendorId: vendor?.id } });
    };

    const handleWhatsAppContact = (vendor, e) => {
        e?.stopPropagation();
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
                <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
            );
        }

        if (hasHalfStar) {
            stars?.push(
                <Icon key="half" name="StarHalf" size={12} className="text-warning fill-current" />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars?.push(
                <Icon key={`empty-${i}`} name="Star" size={12} className="text-muted-foreground" />
            );
        }

        return stars;
    };

    return (
        <div className={`${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                        Vendedores em Destaque
                    </h2>
                    <p className="text-sm font-body text-muted-foreground">
                        Parceiros premium com os melhores produtos da região
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewAll}
                    iconName="ArrowRight"
                    iconPosition="right"
                >
                    Ver todos
                </Button>
            </div>
            {/* Featured Vendors Carousel */}
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                {featuredVendors?.map((vendor) => (
                    <div
                        key={vendor?.id}
                        onClick={() => handleVendorClick(vendor)}
                        className="flex-shrink-0 w-80 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                        {/* Sponsored Badge */}
                        <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-xs font-caption font-medium px-2 py-1 rounded-full">
                            Patrocinado
                        </div>

                        {/* Image */}
                        <div className="relative h-40 overflow-hidden">
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
                            <div className="mb-2">
                                <h3 className="font-heading font-semibold text-base text-foreground mb-1 line-clamp-1">
                                    {vendor?.name}
                                </h3>
                                <p className="text-sm font-body text-muted-foreground line-clamp-1">
                                    {vendor?.description}
                                </p>
                            </div>

                            {/* Location & Status */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-1">
                                    <Icon name="MapPin" size={12} className="text-muted-foreground" />
                                    <span className="text-xs font-caption text-muted-foreground">
                                        {vendor?.distance} • {vendor?.location}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Icon
                                        name="Clock"
                                        size={12}
                                        className={vendor?.isOpen ? 'text-success' : 'text-error'}
                                    />
                                    <span className={`text-xs font-caption ${vendor?.isOpen ? 'text-success' : 'text-error'}`}>
                                        {vendor?.isOpen ? 'Aberto' : 'Fechado'}
                                    </span>
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
                                <span className="text-xs font-caption text-muted-foreground">
                                    ({vendor?.reviewCount})
                                </span>
                            </div>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-1 mb-4">
                                {vendor?.categories?.slice(0, 2)?.map((category, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-full"
                                    >
                                        {category}
                                    </span>
                                ))}
                                {vendor?.categories?.length > 2 && (
                                    <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-full">
                                        +{vendor?.categories?.length - 2}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground border hover:bg-muted hover:text-foreground hover:border-primary/30 flex-1"
                                    onClick={(e) => {
                                        e?.stopPropagation();
                                        handleVendorClick(vendor);
                                    }}
                                >
                                    Ver Produtos
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    iconName="MessageCircle"
                                    onClick={(e) => handleWhatsAppContact(vendor, e)}
                                    className="bg-success hover:bg-success/90"
                                >
                                    WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedVendors;