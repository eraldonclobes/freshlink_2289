import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const VendorsPage = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('2');
  const [customRadius, setCustomRadius] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const VENDORS_PER_PAGE = 8;

  const radiusOptions = [
    { value: '0.5', label: '500m' },
    { value: '1', label: '1km' },
    { value: '2', label: '2km' },
    { value: '5', label: '5km' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const sortOptions = [
    { value: 'distance', label: 'Mais próximos' },
    { value: 'rating', label: 'Melhor avaliados' },
    { value: 'name', label: 'Nome A-Z' },
    { value: 'products', label: 'Mais produtos' },
    { value: 'reviews', label: 'Mais avaliações' }
  ];

  // Mock vendors data
  const mockVendors = [
    {
      id: 1,
      name: "Fazenda Verde Orgânicos",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
      rating: 4.8,
      reviewCount: 127,
      distance: 0.8,
      location: "Vila Madalena",
      categories: ["Orgânicos", "Frutas", "Verduras"],
      isOpen: true,
      hours: "6:00 - 18:00",
      phone: "11987654321",
      isSponsored: true,
      productCount: 24,
      description: "Produtos orgânicos frescos direto da fazenda"
    },
    {
      id: 2,
      name: "Hortifruti do João",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
      rating: 4.6,
      reviewCount: 89,
      distance: 1.2,
      location: "Pinheiros",
      categories: ["Frutas", "Verduras", "Legumes"],
      isOpen: true,
      hours: "7:00 - 19:00",
      phone: "11987654322",
      isSponsored: false,
      productCount: 18,
      description: "Tradição em qualidade há mais de 20 anos"
    },
    {
      id: 3,
      name: "Sítio das Frutas",
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
      rating: 4.9,
      reviewCount: 156,
      distance: 1.5,
      location: "Butantã",
      categories: ["Frutas", "Sucos", "Polpas"],
      isOpen: false,
      hours: "8:00 - 17:00",
      phone: "11987654323",
      isSponsored: true,
      productCount: 32,
      description: "As melhores frutas da região com entrega rápida"
    },
    {
      id: 4,
      name: "Mercado da Terra",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
      rating: 4.4,
      reviewCount: 73,
      distance: 2.1,
      location: "Perdizes",
      categories: ["Verduras", "Legumes", "Temperos"],
      isOpen: true,
      hours: "6:30 - 18:30",
      phone: "11987654324",
      isSponsored: false,
      productCount: 15,
      description: "Produtos frescos colhidos diariamente"
    },
    {
      id: 5,
      name: "Fazenda Orgânica São José",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      rating: 4.7,
      reviewCount: 112,
      distance: 2.5,
      location: "Lapa",
      categories: ["Orgânicos", "Laticínios", "Ovos"],
      isOpen: true,
      hours: "7:00 - 17:00",
      phone: "11987654325",
      isSponsored: false,
      productCount: 28,
      description: "Fazenda familiar com certificação orgânica"
    },
    {
      id: 6,
      name: "Empório Natural",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&h=300&fit=crop",
      rating: 4.5,
      reviewCount: 94,
      distance: 3.2,
      location: "Vila Madalena",
      categories: ["Orgânicos", "Grãos", "Cereais"],
      isOpen: false,
      hours: "8:00 - 19:00",
      phone: "11987654326",
      isSponsored: false,
      productCount: 22,
      description: "Alimentação natural e saudável"
    }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'pt-BR';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Load initial vendors
  useEffect(() => {
    loadVendors();
  }, []);

  // Filter and sort vendors
  useEffect(() => {
    filterAndSortVendors();
  }, [vendors, searchQuery, selectedRadius, customRadius, sortBy]);

  const loadVendors = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVendors(mockVendors);
    setLoading(false);
  };

  const filterAndSortVendors = useCallback(() => {
    let filtered = [...mockVendors];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by radius
    const radius = selectedRadius === 'custom' ? parseFloat(customRadius) || 2 : parseFloat(selectedRadius);
    filtered = filtered.filter(vendor => vendor.distance <= radius);

    // Sort vendors
    filtered.sort((a, b) => {
      // Sponsored vendors first
      if (a.isSponsored && !b.isSponsored) return -1;
      if (!a.isSponsored && b.isSponsored) return 1;

      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          return b.productCount - a.productCount;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    setFilteredVendors(filtered);
    setCurrentPage(1);
    setHasMore(filtered.length > VENDORS_PER_PAGE);
  }, [searchQuery, selectedRadius, customRadius, sortBy]);

  const loadMoreVendors = async () => {
    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentPage(prev => prev + 1);
    setLoadingMore(false);
  };

  const startVoiceSearch = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const handleWhatsAppContact = (vendor) => {
    const message = encodeURIComponent(`Olá ${vendor.name}! Vi seu perfil no FreshLink e gostaria de saber mais sobre seus produtos.`);
    const whatsappUrl = `https://wa.me/55${vendor.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const displayedVendors = filteredVendors.slice(0, currentPage * VENDORS_PER_PAGE);
  const hasMoreToShow = displayedVendors.length < filteredVendors.length;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarHalf" size={14} className="text-warning fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const VendorCard = ({ vendor }) => (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      {vendor.isSponsored && (
        <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground text-xs font-caption font-medium px-2 py-1 rounded-full">
          Patrocinado
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <Image
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-caption">
          {vendor.distance}km
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-1 line-clamp-1">
              {vendor.name}
            </h3>
            <div className="flex items-center space-x-1 mb-2">
              <Icon name="MapPin" size={14} className="text-muted-foreground" />
              <span className="text-sm font-caption text-muted-foreground">
                {vendor.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(vendor.rating)}
          </div>
          <span className="text-sm font-body font-medium text-foreground">
            {vendor.rating.toFixed(1)}
          </span>
          <span className="text-sm font-caption text-muted-foreground">
            ({vendor.reviewCount})
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {vendor.categories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-full"
            >
              {category}
            </span>
          ))}
          {vendor.categories.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-full">
              +{vendor.categories.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Icon 
            name="Clock" 
            size={14} 
            className={vendor.isOpen ? 'text-success' : 'text-error'} 
          />
          <span className={`text-sm font-caption ${vendor.isOpen ? 'text-success' : 'text-error'}`}>
            {vendor.isOpen ? 'Aberto agora' : 'Fechado'}
          </span>
          <span className="text-sm font-caption text-muted-foreground">
            • {vendor.hours}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/vendor-profile-products', { state: { vendorId: vendor.id } })}
            className="flex-1"
          >
            Ver Produtos
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="MessageCircle"
            onClick={() => handleWhatsAppContact(vendor)}
            className="bg-success hover:bg-success/90"
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-muted rounded" />
          ))}
        </div>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded-full w-16" />
          ))}
        </div>
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="flex space-x-2">
          <div className="h-8 bg-muted rounded flex-1" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ResponsiveHeader />
      
      <main className="pt-16">
        {/* Header Section */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Vendedores em Destaque
                </h1>
                <p className="text-muted-foreground">
                  {filteredVendors.length} vendedores encontrados
                </p>
              </div>

              {/* Search and Voice */}
              <div className="flex items-center space-x-3">
                <div className="relative flex-1 lg:w-80">
                  <Icon 
                    name="Search" 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                  />
                  <input
                    type="text"
                    placeholder="Buscar vendedores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-muted border border-border rounded-lg text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={startVoiceSearch}
                    disabled={!recognition}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors duration-200 ${
                      isListening 
                        ? 'text-error bg-error/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={isListening ? "MicOff" : "Mic"} size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-3">
                <Select
                  placeholder="Raio"
                  options={radiusOptions}
                  value={selectedRadius}
                  onChange={setSelectedRadius}
                  className="w-32"
                />
                {selectedRadius === 'custom' && (
                  <input
                    type="number"
                    placeholder="km"
                    value={customRadius}
                    onChange={(e) => setCustomRadius(e.target.value)}
                    className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>
              
              <Select
                placeholder="Ordenar por"
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="w-48"
              />
            </div>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          ) : displayedVendors.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="Store" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Nenhum vendedor encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou expandir o raio de busca
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreToShow && (
                <div className="text-center mt-12">
                  <Button
                    onClick={loadMoreVendors}
                    loading={loadingMore}
                    variant="outline"
                    size="lg"
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Carregar mais vendedores
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VendorsPage;