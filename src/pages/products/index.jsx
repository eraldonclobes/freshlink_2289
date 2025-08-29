import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
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
    const [sortBy, setSortBy] = useState('distance');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [activeMainCategory, setActiveMainCategory] = useState('all');
    const [activeSubCategory, setActiveSubCategory] = useState('all');
    const [mainCategoryStartIndex, setMainCategoryStartIndex] = useState(0);
    const [subCategoryStartIndex, setSubCategoryStartIndex] = useState(0);

    const PRODUCTS_PER_PAGE = 12;
    const CATEGORIES_PER_VIEW = 6;
    const SUB_CATEGORIES_PER_VIEW = 8;

    const sortOptions = [
        { value: 'distance', label: 'Mais próximos' },
        { value: 'price_asc', label: 'Menor preço' },
        { value: 'price_desc', label: 'Maior preço' },
        { value: 'name', label: 'Nome A-Z' },
        { value: 'rating', label: 'Melhor avaliados' }
    ];

    const mainCategories = [
        { id: 'all', label: 'Tudo', icon: 'Grid3X3' },
        { id: 'ofertas', label: 'Ofertas até 30%', icon: 'Tag' },
        { id: 'organicos', label: 'Orgânicos', icon: 'Leaf' },
        { id: 'frutas', label: 'Frutas', icon: 'Apple' },
        { id: 'verduras', label: 'Verduras', icon: 'Carrot' },
        { id: 'legumes', label: 'Legumes', icon: 'Wheat' },
        { id: 'temperos', label: 'Temperos', icon: 'Flower2' },
        { id: 'laticinios', label: 'Laticínios', icon: 'Milk' }
    ];

    const subCategories = {
        all: [
            { id: 'all', label: 'Tudo' },
            { id: 'ofertas', label: 'Ofertas' },
            { id: 'novos', label: 'Novos' },
            { id: 'populares', label: 'Populares' }
        ],
        ofertas: [
            { id: 'all', label: 'Todas ofertas' },
            { id: '10-20', label: '10-20% off' },
            { id: '20-30', label: '20-30% off' },
            { id: 'promocao', label: 'Promoção' }
        ],
        organicos: [
            { id: 'all', label: 'Todos orgânicos' },
            { id: 'certificados', label: 'Certificados' },
            { id: 'biodinamicos', label: 'Biodinâmicos' },
            { id: 'naturais', label: 'Naturais' }
        ],
        frutas: [
            { id: 'all', label: 'Todas frutas' },
            { id: 'citricas', label: 'Cítricas' },
            { id: 'tropicais', label: 'Tropicais' },
            { id: 'vermelhas', label: 'Vermelhas' },
            { id: 'doces', label: 'Doces' }
        ],
        verduras: [
            { id: 'all', label: 'Todas verduras' },
            { id: 'folhosas', label: 'Folhosas' },
            { id: 'cruciferas', label: 'Crucíferas' },
            { id: 'aromáticas', label: 'Aromáticas' }
        ],
        legumes: [
            { id: 'all', label: 'Todos legumes' },
            { id: 'raizes', label: 'Raízes' },
            { id: 'tuberculos', label: 'Tubérculos' },
            { id: 'bulbos', label: 'Bulbos' }
        ],
        temperos: [
            { id: 'all', label: 'Todos temperos' },
            { id: 'frescos', label: 'Frescos' },
            { id: 'secos', label: 'Secos' },
            { id: 'especiarias', label: 'Especiarias' }
        ],
        laticinios: [
            { id: 'all', label: 'Todos laticínios' },
            { id: 'queijos', label: 'Queijos' },
            { id: 'iogurtes', label: 'Iogurtes' },
            { id: 'leites', label: 'Leites' }
        ]
    };

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
            setShowSortDropdown(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Filter and sort products
    useEffect(() => {
        filterAndSortProducts();
    }, [products, searchQuery, sortBy, activeMainCategory, activeSubCategory]);

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

        // Filter by main category
        if (activeMainCategory && activeMainCategory !== 'all') {
            if (activeMainCategory === 'ofertas') {
                filtered = filtered.filter(product => product.discount);
            } else {
                filtered = filtered.filter(product =>
                    product.categories?.some(cat =>
                        cat.toLowerCase().includes(activeMainCategory.toLowerCase())
                    )
                );
            }
        }

        // Filter by sub category
        if (activeSubCategory && activeSubCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.categories?.some(cat =>
                    cat.toLowerCase().includes(activeSubCategory.toLowerCase())
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
    }, [searchQuery, sortBy, activeMainCategory, activeSubCategory]);

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
        const trimmedQuery = query?.trim() || '';
        setSearchQuery(trimmedQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        filterAndSortProducts();
    };

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

    const handleMainCategoryChange = (categoryId) => {
        setActiveMainCategory(categoryId);
        setActiveSubCategory('all');
        setSubCategoryStartIndex(0);
    };

    const handleSubCategoryChange = (subCategoryId) => {
        setActiveSubCategory(subCategoryId);
    };

    const navigateMainCategories = (direction) => {
        const maxIndex = Math.max(0, mainCategories.length - CATEGORIES_PER_VIEW);
        if (direction === 'prev') {
            setMainCategoryStartIndex(Math.max(0, mainCategoryStartIndex - 1));
        } else {
            setMainCategoryStartIndex(Math.min(maxIndex, mainCategoryStartIndex + 1));
        }
    };

    const navigateSubCategories = (direction) => {
        const currentSubCategories = subCategories[activeMainCategory] || [];
        const maxIndex = Math.max(0, currentSubCategories.length - SUB_CATEGORIES_PER_VIEW);
        if (direction === 'prev') {
            setSubCategoryStartIndex(Math.max(0, subCategoryStartIndex - 1));
        } else {
            setSubCategoryStartIndex(Math.min(maxIndex, subCategoryStartIndex + 1));
        }
    };

    const visibleMainCategories = mainCategories.slice(
        mainCategoryStartIndex, 
        mainCategoryStartIndex + CATEGORIES_PER_VIEW
    );

    const currentSubCategories = subCategories[activeMainCategory] || [];
    const visibleSubCategories = currentSubCategories.slice(
        subCategoryStartIndex,
        subCategoryStartIndex + SUB_CATEGORIES_PER_VIEW
    );

    const displayedProducts = filteredProducts.slice(0, currentPage * PRODUCTS_PER_PAGE);
    const hasMoreToShow = displayedProducts.length < filteredProducts.length;

    // Sort Filter Component
    const SortFilter = () => (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowSortDropdown(!showSortDropdown);
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
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-full"
            onClick={() => handleProductClick(product)}
        >
            {/* Discount Badge */}
            {product?.discount && (
                <div className="absolute top-2 left-2 z-10 bg-destructive text-destructive-foreground text-xs font-caption font-medium px-2 py-1 rounded-full">
                    -{product?.discount}%
                </div>
            )}

            {/* Favorite Button */}
            <button
                onClick={(e) => handleFavoriteToggle(product?.id, e)}
                className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${favoriteProducts.includes(product?.id)
                    ? 'bg-error text-white'
                    : 'bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-error hover:bg-white'
                    }`}
            >
                <Icon
                    name="Heart"
                    size={14}
                    className={favoriteProducts.includes(product?.id) ? 'fill-current' : ''}
                />
            </button>

            {/* Image */}
            <div className="relative h-32 overflow-hidden">
                <Image
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Availability Status */}
                {!product?.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-medium bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
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
                        <h3 className="font-heading font-medium text-sm text-foreground mb-1 line-clamp-1">
                            {product?.name}
                        </h3>
                        <div className="flex items-center space-x-1 mb-1">
                            <Icon name="Store" size={12} className="text-muted-foreground" />
                            <button
                                onClick={(e) => handleVendorClick(product, e)}
                                className="text-xs text-primary pl-1 hover:text-primary/80 hover:underline transition-colors duration-200"
                            >
                                {product?.vendor}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center space-x-1">
                        {renderStars(product?.rating || 4.5).slice(0, 5).map((star, index) => 
                            React.cloneElement(star, { key: index, size: 12 })
                        )}
                    </div>
                    <span className="text-xs font-body font-medium text-foreground">
                        {(product?.rating || 4.5).toFixed(1)}
                    </span>
                    <span className="text-xs font-caption text-muted-foreground">
                        ({product?.reviewCount || 12})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-baseline space-x-1">
                        <span className="text-lg font-heading font-bold text-foreground">
                            {formatPrice(product?.price)}
                        </span>
                        <span className="text-xs font-caption text-muted-foreground">
                            /{product?.unit}
                        </span>
                    </div>
                    {product?.originalPrice && (
                        <span className="text-xs font-caption text-muted-foreground line-through">
                            {formatPrice(product?.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                    <Button
                        variant="default"
                        size="xs"
                        fullWidth
                        onClick={(e) => handleProductInquiry(product, e)}
                        disabled={!product?.available}
                        className="bg-success hover:bg-success/90 text-xs py-2"
                    >
                        <div className="flex items-center justify-center space-x-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            <span>{product?.available ? 'Comprar por' : 'Indisponível'}</span>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
            <div className="h-32 bg-muted" />
            <div className="p-3 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ResponsiveHeader />

            <main className="pt-16 flex-1">
                {/* Fixed Header with Categories and Filters - Moves with navbar */}
                <div 
                    data-filters-header
                    className="bg-card border-b border-border sticky top-16 md:top-16 transition-all duration-300 z-40"
                    style={{ top: 'var(--navbar-height, 4rem)' }}
                >
                    <div className="container mx-auto px-4 py-3">
                        {/* Main Categories - Horizontal Style */}
                        <div className="mb-3">
                            <div className="flex items-center space-x-2">
                                {mainCategoryStartIndex > 0 && (
                                    <button
                                        onClick={() => navigateMainCategories('prev')}
                                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center flex-shrink-0"
                                    >
                                        <Icon name="ChevronLeft" size={14} />
                                    </button>
                                )}
                                
                                <div className="flex space-x-2 overflow-hidden flex-1">
                                    {visibleMainCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleMainCategoryChange(category.id)}
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-body font-medium whitespace-nowrap transition-all duration-200 border ${
                                                activeMainCategory === category.id
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                    : 'bg-gray-100 text-muted-foreground border-border hover:bg-gray-200 hover:text-foreground'
                                            }`}
                                        >
                                            <Icon name={category.icon} size={16} />
                                            <span className="text-xs">{category.label}</span>
                                        </button>
                                    ))}
                                </div>
                                
                                {mainCategories.length > CATEGORIES_PER_VIEW && mainCategoryStartIndex + CATEGORIES_PER_VIEW < mainCategories.length && (
                                    <button
                                        onClick={() => navigateMainCategories('next')}
                                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center flex-shrink-0"
                                    >
                                        <Icon name="ChevronRight" size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filters Row - Desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Search Bar - Takes available space */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Icon 
                                        name="Search" 
                                        size={14} 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                                    />
                                    <input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-10"
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

                            {/* Sort/Order Button */}
                            <div className="relative flex-shrink-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSortDropdown(!showSortDropdown);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-muted border border-border rounded-lg text-sm font-body font-medium text-foreground hover:bg-muted/80 transition-colors duration-200 whitespace-nowrap h-10"
                                >
                                    <Icon name="ArrowUpDown" size={16} className="text-primary" />
                                    <span>Ordenar</span>
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
                                        <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-56">
                                            <div className="max-h-60 overflow-y-auto">
                                                {sortOptions.map((option) => (
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
                            
                            {/* Sub Categories - Desktop */}
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                {subCategoryStartIndex > 0 && (
                                    <button
                                        onClick={() => navigateSubCategories('prev')}
                                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center flex-shrink-0"
                                    >
                                        <Icon name="ChevronLeft" size={12} />
                                    </button>
                                )}
                                
                                <div className="flex space-x-2 overflow-hidden">
                                    {visibleSubCategories.map((subCategory) => (
                                        <button
                                            key={subCategory.id}
                                            onClick={() => handleSubCategoryChange(subCategory.id)}
                                            className={`px-3 py-2 rounded-lg text-sm font-body font-medium whitespace-nowrap transition-all duration-200 border h-10 ${
                                                activeSubCategory === subCategory.id
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            {subCategory.label}
                                        </button>
                                    ))}
                                </div>
                                
                                {currentSubCategories.length > SUB_CATEGORIES_PER_VIEW && subCategoryStartIndex + SUB_CATEGORIES_PER_VIEW < currentSubCategories.length && (
                                    <button
                                        onClick={() => navigateSubCategories('next')}
                                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center flex-shrink-0"
                                    >
                                        <Icon name="ChevronRight" size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="md:hidden space-y-3">
                            {/* Search and Sort Row - Mobile */}
                            <div className="flex items-center gap-3">
                                {/* Search Bar - Mobile */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Icon 
                                            name="Search" 
                                            size={14} 
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                                        />
                                        <input
                                            type="text"
                                            placeholder="Buscar produtos..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-10"
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

                                {/* Sort Button - Mobile */}
                                <div className="relative flex-shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSortDropdown(!showSortDropdown);
                                        }}
                                        className="flex items-center space-x-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-body font-medium text-foreground hover:bg-muted/80 transition-colors duration-200 whitespace-nowrap h-10"
                                    >
                                        <Icon name="ArrowUpDown" size={16} className="text-primary" />
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
                                            <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-52">
                                                <div className="max-h-60 overflow-y-auto">
                                                    {sortOptions.map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => {
                                                                setSortBy(option.value);
                                                                setShowSortDropdown(false);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-body transition-colors duration-200 ${
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
                            </div>

                            {/* Sub Categories Row - Mobile */}
                            <div className="flex items-center space-x-2">
                                {subCategoryStartIndex > 0 && (
                                    <button
                                        onClick={() => navigateSubCategories('prev')}
                                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center flex-shrink-0"
                                    >
                                        <Icon name="ChevronLeft" size={12} />
                                    </button>
                                )}
                                
                                <div className="flex space-x-2 overflow-hidden flex-1">
                                    {visibleSubCategories.map((subCategory) => (
                                        <button
                                            key={subCategory.id}
                                            onClick={() => handleSubCategoryChange(subCategory.id)}
                                            className={`px-3 py-2 rounded-lg text-sm font-body font-medium whitespace-nowrap transition-all duration-200 border h-9 ${
                                                activeSubCategory === subCategory.id
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            {subCategory.label}
                                        </button>
                                    ))}
                                </div>
                                
                                {currentSubCategories.length > SUB_CATEGORIES_PER_VIEW && subCategoryStartIndex + SUB_CATEGORIES_PER_VIEW < currentSubCategories.length && (
                                    <button
                                        onClick={() => navigateSubCategories('next')}
                                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center flex-shrink-0"
                                    >
                                        <Icon name="ChevronRight" size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                {/* Products Grid */}
                <div className="container mx-auto px-4 py-8">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[...Array(12)].map((_, index) => (
                                <LoadingSkeleton key={index} />
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {displayedProducts.map((product) => (
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

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProductsPage;