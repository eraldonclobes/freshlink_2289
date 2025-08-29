import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import LocationSelector from '../../components/ui/LocationSelector';
import ProductCard from '../../components/ui/ProductCard';
import ProductModal from '../../components/ui/ProductModal';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const ProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLocation, setCurrentLocation] = useState({ id: 1, name: "São Paulo, SP", distance: "Atual" });
    const [sortBy, setSortBy] = useState('relevance');
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const PRODUCTS_PER_PAGE = 15;

    // Categories with same style as home page
    const categories = [
        { id: 'all', label: 'Todos', icon: 'Grid3X3' },
        { id: 'frutas', label: 'Frutas', icon: 'Apple' },
        { id: 'verduras', label: 'Verduras', icon: 'Carrot' },
        { id: 'organicos', label: 'Orgânicos', icon: 'Leaf' },
        { id: 'legumes', label: 'Legumes', icon: 'Wheat' },
        { id: 'temperos', label: 'Temperos', icon: 'Flower2' },
        { id: 'laticinios', label: 'Laticínios', icon: 'Milk' },
        { id: 'carnes', label: 'Carnes', icon: 'Beef' }
    ];

    const sortOptions = [
        { value: 'relevance', label: 'Relevância' },
        { value: 'price_low', label: 'Menor preço' },
        { value: 'price_high', label: 'Maior preço' },
        { value: 'rating', label: 'Melhor avaliados' },
        { value: 'distance', label: 'Mais próximos' },
        { value: 'newest', label: 'Mais recentes' }
    ];

    // Mock products data
    const mockProducts = [
        {
            id: 1,
            name: "Tomate Orgânico Premium",
            vendor: "Fazenda Verde Orgânicos",
            vendorId: 1,
            price: 8.50,
            originalPrice: 10.00,
            discount: 15,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1546470427-e5ac89c8ba37?w=400&h=400&fit=crop",
            distance: 0.8,
            rating: 4.8,
            reviewCount: 45,
            available: true,
            isOrganic: true,
            category: "organicos",
            description: "Tomates orgânicos premium cultivados sem agrotóxicos"
        },
        {
            id: 2,
            name: "Banana Prata Natural",
            vendor: "Sítio das Frutas",
            vendorId: 3,
            price: 6.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            distance: 2.1,
            rating: 4.9,
            reviewCount: 78,
            available: true,
            isOrganic: false,
            category: "frutas",
            description: "Bananas doces e maduras, ricas em potássio"
        },
        {
            id: 3,
            name: "Alface Hidropônica",
            vendor: "Hortifruti do João",
            vendorId: 2,
            price: 3.20,
            unit: "unidade",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
            distance: 1.2,
            rating: 4.6,
            reviewCount: 32,
            available: true,
            isOrganic: false,
            category: "verduras",
            description: "Alface fresca cultivada em sistema hidropônico"
        },
        {
            id: 4,
            name: "Cenoura Orgânica Baby",
            vendor: "Fazenda Orgânica São José",
            vendorId: 5,
            price: 5.80,
            originalPrice: 7.25,
            discount: 20,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
            distance: 1.5,
            rating: 4.7,
            reviewCount: 67,
            available: true,
            isOrganic: true,
            category: "legumes",
            description: "Cenouras orgânicas doces e crocantes"
        },
        {
            id: 5,
            name: "Manjericão Fresco",
            vendor: "Horta Urbana",
            vendorId: 6,
            price: 2.50,
            unit: "maço",
            image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=400&fit=crop",
            distance: 0.9,
            rating: 4.9,
            reviewCount: 15,
            available: true,
            isOrganic: true,
            category: "temperos",
            description: "Manjericão aromático cultivado em estufa"
        },
        {
            id: 6,
            name: "Leite Orgânico Integral",
            vendor: "Fazenda São José",
            vendorId: 5,
            price: 8.90,
            unit: "litro",
            image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
            distance: 1.5,
            rating: 4.8,
            reviewCount: 92,
            available: true,
            isOrganic: true,
            category: "laticinios",
            description: "Leite fresco de vacas criadas a pasto"
        },
        {
            id: 7,
            name: "Maçã Fuji Premium",
            vendor: "Pomar do Vale",
            vendorId: 7,
            price: 9.90,
            originalPrice: 12.00,
            discount: 17,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
            distance: 3.2,
            rating: 4.4,
            reviewCount: 41,
            available: true,
            isOrganic: false,
            category: "frutas",
            description: "Maçãs doces e crocantes, ideais para lanches"
        },
        {
            id: 8,
            name: "Rúcula Orgânica",
            vendor: "Verde Vida",
            vendorId: 8,
            price: 4.00,
            unit: "maço",
            image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
            distance: 2.8,
            rating: 4.6,
            reviewCount: 22,
            available: true,
            isOrganic: true,
            category: "verduras",
            description: "Rúcula fresca com sabor levemente picante"
        },
        {
            id: 9,
            name: "Abóbora Cabotiá",
            vendor: "Fazenda Verde",
            vendorId: 1,
            price: 4.20,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
            distance: 0.8,
            rating: 4.3,
            reviewCount: 18,
            available: true,
            isOrganic: true,
            category: "legumes",
            description: "Abóbora doce e nutritiva, rica em vitamina A"
        },
        {
            id: 10,
            name: "Queijo Minas Artesanal",
            vendor: "Laticínios da Serra",
            vendorId: 9,
            price: 28.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
            distance: 4.1,
            rating: 4.9,
            reviewCount: 156,
            available: true,
            isOrganic: false,
            category: "laticinios",
            description: "Queijo artesanal curado tradicionalmente"
        }
    ];

    // Control filter bar visibility based on scroll
    useEffect(() => {
        const controlFilterBar = () => {
            const currentScrollY = window.scrollY;
            
            // If scrolling down and passed 100px, hide
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                setIsFilterBarVisible(true);
            }
            // If scrolling up, show
            else if (currentScrollY < lastScrollY) {
                setIsFilterBarVisible(false);
            }
            
            // If at top of page, always show
            if (currentScrollY < 10) {
                setIsFilterBarVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        // Throttle function for better performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    controlFilterBar();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Load products on component mount
    useEffect(() => {
        loadProducts();
        
        // Load favorites
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
        setFavoriteProducts(savedFavorites);

        // Check for category filter from navigation
        const categoryFromState = location.state?.categoryFilter;
        if (categoryFromState) {
            setActiveCategory(categoryFromState);
        }
    }, [location.state]);

    // Filter products based on search, category, and other filters
    useEffect(() => {
        filterProducts();
    }, [searchQuery, activeCategory, sortBy, currentLocation]);

    const loadProducts = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setLoading(false);
    };

    const filterProducts = useCallback(() => {
        let filtered = [...mockProducts];

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (activeCategory !== 'all') {
            filtered = filtered.filter(product => product.category === activeCategory);
        }

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price_low':
                    return a.price - b.price;
                case 'price_high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'distance':
                    return a.distance - b.distance;
                case 'newest':
                    return b.id - a.id;
                case 'relevance':
                default:
                    // Prioritize organic, then by rating
                    if (a.isOrganic && !b.isOrganic) return -1;
                    if (!a.isOrganic && b.isOrganic) return 1;
                    return b.rating - a.rating;
            }
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);
        setHasMore(filtered.length > PRODUCTS_PER_PAGE);
    }, [searchQuery, activeCategory, sortBy]);

    const loadMoreProducts = async () => {
        setLoadingMore(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
    };

    const handleSearch = (query) => {
        setSearchQuery(query.trim());
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleLocationChange = (location) => {
        setCurrentLocation(location);
    };

    const handleProductClick = (product) => {
        navigate(`/product-details/${product.id}`, {
            state: {
                product,
                vendor: {
                    id: product.vendorId,
                    name: product.vendor,
                    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
                    location: "São Paulo, SP",
                    distance: `${product.distance}km`,
                    phone: "11999999999"
                }
            }
        });
    };

    const handleFavoriteToggle = (productId) => {
        const updatedFavorites = favoriteProducts.includes(productId)
            ? favoriteProducts.filter(id => id !== productId)
            : [...favoriteProducts, productId];
        
        setFavoriteProducts(updatedFavorites);
        localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
    };

    const displayedProducts = filteredProducts.slice(0, currentPage * PRODUCTS_PER_PAGE);
    const hasMoreToShow = displayedProducts.length < filteredProducts.length;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Icon key="half" name="StarHalf" size={12} className="text-warning fill-current" />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Icon key={`empty-${i}`} name="Star" size={12} className="text-muted-foreground" />
            );
        }

        return stars;
    };

    const ProductCard = ({ product }) => (
        <div
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full"
            onClick={() => handleProductClick(product)}
        >
            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(product.id);
                }}
                className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    favoriteProducts.includes(product.id)
                        ? 'bg-error text-white'
                        : 'bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-error hover:bg-white'
                }`}
            >
                <Icon
                    name="Heart"
                    size={16}
                    className={favoriteProducts.includes(product.id) ? 'fill-current' : ''}
                />
            </button>

            {/* Image - More square aspect ratio */}
            <div className="relative aspect-square overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Availability Status */}
                {!product.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-body font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            Indisponível
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                        <h3 className="font-heading font-medium text-lg text-foreground mb-1 line-clamp-1">
                            {product.name}
                        </h3>
                        <div className="flex items-center space-x-1 mb-1">
                            <Icon name="Store" size={12} className="text-muted-foreground" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/vendor-profile-products', { state: { vendorId: product.vendorId } });
                                }}
                                className="text-base text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
                            >
                                {product.vendor}
                            </button>
                            <span className="text-sm text-muted-foreground">• {product.distance}km</span>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                    </div>
                    <span className="text-xs font-body font-medium text-foreground">
                        {product.rating.toFixed(1)}
                    </span>
                    <span className="text-xs font-caption text-muted-foreground">
                        ({product.reviewCount})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-heading font-bold text-foreground">
                            {formatPrice(product.price)}
                        </span>
                        <span className="text-xs font-caption text-muted-foreground">
                            /{product.unit}
                        </span>
                    </div>
                    {product.discount && (
                        <span className="text-xs font-caption text-white bg-error px-2 py-1 rounded-full">
                            -{product.discount}%
                        </span>
                    )}
                    {product.originalPrice && (
                        <span className="text-xs font-caption text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                    <Button
                        variant="default"
                        size="xs"
                        fullWidth
                        onClick={(e) => {
                            e.stopPropagation();
                            const message = encodeURIComponent(`Olá ${product.vendor}! Vi o produto "${product.name}" no FreshLink e gostaria de saber mais informações.`);
                            const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
                            window.open(whatsappUrl, '_blank');
                        }}
                        disabled={!product.available}
                        className="bg-success hover:bg-success/90 text-xs py-2"
                    >
                        <div className="flex items-center justify-center space-x-1">
                            <span>{product.available ? 'Comprar por' : 'Indisponível'}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-muted" />
            <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-muted rounded" />
                    ))}
                </div>
                <div className="h-6 bg-muted rounded" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ResponsiveHeader />

            <main className="pt-16 flex-1">
                {/* Fixed Filter Bar */}
                <div 
                    className={`bg-card border-b border-border fixed left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
                        isFilterBarVisible ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    style={{ top: '64px' }}
                >
                    <div className="container mx-auto px-4 py-4">
                        {/* Search Bar */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Icon 
                                        name="Search" 
                                        size={16} 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                                    />
                                    <input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <Icon name="X" size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Sort and Location */}
                            <div className="flex items-center space-x-3">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 bg-muted border border-border rounded-lg text-sm font-body font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <LocationSelector
                                    currentLocation={currentLocation}
                                    onLocationChange={handleLocationChange}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex items-center justify-start space-x-2 overflow-x-auto scrollbar-hide pb-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all duration-200 ${
                                        activeCategory === category.id
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <Icon name={category.icon} size={16} />
                                    <span>{category.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Results Count */}
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground">
                                {filteredProducts.length} produtos encontrados
                                {searchQuery && ` para "${searchQuery}"`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="container mx-auto px-4 py-8" style={{ paddingTop: isFilterBarVisible ? '200px' : '32px' }}>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {[...Array(15)].map((_, index) => (
                                <LoadingSkeleton key={index} />
                            ))}
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                                Nenhum produto encontrado
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Tente ajustar os filtros ou buscar por outros termos
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveCategory('all');
                                }}
                                variant="outline"
                                iconName="RotateCcw"
                                iconPosition="left"
                            >
                                Limpar Filtros
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {displayedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
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

            <Footer />
        </div>
    );
};

export default ProductsPage;