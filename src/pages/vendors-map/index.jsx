import React, { useState, useEffect } from 'react';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const VendorsMap = () => {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -23.5505, lng: -46.6333 }); // São Paulo
    const [userLocation, setUserLocation] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        isOpen: false,
        distance: 10
    });

    // Mock vendors data with coordinates
    const mockVendors = [
        {
            id: 1,
            name: "Fazenda Verde Orgânicos",
            image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
            rating: 4.8,
            reviewCount: 127,
            location: "Vila Madalena",
            coordinates: { lat: -23.5505, lng: -46.6333 },
            categories: ["Orgânicos", "Frutas", "Verduras"],
            isOpen: true,
            hours: "6:00 - 18:00",
            phone: "11987654321",
            productCount: 24,
            description: "Produtos orgânicos frescos direto da fazenda"
        },
        {
            id: 2,
            name: "Hortifruti do João",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
            rating: 4.6,
            reviewCount: 89,
            location: "Pinheiros",
            coordinates: { lat: -23.5629, lng: -46.6825 },
            categories: ["Frutas", "Verduras", "Legumes"],
            isOpen: true,
            hours: "7:00 - 19:00",
            phone: "11987654322",
            productCount: 18,
            description: "Tradição em qualidade há mais de 20 anos"
        },
        {
            id: 3,
            name: "Sítio das Frutas",
            image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
            rating: 4.9,
            reviewCount: 156,
            location: "Butantã",
            coordinates: { lat: -23.5732, lng: -46.7234 },
            categories: ["Frutas", "Sucos", "Polpas"],
            isOpen: false,
            hours: "8:00 - 17:00",
            phone: "11987654323",
            productCount: 32,
            description: "As melhores frutas da região com entrega rápida"
        },
        {
            id: 4,
            name: "Mercado da Terra",
            image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
            rating: 4.4,
            reviewCount: 73,
            location: "Perdizes",
            coordinates: { lat: -23.5365, lng: -46.6731 },
            categories: ["Verduras", "Legumes", "Temperos"],
            isOpen: true,
            hours: "6:30 - 18:30",
            phone: "11987654324",
            productCount: 15,
            description: "Produtos frescos colhidos diariamente"
        },
        {
            id: 5,
            name: "Fazenda Orgânica São José",
            image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
            rating: 4.7,
            reviewCount: 112,
            location: "Lapa",
            coordinates: { lat: -23.5280, lng: -46.7042 },
            categories: ["Orgânicos", "Laticínios", "Ovos"],
            isOpen: true,
            hours: "7:00 - 17:00",
            phone: "11987654325",
            productCount: 28,
            description: "Fazenda familiar com certificação orgânica"
        }
    ];

    useEffect(() => {
        setVendors(mockVendors);
        
        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setMapCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    const filteredVendors = vendors.filter(vendor => {
        if (filters.category && !vendor.categories.some(cat => 
            cat.toLowerCase().includes(filters.category.toLowerCase())
        )) {
            return false;
        }
        
        if (filters.isOpen && !vendor.isOpen) {
            return false;
        }
        
        return true;
    });

    const handleVendorClick = (vendor) => {
        setSelectedVendor(vendor);
        setMapCenter(vendor.coordinates);
    };

    const handleWhatsAppContact = (vendor) => {
        const message = encodeURIComponent(`Olá ${vendor.name}! Vi seu perfil no FreshLink e gostaria de saber mais sobre seus produtos.`);
        const whatsappUrl = `https://wa.me/55${vendor.phone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
            );
        }
        
        return stars;
    };

    const VendorMarker = ({ vendor, isSelected, onClick }) => (
        <div
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
            }`}
            style={{
                left: `${((vendor.coordinates.lng + 46.8) / 0.4) * 100}%`,
                top: `${((23.7 - vendor.coordinates.lat) / 0.3) * 100}%`
            }}
            onClick={() => onClick(vendor)}
        >
            <div className={`relative ${isSelected ? 'animate-bounce-in' : ''}`}>
                {/* Vendor Avatar */}
                <div className={`w-12 h-12 rounded-full border-3 overflow-hidden shadow-lg ${
                    vendor.isOpen 
                        ? 'border-success' 
                        : 'border-error'
                } ${isSelected ? 'ring-4 ring-primary/30' : ''}`}>
                    <Image
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Status Indicator */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    vendor.isOpen ? 'bg-success' : 'bg-error'
                }`} />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-card border border-border rounded-lg p-2 shadow-lg whitespace-nowrap">
                        <p className="text-sm font-medium text-foreground">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {vendor.isOpen ? 'Aberto' : 'Fechado'} • {vendor.productCount} produtos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const VendorCard = ({ vendor }) => (
        <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-body font-medium text-foreground truncate">
                                {vendor.name}
                            </h3>
                            <div className="flex items-center space-x-1 mb-1">
                                <Icon name="MapPin" size={12} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{vendor.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                {renderStars(vendor.rating)}
                                <span className="text-xs font-medium text-foreground ml-1">
                                    {vendor.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            vendor.isOpen 
                                ? 'bg-success/10 text-success' 
                                : 'bg-error/10 text-error'
                        }`}>
                            {vendor.isOpen ? 'Aberto' : 'Fechado'}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                        {vendor.categories.slice(0, 2).map((category, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                    
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVendorClick(vendor)}
                            className="flex-1 text-xs"
                        >
                            Ver Produtos
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            iconName="MessageCircle"
                            onClick={() => handleWhatsAppContact(vendor)}
                            className="bg-success hover:bg-success/90 text-xs"
                        >
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ResponsiveHeader />
            
            <main className="pt-16 flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-card border-b border-border">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-heading font-bold text-foreground">
                                    Mapa de Vendedores
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {filteredVendors.length} vendedores próximos
                                </p>
                            </div>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                iconName="Filter"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filtros
                            </Button>
                        </div>
                        
                        {/* Filters */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Categoria
                                        </label>
                                        <select
                                            value={filters.category}
                                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                        >
                                            <option value="">Todas</option>
                                            <option value="organicos">Orgânicos</option>
                                            <option value="frutas">Frutas</option>
                                            <option value="verduras">Verduras</option>
                                            <option value="legumes">Legumes</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="openOnly"
                                            checked={filters.isOpen}
                                            onChange={(e) => setFilters(prev => ({ ...prev, isOpen: e.target.checked }))}
                                            className="w-4 h-4 text-primary border-border rounded"
                                        />
                                        <label htmlFor="openOnly" className="text-sm font-medium text-foreground">
                                            Apenas abertos agora
                                        </label>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Distância máxima: {filters.distance}km
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="20"
                                            value={filters.distance}
                                            onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex">
                    {/* Map Container */}
                    <div className="flex-1 relative">
                        {/* Mock Map Background */}
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
                            {/* Map Grid Lines */}
                            <div className="absolute inset-0 opacity-20">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={`v-${i}`}
                                        className="absolute top-0 bottom-0 w-px bg-gray-300"
                                        style={{ left: `${(i / 20) * 100}%` }}
                                    />
                                ))}
                                {[...Array(15)].map((_, i) => (
                                    <div
                                        key={`h-${i}`}
                                        className="absolute left-0 right-0 h-px bg-gray-300"
                                        style={{ top: `${(i / 15) * 100}%` }}
                                    />
                                ))}
                            </div>

                            {/* User Location */}
                            {userLocation && (
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                                    style={{
                                        left: `${((userLocation.lng + 46.8) / 0.4) * 100}%`,
                                        top: `${((23.7 - userLocation.lat) / 0.3) * 100}%`
                                    }}
                                >
                                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500/20 rounded-full animate-ping" />
                                </div>
                            )}

                            {/* Vendor Markers */}
                            {filteredVendors.map((vendor) => (
                                <div key={vendor.id} className="group">
                                    <VendorMarker
                                        vendor={vendor}
                                        isSelected={selectedVendor?.id === vendor.id}
                                        onClick={handleVendorClick}
                                    />
                                </div>
                            ))}

                            {/* Map Controls */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                                <button className="w-10 h-10 bg-card border border-border rounded-lg shadow-lg flex items-center justify-center hover:bg-muted transition-colors duration-200">
                                    <Icon name="Plus" size={20} />
                                </button>
                                <button className="w-10 h-10 bg-card border border-border rounded-lg shadow-lg flex items-center justify-center hover:bg-muted transition-colors duration-200">
                                    <Icon name="Minus" size={20} />
                                </button>
                                <button 
                                    onClick={() => {
                                        if (userLocation) {
                                            setMapCenter(userLocation);
                                        }
                                    }}
                                    className="w-10 h-10 bg-card border border-border rounded-lg shadow-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
                                >
                                    <Icon name="Navigation" size={20} />
                                </button>
                            </div>

                            {/* Legend */}
                            <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-success rounded-full" />
                                        <span className="text-xs text-foreground">Aberto</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-error rounded-full" />
                                        <span className="text-xs text-foreground">Fechado</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                        <span className="text-xs text-foreground">Sua localização</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 bg-card border-l border-border overflow-y-auto">
                        <div className="p-4">
                            <h2 className="font-heading font-semibold text-foreground mb-4">
                                Vendedores Próximos
                            </h2>
                            
                            <div className="space-y-3">
                                {filteredVendors.map((vendor) => (
                                    <div
                                        key={vendor.id}
                                        className={`cursor-pointer transition-all duration-200 ${
                                            selectedVendor?.id === vendor.id ? 'ring-2 ring-primary/20' : ''
                                        }`}
                                        onClick={() => handleVendorClick(vendor)}
                                    >
                                        <VendorCard vendor={vendor} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Vendor Details */}
                {selectedVendor && (
                    <div className="bg-card border-t border-border p-4">
                        <div className="container mx-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                                        <Image
                                            src={selectedVendor.image}
                                            alt={selectedVendor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-body font-semibold text-foreground">
                                            {selectedVendor.name}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Icon name="MapPin" size={14} />
                                            <span>{selectedVendor.location}</span>
                                            <span>•</span>
                                            <span className={selectedVendor.isOpen ? 'text-success' : 'text-error'}>
                                                {selectedVendor.isOpen ? 'Aberto' : 'Fechado'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {selectedVendor.description}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.location.href = `/vendor-profile-products?id=${selectedVendor.id}`}
                                    >
                                        Ver Produtos
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        iconName="MessageCircle"
                                        onClick={() => handleWhatsAppContact(selectedVendor)}
                                        className="bg-success hover:bg-success/90"
                                    >
                                        WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <Footer />
        </div>
    );
};

export default VendorsMap;