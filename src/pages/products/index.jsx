import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import ProductModal from '../../components/ui/ProductModal';
import SearchBar from '../../components/ui/SearchBar';
import LocationSelector from '../../components/ui/LocationSelector';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const ProductsPage = () => {
    const navigate = useNavigate();
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
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

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

    // Mock products data - Enhanced to match FeaturedProducts structure
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
            reviewCount: 45,
            available: true,
            isOrganic: true,
            vendorId: 1,
            discount: 15,
            originalPrice: 10.00,
            description: "Tomates frescos cultivados sem agrotóxicos, direto da nossa horta familiar.",
            categories: ["Orgânicos", "Verduras", "Legumes"],
            rating: 4.8,
            reviewCount: 23
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
            reviewCount: 32,
            available: true,
            isOrganic: false,
            vendorId: 2,
            discount: null,
            originalPrice: null,
            description: "Alface fresca cultivada em sistema hidropônico, crocante e saborosa.",
            categories: ["Verduras", "Hidropônico"],
            rating: 4.6,
            reviewCount: 18
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
            reviewCount: 67,
            available: true,
            isOrganic: true,
            vendorId: 3,
            discount: 20,
            originalPrice: 6.00,
            description: "Cenouras orgânicas doces e crocantes, perfeitas para qualquer receita.",
            categories: ["Orgânicos", "Legumes"],
            rating: 4.7,
            reviewCount: 29
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
            reviewCount: 78,
            available: true,
            isOrganic: false,
            vendorId: 4,
            discount: 10,
            originalPrice: 7.67,
            description: "Bananas doces e maduras, ricas em potássio.",
            categories: ["Frutas", "Natural"],
            rating: 4.5,
            reviewCount: 34
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
            reviewCount: 23,
            available: true,
            isOrganic: true,
            vendorId: 5,
            discount: null,
            originalPrice: null,
            description: "Manjericão fresco e aromático, ideal para temperos e molhos.",
            categories: ["Orgânicos", "Temperos", "Aromáticas"],
            rating: 4.9,
            reviewCount: 15
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
            reviewCount: 56,
            available: false,
            isOrganic: false,
            vendorId: 6,
            discount: null,
            originalPrice: null,
            description: "Maçãs Fuji doces e crocantes, cultivadas tradicionalmente.",
            categories: ["Frutas", "Doces"],
            rating: 4.4,
            reviewCount: 41
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
            reviewCount: 41,
            available: true,
            isOrganic: true,
            vendorId: 7,
            discount: 25,
            originalPrice: 5.33,
            description: "Rúcula orgânica com sabor marcante, perfeita para saladas.",
            categories: ["Orgânicos", "Verduras", "Folhosos"],
            rating: 4.6,
            reviewCount: 22
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
            reviewCount: 29,
            available: true,
            isOrganic: true,
            vendorId: 8,
            discount: null,
            originalPrice: null,
            description: "Abóbora cabotiá orgânica, doce e nutritiva.",
            categories: ["Orgânicos", "Legumes", "Raízes"],
            rating: 4.3,
            reviewCount: 8
        }
    ];

const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        // Estrelas preenchidas
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Icon
                    key={`full-${i}`}
                    name="Star"
                    size={14}
                    className="text-warning fill-current"
                />
            );
        }
        
        // Meia estrela
        if (hasHalfStar) {
            stars.push(
                <Icon
                    key="half"
                    name="Star"
                    size={14}
                    className="text-warning fill-current opacity-50"
                />
            );
        }
        
        // Estrelas vazias
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Icon
                    key={`empty-${i}`}
                    name="Star"
                    size={14}
                    className="text-muted-foreground"
                />
            );
        }
        
        return stars;
    };
  
    // Load initial products
    useEffect(() => {
        loadProducts();
        // Load favorite products from localStorage (but don't use it in artifacts)
        // const savedFavorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
        // setFavoriteProducts(savedFavorites);

        // Check for category filter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            setCategoryFilter(category);
        }

        // Close dropdowns when clicking outside
        const handleClickOutside = () => {
            setShowCategoryDropdown(false);
            setShowSortDropdown(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Filter and sort products
    useEffect(() => {
        filterAndSortProducts();
    }, [products, searchQuery, currentLocation, sortBy, categoryFilter]);

    // Garantir que quando searchQuery for vazio, recarregue todos os produtos
    useEffect(() => {
        if (searchQuery === '') {
            filterAndSortProducts();
        }
    }, [searchQuery]);

    const loadProducts = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setLoading(false);
    };

    const filterAndSortProducts = useCallback(() => {
        let filtered = [...mockProducts];

        // Filter by search query - só filtra se houver texto
        if (searchQuery && searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.vendor.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter) {
            filtered = filtered.filter(product =>
                product.categories?.some(cat =>
                    cat.toLowerCase().includes(categoryFilter.toLowerCase())
                )
            );
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

    // Função para verificar se uma string é similar a outra (busca aproximada)
    const isSimilar = (text, query) => {
        if (!text || !query) return false;
        
        const textLower = text.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Verifica se contém a busca
        if (textLower.includes(queryLower)) return true;
        
        // Busca por palavras similares (permite erros de digitação)
        const words = textLower.split(' ');
        return words.some(word => {
            if (word.length <= 3) return word.includes(queryLower);
            
            // Para palavras maiores, permite 1-2 caracteres diferentes
            let differences = 0;
            const minLength = Math.min(word.length, queryLower.length);
            const maxLength = Math.max(word.length, queryLower.length);
            
            for (let i = 0; i < minLength; i++) {
                if (word[i] !== queryLower[i]) differences++;
            }
            differences += maxLength - minLength;
            
            return differences <= Math.floor(word.length * 0.3);
        });
    };

    // Gerar sugestões dinâmicas baseadas nos produtos disponíveis
    const generateSuggestions = (query) => {
        if (!query || !query.trim()) return [];

        const suggestions = [];
        const addedNames = new Set();

        // Buscar produtos similares
        mockProducts.forEach(product => {
            if (isSimilar(product.name, query) && !addedNames.has(product.name)) {
                suggestions.push({
                    id: product.id,
                    type: 'product',
                    name: product.name,
                    category: 'Produto',
                    productId: product.id,
                    vendorId: product.vendorId
                });
                addedNames.add(product.name);
            }
        });

        // Buscar vendedores similares
        const addedVendors = new Set();
        mockProducts.forEach(product => {
            if (isSimilar(product.vendor, query) && !addedVendors.has(product.vendor)) {
                suggestions.push({
                    id: `vendor_${product.vendorId}`,
                    type: 'vendor',
                    name: product.vendor,
                    category: 'Vendedor',
                    vendorId: product.vendorId
                });
                addedVendors.add(product.vendor);
            }
        });

        return suggestions.slice(0, 5); // Limitar a 5 sugestões
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        filterAndSortProducts();
    };

    const handleSearchSubmit = (query) => {
        const trimmedQuery = query?.trim() || '';
        setSearchQuery(trimmedQuery);
        if (!trimmedQuery) {
            // Se vazio, recarregar todos os produtos
            filterAndSortProducts();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'vendor') {
            navigate('/vendor-profile-products', { state: { vendorId: suggestion.vendorId } });
        } else if (suggestion.type === 'product') {
            // Definir a query de busca com o nome do produto
            setSearchQuery(suggestion.name);
        }
    };

    const handleLocationChange = (location) => {
        setCurrentLocation(location);
    };

    // Filtrar sugestões baseadas na query atual - só aparecem se há texto digitado
    const filteredSuggestions = searchQuery && searchQuery.trim().length > 0 ? generateSuggestions(searchQuery) : [];

    const handleProductInquiry = (product, e) => {
        e?.stopPropagation();
        const message = encodeURIComponent(`Olá ${product.vendor}! Vi o produto "${product.name}" no FreshLink e gostaria de saber mais informações.`);
        const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleProductClick = (product) => {
        // Navigate to product details page instead of opening modal
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

    const handleVendorClick = (product, e) => {
        e?.stopPropagation();
        navigate('/vendor-profile-products', { state: { vendorId: product.vendorId } });
    };

    const handleCategoryClick = (category, e) => {
        e?.stopPropagation();
        navigate('/products', { state: { categoryFilter: category } });
    };

    const handleFavoriteToggle = (productId, e) => {
        e?.stopPropagation();
        const updatedFavorites = favoriteProducts.includes(productId)
            ? favoriteProducts.filter(id => id !== productId)
            : [...favoriteProducts, productId];

        setFavoriteProducts(updatedFavorites);
        // localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
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

    // Category Filter Component
    const CategoryFilter = () => (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowCategoryDropdown(!showCategoryDropdown);
                    setShowSortDropdown(false);
                }}
                className="flex items-center space-x-2 px-3 py-3 bg-muted border border-border rounded-lg text-sm font-body font-medium text-foreground hover:bg-muted/80 transition-colors duration-200 whitespace-nowrap"
            >
                <Icon name="Filter" size={16} className="text-primary" />
                <span className="hidden sm:inline">
                    {categoryOptions.find(opt => opt.value === categoryFilter)?.label || 'Categoria'}
                </span>
                <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform duration-200 ${
                        showCategoryDropdown ? 'rotate-180' : ''
                    }`} 
                />
            </button>
            
            {showCategoryDropdown && (
                <>
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowCategoryDropdown(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-64">
                        <div className="max-h-60 overflow-y-auto">
                            {categoryOptions.map((option, index) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setCategoryFilter(option.value);
                                        setShowCategoryDropdown(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-body transition-colors duration-200 ${
                                        categoryFilter === option.value
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground hover:bg-muted'
                                    }`}
                                >
                                    <span className="font-medium">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    // Sort Filter Component
    const SortFilter = () => (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowSortDropdown(!showSortDropdown);
                    setShowCategoryDropdown(false);
                }}
                className="flex items-center space-x-2 px-3 py-3 bg-muted border border-border rounded-lg text-sm font-body font-medium text-foreground hover:bg-muted/80 transition-colors duration-200 whitespace-nowrap"
            >
                <Icon name="ArrowUpDown" size={16} className="text-primary" />
                <span className="hidden sm:inline">
                    {sortOptions.find(opt => opt.value === sortBy)?.label || 'Ordenar'}
                </span>
                <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform duration-200 ${
                        showSortDropdown ? 'rotate-180' : ''
                    }`} 
                />
            </button>
            
            {showSortDropdown && (
                <>
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-64">
                        <div className="max-h-60 overflow-y-auto">
                            {sortOptions.map((option, index) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortBy(option.value);
                                        setShowSortDropdown(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-body transition-colors duration-200 ${
                                        sortBy === option.value
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground hover:bg-muted'
                                    }`}
                                >
                                    <span className="font-medium">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    // ProductCard component using FeaturedProducts styling
    const ProductCard = ({ product }) => (
        <div
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full"
            onClick={() => handleProductClick(product)}
        >
            {/* Discount Badge */}
            {product?.discount && (
                <div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-xs font-caption font-medium px-2 py-1 rounded-full">
                    -{product?.discount}%
                </div>
            )}

            {/* Favorite Button */}
            <button
                onClick={(e) => handleFavoriteToggle(product?.id, e)}
                className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${favoriteProducts.includes(product?.id)
                    ? 'bg-error text-white'
                    : 'bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-error hover:bg-white'
                    }`}
            >
                <Icon
                    name="Heart"
                    size={16}
                    className={favoriteProducts.includes(product?.id) ? 'fill-current' : ''}
                />
            </button>

            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Availability Status */}
                {!product?.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-body font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            Indisponível
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <h3 className="font-heading font-semibold text-lg text-foreground mb-1 line-clamp-1">
                            {product?.name}
                        </h3>
                        <div className="flex items-center space-x-1 mb-2">
                            <Icon name="Store" size={14} className="text-muted-foreground" />
                            <button
                                onClick={(e) => handleVendorClick(product, e)}
                                className="text-sm text-primary pl-1 hover:text-primary/80 hover:underline transition-colors duration-200"
                            >
                                {product?.vendor}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                        {renderStars(product?.rating || 4.5)}
                    </div>
                    <span className="text-sm font-body font-medium text-foreground">
                        {(product?.rating || 4.5).toFixed(1)}
                    </span>
                    <span className="text-sm font-caption text-muted-foreground">
                        ({product?.reviewCount || 12})
                    </span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {product?.categories?.slice(0, 3)?.map((category, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-full"
                        >
                            {category}
                        </span>
                    ))}
                    {product?.categories?.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-full">
                            +{product?.categories?.length - 3}
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-heading font-bold text-foreground">
                            {formatPrice(product?.price)}
                        </span>
                        <span className="text-sm font-caption text-muted-foreground">
                            /{product?.unit}
                        </span>
                    </div>
                    {product?.originalPrice && (
                        <span className="text-sm font-caption text-muted-foreground line-through">
                            {formatPrice(product?.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                    <Button
                        variant="default"
                        size="sm"
                        iconName="MessageCircle"
                        fullWidth
                        onClick={(e) => handleProductInquiry(product, e)}
                        disabled={!product?.available}
                        className="bg-success hover:bg-success/90"
                    >
                        {product?.available ? 'Perguntar' : 'Indisponível'}
                    </Button>
                </div>
            </div>
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="flex space-x-1">
                    {[...Array(5)]?.map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-muted rounded" />
                    ))}
                </div>
                <div className="flex space-x-1">
                    {[...Array(2)]?.map((_, i) => (
                        <div key={i} className="h-6 bg-muted rounded-full w-16" />
                    ))}
                </div>
                <div className="h-6 bg-muted rounded w-20" />
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
                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <SearchBar
                                    onSearch={handleSearch}
                                    onSearchSubmit={handleSearchSubmit}
                                    onSuggestionClick={handleSuggestionClick}
                                    onClear={handleClearSearch}
                                    suggestions={filteredSuggestions}
                                    placeholder="Buscar produtos..."
                                    value={searchQuery}
                                    showSuggestionsOnFocus={false}
                                />
                            </div>

                            {/* Filters and Actions */}
                            <div className="flex items-center space-x-3">
                                <CategoryFilter />
                                <SortFilter />
                                <LocationSelector
                                    currentLocation={currentLocation}
                                    onLocationChange={handleLocationChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="container mx-auto px-4 py-8">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, index) => (
                                <LoadingSkeleton key={index} />
                            ))}
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Icon name="Package" className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                                Nenhum produto encontrado
                            </h3>
                            <p className="text-sm font-body text-muted-foreground text-center max-w-md">
                                Tente ajustar os filtros ou expandir o raio de busca
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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