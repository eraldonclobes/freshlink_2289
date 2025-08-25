import React, { useState, useEffect, useCallback } from 'react';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import ProductModal from '../../components/ui/ProductModal';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const PRODUCTS_PER_PAGE = 12;

  const radiusOptions = [
    { value: '0.5', label: '500m' },
    { value: '1', label: '1km' },
    { value: '2', label: '2km' },
    { value: '5', label: '5km' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const sortOptions = [
    { value: 'distance', label: 'Mais próximos' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
    { value: 'name', label: 'Nome A-Z' },
    { value: 'rating', label: 'Melhor avaliados' }
  ];

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Tomates Orgânicos",
      vendor: "Fazenda Verde",
      price: 8.50,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1546470427-e5ac89c8ba37?w=300&h=300&fit=crop",
      distance: 0.8,
      rating: 4.8,
      available: true,
      isOrganic: true,
      vendorId: 1
    },
    {
      id: 2,
      name: "Alface Americana",
      vendor: "Hortifruti do João",
      price: 3.20,
      unit: "unidade",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      distance: 1.2,
      rating: 4.6,
      available: true,
      isOrganic: false,
      vendorId: 2
    },
    {
      id: 3,
      name: "Cenouras Frescas",
      vendor: "Sítio das Frutas",
      price: 4.80,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop",
      distance: 1.5,
      rating: 4.9,
      available: true,
      isOrganic: true,
      vendorId: 3
    },
    {
      id: 4,
      name: "Banana Prata",
      vendor: "Fazenda São José",
      price: 6.90,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
      distance: 2.1,
      rating: 4.5,
      available: true,
      isOrganic: false,
      vendorId: 4
    },
    {
      id: 5,
      name: "Manjericão Fresco",
      vendor: "Horta Urbana",
      price: 2.50,
      unit: "maço",
      image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=300&h=300&fit=crop",
      distance: 0.5,
      rating: 4.7,
      available: true,
      isOrganic: true,
      vendorId: 5
    },
    {
      id: 6,
      name: "Maçã Fuji",
      vendor: "Pomar do Vale",
      price: 9.90,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
      distance: 3.2,
      rating: 4.4,
      available: false,
      isOrganic: false,
      vendorId: 6
    },
    {
      id: 7,
      name: "Rúcula Orgânica",
      vendor: "Verde Vida",
      price: 4.00,
      unit: "maço",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop",
      distance: 1.8,
      rating: 4.8,
      available: true,
      isOrganic: true,
      vendorId: 7
    },
    {
      id: 8,
      name: "Abóbora Cabotiá",
      vendor: "Fazenda Orgânica",
      price: 4.20,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop",
      distance: 2.5,
      rating: 4.6,
      available: true,
      isOrganic: true,
      vendorId: 8
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

  // Load initial products
  useEffect(() => {
    loadProducts();
    // Load favorite products from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    setFavoriteProducts(savedFavorites);
  }, []);

  // Filter and sort products
  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedRadius, customRadius, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProducts(mockProducts);
    setLoading(false);
  };

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...mockProducts];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by radius
    const radius = selectedRadius === 'custom' ? parseFloat(customRadius) || 2 : parseFloat(selectedRadius);
    filtered = filtered.filter(product => product.distance <= radius);

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setHasMore(filtered.length > PRODUCTS_PER_PAGE);
  }, [searchQuery, selectedRadius, customRadius, sortBy]);

  const loadMoreProducts = async () => {
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

  const handleProductInquiry = (product) => {
    const message = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name} (${product.unit}). Está disponível?`);
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleProductClick = (product) => {
    // Mock vendor data for the product
    const mockVendor = {
      id: product.vendorId,
      name: product.vendor,
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
      location: "São Paulo, SP",
      distance: `${product.distance}km`,
      phone: "11999999999"
    };
    
    setSelectedProduct({ ...product, vendor: mockVendor });
    setShowProductModal(true);
  };

  const handleFavoriteToggle = (productId) => {
    const updatedFavorites = favoriteProducts.includes(productId)
      ? favoriteProducts.filter(id => id !== productId)
      : [...favoriteProducts, productId];
    
    setFavoriteProducts(updatedFavorites);
    localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const displayedProducts = filteredProducts.slice(0, currentPage * PRODUCTS_PER_PAGE);
  const hasMoreToShow = displayedProducts.length < filteredProducts.length;

  // Sort products to show favorites first
  const sortedProducts = [...displayedProducts].sort((a, b) => {
    const aIsFavorite = favoriteProducts.includes(a.id);
    const bIsFavorite = favoriteProducts.includes(b.id);
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0;
  });

  const ProductCard = ({ product }) => (
    <div 
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
      onClick={() => handleProductClick(product)}
    >
      <div className="relative aspect-square bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-body font-medium">Indisponível</span>
          </div>
        )}
        {product.isOrganic && (
          <div className="absolute top-2 left-2 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-caption font-medium">
            Orgânico
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-caption">
          {product.distance}km
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-body font-medium text-foreground mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {product.vendor}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-heading font-bold text-foreground">
            {formatPrice(product.price)}/{product.unit}
          </span>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={14} className="text-warning fill-current" />
            <span className="text-sm font-caption text-muted-foreground">{product.rating}</span>
          </div>
        </div>

        <Button
          variant={product.available ? "outline" : "secondary"}
          size="sm"
          iconName="MessageCircle"
          iconPosition="left"
          fullWidth
          disabled={!product.available}
          onClick={(e) => {
            e.stopPropagation();
            handleProductInquiry(product);
          }}
        >
          {product.available ? 'Perguntar' : 'Indisponível'}
        </Button>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-12" />
        </div>
        <div className="h-8 bg-muted rounded" />
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
                  Produtos Próximos
                </h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} produtos encontrados
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
                    placeholder="Buscar produtos..."
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

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou expandir o raio de busca
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    vendor={{ id: product.vendorId, name: product.vendor }}
                    onProductClick={handleProductClick}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorited={favoriteProducts.includes(product.id)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreToShow && (
                <div className="text-center mt-12">
                  <Button
                    onClick={loadMoreProducts}
                    loading={loadingMore}
                    variant="outline"
                    size="lg"
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Carregar mais produtos
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        vendor={selectedProduct?.vendor}
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setSelectedProduct(null);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;