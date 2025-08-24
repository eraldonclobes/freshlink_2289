import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsumerTabNavigation from '../../components/ui/ConsumerTabNavigation';

import LocationSelector from './components/LocationSelector';
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import VendorGrid from './components/VendorGrid';
import FeaturedVendors from './components/FeaturedVendors';
import QuickActions from './components/QuickActions';
import LoadingSpinner from './components/LoadingSpinner';
import Icon from '../../components/AppIcon';

const ConsumerHomeSearch = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState({ id: 1, name: "São Paulo, SP", distance: "Atual" });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock vendor data
  const mockVendors = [
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
      isSponsored: true
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
      isSponsored: false
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
      isSponsored: true
    },
    {
      id: 4,
      name: "Mercado da Terra",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
      rating: 4.4,
      reviewCount: 73,
      distance: "4.2 km",
      location: "Perdizes",
      categories: ["Verduras", "Legumes", "Temperos"],
      isOpen: true,
      hours: "6:30 - 18:30",
      phone: "11987654324",
      isSponsored: false
    },
    {
      id: 5,
      name: "Fazenda Orgânica São José",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      rating: 4.7,
      reviewCount: 112,
      distance: "5.1 km",
      location: "Lapa",
      categories: ["Orgânicos", "Laticínios", "Ovos"],
      isOpen: true,
      hours: "7:00 - 17:00",
      phone: "11987654325",
      isSponsored: false
    },
    {
      id: 6,
      name: "Empório Natural",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&h=300&fit=crop",
      rating: 4.5,
      reviewCount: 94,
      distance: "2.7 km",
      location: "Vila Madalena",
      categories: ["Orgânicos", "Grãos", "Cereais"],
      isOpen: false,
      hours: "8:00 - 19:00",
      phone: "11987654326",
      isSponsored: false
    },
    {
      id: 7,
      name: "Quintal da Vovó",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      rating: 4.8,
      reviewCount: 168,
      distance: "3.8 km",
      location: "Pompéia",
      categories: ["Frutas", "Verduras", "Conservas"],
      isOpen: true,
      hours: "6:00 - 18:00",
      phone: "11987654327",
      isSponsored: true
    },
    {
      id: 8,
      name: "Feira do Produtor",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      rating: 4.3,
      reviewCount: 67,
      distance: "6.2 km",
      location: "Barra Funda",
      categories: ["Frutas", "Verduras", "Legumes", "Temperos"],
      isOpen: true,
      hours: "5:00 - 14:00",
      phone: "11987654328",
      isSponsored: false
    }
  ];

  // Load vendors on component mount
  useEffect(() => {
    loadVendors();
  }, []);

  // Filter vendors based on search and filters
  useEffect(() => {
    filterVendors();
  }, [searchQuery, activeFilters, currentLocation]);

  const loadVendors = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVendors(mockVendors);
    setLoading(false);
  };

  const filterVendors = useCallback(() => {
    let filtered = [...mockVendors];

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(vendor =>
        vendor?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        vendor?.categories?.some(cat => cat?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ||
        vendor?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply category filters
    if (activeFilters?.length > 0) {
      filtered = filtered?.filter(vendor =>
        activeFilters?.some(filter =>
          vendor?.categories?.some(cat => cat?.toLowerCase()?.includes(filter?.toLowerCase()))
        )
      );
    }

    // Sort by sponsored first, then by rating
    filtered?.sort((a, b) => {
      if (a?.isSponsored && !b?.isSponsored) return -1;
      if (!a?.isSponsored && b?.isSponsored) return 1;
      return b?.rating - a?.rating;
    });

    setVendors(filtered);
  }, [searchQuery, activeFilters, mockVendors]);

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
    // Trigger refresh with new location
    handleRefresh();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'organic':
        setActiveFilters(['organicos']);
        break;
      case 'nearby':
        // Filter by distance (mock implementation)
        const nearbyVendors = mockVendors?.filter(v => parseFloat(v?.distance) <= 2);
        setVendors(nearbyVendors);
        break;
      case 'open-now':
        const openVendors = mockVendors?.filter(v => v?.isOpen);
        setVendors(openVendors);
        break;
      case 'delivery':
        // Mock delivery filter
        setActiveFilters(['entrega']);
        break;
      default:
        break;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    await loadVendors();
    setRefreshing(false);
  };

  const handlePullToRefresh = (e) => {
    const startY = e?.touches?.[0]?.clientY;
    let currentY = startY;

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleTouchMove = (e) => {
      currentY = e?.touches?.[0]?.clientY;
      const diff = currentY - startY;
      
      if (diff > 100 && window.scrollY === 0) {
        handleRefresh();
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <ConsumerTabNavigation />
      {/* Header with Location and Search */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          {/* Location Selector */}
          <div className="flex items-center justify-between mb-4">
            <LocationSelector
              currentLocation={currentLocation}
              onLocationChange={handleLocationChange}
            />
            {refreshing && (
              <LoadingSpinner size="sm" />
            )}
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} className="mb-4" />

          {/* Filter Chips */}
          <FilterChips
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      {/* Main Content */}
      <main 
        className="container mx-auto px-4 py-6 pb-20 md:pb-6"
        onTouchStart={handlePullToRefresh}
      >
        {/* Quick Actions */}
        <QuickActions
          onActionClick={handleQuickAction}
          className="mb-8"
        />

        {/* Featured Vendors */}
        <FeaturedVendors className="mb-8" />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground mb-1">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Vendedores Próximos'}
            </h2>
            <p className="text-sm font-body text-muted-foreground">
              {vendors?.length} {vendors?.length === 1 ? 'vendedor encontrado' : 'vendedores encontrados'} em {currentLocation?.name}
            </p>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 bg-muted rounded-lg text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              <Icon name="ArrowUpDown" size={16} />
              <span className="hidden sm:inline">Ordenar</span>
            </button>
          </div>
        </div>

        {/* Vendor Grid */}
        <VendorGrid
          vendors={vendors}
          loading={loading}
          className="mb-8"
          id="vendor-grid"
        />

        {/* Load More Button */}
        {!loading && vendors?.length > 0 && vendors?.length >= 8 && (
          <div className="flex justify-center">
            <button
              onClick={loadVendors}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              <Icon name="Plus" size={18} />
              <span>Carregar mais vendedores</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ConsumerHomeSearch;