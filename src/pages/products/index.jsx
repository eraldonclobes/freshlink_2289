import React, { useState, useEffect, useCallback } from 'react';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import ProductModal from '../../components/ui/ProductModal';
import SearchBar from '../../components/ui/SearchBar';
import LocationSelector from '../../components/ui/LocationSelector';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLocation, setCurrentLocation] = useState({ id: 1, name: "São Paulo, SP", distance: "Atual" });
    const [sortBy, setSortBy] = useState('distance');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');

    const PRODUCTS_PER_PAGE = 12;

    const sortOptions = [
        { value: 'distance', label: 'Mais próximos' },
        { value: 'price_asc', label: 'Menor preço' },
        { value: 'price_desc', label: 'Maior preço' },
        { value: 'name', label: 'Nome A-Z' },
        { value: 'rating', label: 'Melhor avaliados' }
    ];

    const categoryOptions = [
        { value: '', label: 'Todas as categorias' },
        { value: 'frutas', label: 'Frutas' },
        { value: 'verduras', label: 'Verduras' },
        { value: 'legumes', label: 'Legumes' },
        { value: 'organicos', label: 'Orgânicos' },
        { value: 'temperos', label: 'Temperos' },
        { value: 'laticinios', label: 'Laticínios' },
        { value: 'carnes', label: 'Carnes' }
    ];

    // Mock suggestions for search
    const mockSuggestions = [
        { id: 1, type: 'product', name: 'Tomate Orgânico', category: 'Produto', productId: 1, vendorId: 1 },
        { id: 2, type: 'product', name: 'Alface Americana', category: 'Produto', productId: 2, vendorId: 2 },
        { id: 3, type: 'vendor', name: 'Fazenda Verde', category: 'Vendedor', vendorId: 1 },
        { id: 4, type: 'product', name: 'Cenouras Frescas', category: 'Produto', productId: 3, vendorId: 3 },
        { id: 5, type: 'vendor', name: 'Hortifruti do João', category: 'Vendedor', vendorId: 2 }
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

    // Load initial products
    useEffect(() => {
        loadProducts();
        // Load favorite products from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
        setFavoriteProducts(savedFavorites);
        
        // Check for category filter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            setCategoryFilter(category);
        }
    }, []);

    // Filter and sort products
    useEffect(() => {
        filterAndSortProducts();
    }, [products, searchQuery, currentLocation, sortBy, categoryFilter]);

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

        // Filter by category
        if (categoryFilter) {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        // Filter by distance (mock - in real app would use actual location)
        filtered = filtered.filter(product => product.distance <= 5);

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
    }, [searchQuery, currentLocation, sortBy, categoryFilter]);

    const loadMoreProducts = async () => {
        setLoadingMore(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'vendor') {
            navigate('/vendor-profile-products', { state: { vendorId: suggestion.vendorId } });
        } else if (suggestion.type === 'product') {
            const product = mockProducts.find(p => p.id === suggestion.productId);
            if (product) {
                handleProductClick(product);
            }
        }
    };

    const handleLocationChange = (location) => {
        setCurrentLocation(location);
    };

    // Filter suggestions based on search query
    const filteredSuggestions = searchQuery?.length > 1 
        ? mockSuggestions.filter(item =>
            item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
          ).slice(0, 5)
        : [];

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

    const ProductCard = ({ product }) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const [isHovered, setIsHovered] = useState(false);

        const images = Array.isArray(product.images) ? product.images : [product.image];

        const handlePrevImage = (e) => {
            e.stopPropagation();
            setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        };

        const handleNextImage = (e) => {
            e.stopPropagation();
            setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        };

        const handleFavoriteClick = (e) => {
            e.stopPropagation();
            handleFavoriteToggle(product.id);
        };

        const handleProductInquiryClick = (e) => {
            e.stopPropagation();
            handleProductInquiry(product);
        };

        return (
            <div
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => handleProductClick(product)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Product Image */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                    <Image
                        src={images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Image Navigation */}
                    {images.length > 1 && isHovered && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                            >
                                <Icon name="ChevronLeft" size={16} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                            >
                                <Icon name="ChevronRight" size={16} />
                            </button>
                        </>
                    )}

                    {/* Image Indicators */}
                    {images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Favorite Button */}
                    <button
                        onClick={handleFavoriteClick}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${favoriteProducts.includes(product.id) ? 'opacity-100 scale-100' : 'opacity-100 scale-100'
                            } ${favoriteProducts.includes(product.id)
                                ? 'bg-error text-white'
                                : 'bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-error'
                            }`}
                    >
                        <Icon name="Heart" size={16} className={favoriteProducts.includes(product.id) ? 'fill-current' : ''} />
                    </button>

                    {/* Product Status */}
                    {!product.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-sm font-body font-medium">Indisponível</span>
                        </div>
                    )}

                    {product.isOrganic && (
                        <div className="absolute top-3 left-3 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-caption font-medium">
                            Orgânico
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-body font-medium text-foreground mb-1 line-clamp-2">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-heading font-bold text-foreground">
                                {formatPrice(product.price)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                /{product.unit}
                            </span>
                        </div>
                        {product.available && (
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span className="text-xs font-caption text-success">Disponível</span>
                            </div>
                        )}
                    </div>

                    {/* Vendor Name with Distance */}
                    <div className="text-sm text-muted-foreground mb-3 flex items-center justify-between">
                        <span>{product.vendor}</span>
                        <span className="text-xs">{product.distance}km</span>
                    </div>

                    {/* Action Button */}
                    <Button
                        variant="default"
                        size="sm"
                        iconName="MessageCircle"
                        fullWidth
                        disabled={!product.available}
                        onClick={handleProductInquiryClick}
                        className="bg-success hover:bg-success/90 py-5"
                    >
                        {product.available ? 'Perguntar' : 'Indisponível'}
                    </Button>
                </div>
            </div>
        );
    };

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
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                                Produtos Próximos
                            </h1>
                            <p className="text-muted-foreground">
                                {filteredProducts.length} produtos encontrados
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-muted/50 border-b border-border">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center space-x-3 flex-wrap gap-3">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <SearchBar
                                    onSearch={handleSearch}
                                    onSuggestionClick={handleSuggestionClick}
                                    suggestions={filteredSuggestions}
                                    placeholder="Buscar produtos..."
                                />
                            </div>

                            {/* Category Filter */}
                            <FilterDropdown
                                label="Categoria"
                                options={categoryOptions}
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                placeholder="Categoria"
                            />

                            {/* Sort Filter */}
                            <FilterDropdown
                                label="Ordenar"
                                options={sortOptions}
                                value={sortBy}
                                onChange={setSortBy}
                                placeholder="Ordenar por"
                            />

                            <LocationSelector
                                currentLocation={currentLocation}
                                onLocationChange={handleLocationChange}
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