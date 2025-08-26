import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedProducts = ({ className = '' }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const featuredProducts = [
        {
            id: 1,
            name: "Tomates Orgânicos Premium",
            vendor: "Fazenda Verde",
            price: 8.50,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1546470427-e5ac89c8ba37?w=300&h=300&fit=crop",
            rating: 4.8,
            available: true,
            isOrganic: true,
            vendorId: 1,
            isFeatured: true
        },
        {
            id: 2,
            name: "Alface Americana Hidropônica",
            vendor: "Hortifruti do João",
            price: 3.20,
            unit: "unidade",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
            rating: 4.6,
            available: true,
            isOrganic: false,
            vendorId: 2,
            isFeatured: true
        },
        {
            id: 3,
            name: "Cenouras Baby Orgânicas",
            vendor: "Sítio das Frutas",
            price: 6.80,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop",
            rating: 4.9,
            available: true,
            isOrganic: true,
            vendorId: 3,
            isFeatured: true
        },
        {
            id: 4,
            name: "Banana Prata Doce",
            vendor: "Fazenda São José",
            price: 6.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
            rating: 4.5,
            available: true,
            isOrganic: false,
            vendorId: 4,
            isFeatured: true
        },
        {
            id: 5,
            name: "Manjericão Fresco",
            vendor: "Horta Urbana",
            price: 2.50,
            unit: "maço",
            image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=300&h=300&fit=crop",
            rating: 4.7,
            available: true,
            isOrganic: true,
            vendorId: 5,
            isFeatured: true
        },
        {
            id: 6,
            name: "Maçã Fuji Premium",
            vendor: "Pomar do Vale",
            price: 9.90,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
            rating: 4.4,
            available: true,
            isOrganic: false,
            vendorId: 6,
            isFeatured: true
        },
        {
            id: 7,
            name: "Rúcula Orgânica",
            vendor: "Verde Vida",
            price: 4.00,
            unit: "maço",
            image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop",
            rating: 4.8,
            available: true,
            isOrganic: true,
            vendorId: 7,
            isFeatured: true
        },
        {
            id: 8,
            name: "Abóbora Cabotiá",
            vendor: "Fazenda Orgânica",
            price: 4.20,
            unit: "kg",
            image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop",
            rating: 4.6,
            available: true,
            isOrganic: true,
            vendorId: 8,
            isFeatured: true
        }
    ];

    // Responsive pagination
    const getProductsPerPage = () => {
        if (window.innerWidth >= 1024) return 4; // Desktop
        if (window.innerWidth >= 768) return 3; // Tablet
        return 2; // Mobile
    };

    const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage());

    useEffect(() => {
        const handleResize = () => {
            setProductsPerPage(getProductsPerPage());
            setCurrentPage(0); // Reset to first page on resize
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(featuredProducts.length / productsPerPage);
    const currentProducts = featuredProducts.slice(
        currentPage * productsPerPage,
        (currentPage + 1) * productsPerPage
    );

    const handleProductClick = (product) => {
        // Navigate to product details or open modal
        console.log('Product clicked:', product);
    };

    const handleProductInquiry = (product, e) => {
        e?.stopPropagation();
        const message = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name} (${product.unit}). Está disponível?`);
        const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const ProductCard = ({ product }) => (
        <div
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full"
            onClick={() => handleProductClick(product)}
        >
            {/* Product Image */}
            <div className="relative aspect-square bg-muted overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Featured Badge */}
                <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-caption font-medium">
                    Destaque
                </div>

                {/* Organic Badge */}
                {product.isOrganic && (
                    <div className="absolute top-3 right-3 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-caption font-medium">
                        Orgânico
                    </div>
                )}

                {/* Availability Status */}
                {!product.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-body font-medium">Indisponível</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col">
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

                {/* Vendor Name */}
                <div className="text-sm text-muted-foreground mb-4">
                    <span>{product.vendor}</span>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                    <Button
                        variant="default"
                        size="sm"
                        iconName="MessageCircle"
                        fullWidth
                        disabled={!product.available}
                        onClick={(e) => handleProductInquiry(product, e)}
                        className="bg-success hover:bg-success/90 py-5"
                    >
                        {product.available ? 'Perguntar' : 'Indisponível'}
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                        Produtos em Destaque
                    </h2>
                    <p className="text-sm font-body text-muted-foreground">
                        Os melhores produtos selecionados especialmente para você
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/products')}
                    iconName="ArrowRight"
                    iconPosition="right"
                >
                    Ver todos
                </Button>
            </div>

            {/* Products Grid with Pagination */}
            <div className="relative">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {currentProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-4 mt-6">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon name="ChevronLeft" size={16} />
                        </button>

                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={`w-8 h-8 rounded-full text-sm font-body font-medium transition-colors duration-200 ${
                                        index === currentPage
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon name="ChevronRight" size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeaturedProducts;