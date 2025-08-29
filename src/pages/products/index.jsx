import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import LocationSelector from '../../components/ui/LocationSelector';
import ProductModal from '../../components/ui/ProductModal';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const ProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const categoriesRef = useRef(null);
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
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showCategoryArrows, setShowCategoryArrows] = useState(false);

    const PRODUCTS_PER_PAGE = 20;

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
            vendorDistance: 0.8,
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
            categories: ["Orgânicos", "Legumes"]
        },
        {
            id: 2,
            name: "Banana Prata Doce",
            vendor: "Sítio das Frutas",
            vendorId: 3,
            vendorDistance: 1.5,
            price: 6.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
            distance: 1.5,
            rating: 4.5,
            reviewCount: 34,
            available: true,
            isOrganic: false,
            category: "frutas",
            categories: ["Frutas", "Natural"]
        },
        {
            id: 3,
            name: "Alface Hidropônica",
            vendor: "Hortifruti do João",
            vendorId: 2,
            vendorDistance: 1.2,
            price: 3.20,
            unit: "unidade",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
            distance: 1.2,
            rating: 4.6,
            reviewCount: 18,
            available: true,
            isOrganic: false,
            category: "verduras",
            categories: ["Verduras", "Hidropônico"]
        },
        {
            id: 4,
            name: "Cenoura Orgânica",
            vendor: "Fazenda Orgânica São José",
            vendorId: 5,
            vendorDistance: 2.5,
            price: 5.80,
            originalPrice: 7.25,
            discount: 20,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
            distance: 2.5,
            rating: 4.7,
            reviewCount: 29,
            available: true,
            isOrganic: true,
            category: "organicos",
            categories: ["Orgânicos", "Legumes"]
        },
        {
            id: 5,
            name: "Manjericão Fresco",
            vendor: "Horta Urbana",
            vendorId: 6,
            vendorDistance: 1.8,
            price: 2.50,
            unit: "maço",
            image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=400&fit=crop",
            distance: 1.8,
            rating: 4.9,
            reviewCount: 15,
            available: true,
            isOrganic: true,
            category: "temperos",
            categories: ["Orgânicos", "Temperos"]
        },
        {
            id: 6,
            name: "Maçã Fuji",
            vendor: "Pomar do Vale",
            vendorId: 7,
            vendorDistance: 3.1,
            price: 9.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
            distance: 3.1,
            rating: 4.4,
            reviewCount: 41,
            available: true,
            isOrganic: false,
            category: "frutas",
            categories: ["Frutas", "Doces"]
        },
        {
            id: 7,
            name: "Rúcula Orgânica",
            vendor: "Verde Vida",
            vendorId: 8,
            vendorDistance: 2.2,
            price: 4.00,
            unit: "maço",
            image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
            distance: 2.2,
            rating: 4.6,
            reviewCount: 22,
            available: true,
            isOrganic: true,
            category: "verduras",
            categories: ["Orgânicos", "Verduras"]
        },
        {
            id: 8,
            name: "Abóbora Cabotiá",
            vendor: "Fazenda Verde",
            vendorId: 1,
            vendorDistance: 0.8,
            price: 4.20,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
            distance: 0.8,
            rating: 4.3,
            reviewCount: 8,
            available: true,
            isOrganic: true,
            category: "legumes",
            categories: ["Orgânicos", "Legumes"]
        },
        {
            id: 9,
            name: "Leite Orgânico",
            vendor: "Fazenda São José",
            vendorId: 5,
            vendorDistance: 2.5,
            price: 6.50,
            unit: "litro",
            image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
            distance: 2.5,
            rating: 4.8,
            reviewCount: 67,
            available: true,
            isOrganic: true,
            category: "laticinios",
            categories: ["Orgânicos", "Laticínios"]
        },
        {
            id: 10,
            name: "Queijo Minas Frescal",
            vendor: "Laticínios da Serra",
            vendorId: 9,
            vendorDistance: 4.2,
            price: 18.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
            distance: 4.2,
            rating: 4.7,
            reviewCount: 33,
            available: true,
            isOrganic: false,
            category: "laticinios",
            categories: ["Laticínios", "Artesanal"]
        }
    ];

    // Header visibility tracking
    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsHeaderVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setIsHeaderVisible(true);
            }
            
            if (currentScrollY < 10) {
                setIsHeaderVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    controlHeader();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Check if category arrows are needed
    useEffect(() => {
        const checkCategoryOverflow = () => {
            if (categoriesRef.current) {
                const container = categoriesRef.current;
                const isOverflowing = container.scrollWidth > container.clientWidth;
                setShowCategoryArrows(isOverflowing);
            }
        };

        checkCategoryOverflow();
        window.addEventListener('resize', checkCategoryOverflow);
        return () => window.removeEventListener('resize', checkCategoryOverflow);
    }, []);

    useEffect(() => {
        loadProducts();
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
        setFavoriteProducts(savedFavorites);
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, activeCategory, sortBy, currentLocation]);

    const loadProducts = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setLoading(false);
    };

    const filterProducts = () => {
        let filtered = [...mockProducts];

        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (activeCategory !== 'all') {
            filtered = filtered.filter(product => product.category === activeCategory);
        }

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
                    return b.rating - a.rating;
            }
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);
        setHasMore(filtered.length > PRODUCTS_PER_PAGE);
    };

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
                    distance: `${product.vendorDistance}km`,
                    phone: "11999999999"
                }
            }
        });
    };

    const handleWhatsAppContact = (product, e) => {
        e?.stopPropagation();
        const message = encodeURIComponent(`Olá ${product.vendor}! Vi o produto "${product.name}" no FreshLink e gostaria de saber mais informações.`);
        const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleFavoriteToggle = (productId, e) => {
        e?.stopPropagation();
        const updatedFavorites = favoriteProducts.includes(productId)
            ? favoriteProducts.filter(id => id !== productId)
            : [...favoriteProducts, productId];
        
        setFavoriteProducts(updatedFavorites);
        localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
    };

    const scrollCategories = (direction) => {
        if (categoriesRef.current) {
            const scrollAmount = 200;
            categoriesRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
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
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
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
                onClick={(e) => handleFavoriteToggle(product.id, e)}
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
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

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
                <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                        <h3 className="font-heading font-medium text-sm text-foreground mb-1 line-clamp-1">
                            {product.name}
                        </h3>
                        <div className="flex items-center space-x-1 mb-1">
                            <Icon name="Store" size={12} className="text-muted-foreground" />
                            <span className="text-xs text-primary hover:text-primary/80 transition-colors duration-200">
                                {product.vendor}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                • {product.vendorDistance}km
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center space-x-1">
                        {renderStars(product.rating).slice(0, 5)}
                    </div>
                    <span className="text-xs font-body font-medium text-foreground">
                        {product.rating.toFixed(1)}
                    </span>
                    <span className="text-xs font-caption text-muted-foreground">
                        ({product.reviewCount})
                    </span>
                </div>

                {/* Price with discount */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-baseline space-x-1">
                        <span className="text-lg font-heading font-bold text-foreground">
                            {formatPrice(product.price)}
                        </span>
                        <span className="text-xs font-caption text-muted-foreground">
                            /{product.unit}
                        </span>
                    </div>
                    {product.discount && (
                        <span className="text-xs font-caption bg-error text-error-foreground px-2 py-1 rounded-full font-medium">
                            -{product.discount}%
                        </span>
                    )}
                    {product.originalPrice && (
                        <span className="text-xs font-caption text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>

                <div className="mt-auto">
                    <Button
                        variant="default"
                        size="xs"
                        fullWidth
                        onClick={(e) => handleWhatsAppContact(product, e)}
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
            <div className="aspect-[4/3] bg-muted" />
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
                {/* Fixed Search and Filter Bar */}
                <div className={`bg-card border-b border-border sticky z-40 transition-all duration-300 ease-in-out ${
                    isHeaderVisible ? 'top-16' : 'top-0'
                }`}>
                    <div className="container mx-auto px-3 py-3">
                        {/* Categories with arrows - MOVED TO TOP */}
                        <div className="relative mb-1">
                            {showCategoryArrows && (
                                <button
                                    onClick={() => scrollCategories('left')}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors duration-200"
                                >
                                    <Icon name="ChevronLeft" size={16} />
                                </button>
                            )}
                            
                            <div 
                                ref={categoriesRef}
                                className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
                                style={{ 
                                    paddingLeft: showCategoryArrows ? '2.5rem' : '0',
                                    paddingRight: showCategoryArrows ? '2.5rem' : '0'
                                }}
                            >
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all duration-200 border ${
                                            activeCategory === category.id
                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-primary/30'
                                        }`}
                                    >
                                        <Icon name={category.icon} size={16} />
                                        <span>{category.label}</span>
                                    </button>
                                ))}
                            </div>

                            {showCategoryArrows && (
                                <button
                                    onClick={() => scrollCategories('right')}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors duration-200"
                                >
                                    <Icon name="ChevronRight" size={16} />
                                </button>
                            )}
                        </div>

                        {/* Search and Filter controls */}
                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
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

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className="flex items-center space-x-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-body font-medium text-foreground hover:bg-muted/80 transition-colors duration-200 whitespace-nowrap"
                                >
                                    <Icon name="ArrowUpDown" size={16} className="text-primary" />
                                    <span className="hidden sm:inline">
                                        {sortOptions.find(opt => opt.value === sortBy)?.label}
                                    </span>
                                    <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showSortDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                                        <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-48">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setShowSortDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm font-body transition-colors duration-200 ${
                                                        sortBy === option.value
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'text-foreground hover:bg-muted'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="container mx-auto px-4 py-8">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[...Array(10)].map((_, index) => (
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {displayedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

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