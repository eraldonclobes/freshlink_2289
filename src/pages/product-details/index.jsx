import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import ShareModal from '../../components/ui/ShareModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showShareModal, setShowShareModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]);

    // Mock product data
    const mockProducts = [
        {
            id: 1,
            name: "Tomate Orgânico Premium",
            brand: "Fazenda Verde",
            rating: 4.8,
            reviewCount: 45,
            watchCount: 156,
            price: 8.50,
            originalPrice: 10.00,
            discount: 15,
            images: [
                "https://images.unsplash.com/photo-1546470427-e5ac89c8ba37?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1533280349977-2dc2608f4d62?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop"
            ],
            description: "Tomates orgânicos premium cultivados sem agrotóxicos em nossa fazenda familiar. Estes tomates são colhidos no ponto ideal de maturação, garantindo sabor intenso e textura perfeita. Ideais para saladas, molhos caseiros e pratos gourmet. Cultivados com técnicas sustentáveis e certificação orgânica.",
            available: true,
            isOrganic: true,
            productType: "organic",
            category: "Legumes",
            stock: 25,
            unit: "kg",
            vendorId: 1,
            nutritionalInfo: {
                calories: "18 kcal por 100g",
                vitamins: ["Vitamina C", "Vitamina K", "Folato"],
                minerals: ["Potássio", "Licopeno"]
            },
            harvestDate: "2024-01-15",
            shelfLife: "7-10 dias refrigerado"
        }
    ];

    // Mock vendor data
    const mockVendor = {
        id: 1,
        name: "Fazenda Verde Orgânicos",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
        location: "Vila Madalena, São Paulo",
        distance: "2.3 km",
        phone: "11999999999",
        rating: 4.8,
        reviewCount: 127,
        productCount: 24,
        description: "Fazenda familiar especializada em produtos orgânicos há mais de 20 anos."
    };

    useEffect(() => {
        const loadProductDetails = async () => {
            setLoading(true);
            
            // Get product from location state or mock data
            const productFromState = location.state?.product;
            const vendorFromState = location.state?.vendor;
            
            if (productFromState) {
                setProduct(productFromState);
                setVendor(vendorFromState || mockVendor);
            } else {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                const foundProduct = mockProducts.find(p => p.id.toString() === productId);
                setProduct(foundProduct || mockProducts[0]);
                setVendor(mockVendor);
            }
            
            setLoading(false);
        };

        loadProductDetails();

        // Load favorites
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
        setFavoriteProducts(savedFavorites);
    }, [productId, location.state]);

    const handleWhatsAppContact = () => {
        const message = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name}. Está disponível?`);
        const whatsappUrl = `https://wa.me/55${vendor?.phone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    const handleFavoriteToggle = () => {
        const updatedFavorites = favoriteProducts.includes(product.id)
            ? favoriteProducts.filter(id => id !== product.id)
            : [...favoriteProducts, product.id];
        
        setFavoriteProducts(updatedFavorites);
        localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
    };

    const handleVendorClick = () => {
        navigate('/vendor-profile-products', { state: { vendorId: vendor?.id } });
    };

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
                <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Icon key="half" name="StarHalf" size={16} className="text-warning fill-current" />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
            );
        }

        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <ResponsiveHeader />
                <main className="pt-16 flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Carregando produto...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <ResponsiveHeader />
                <main className="pt-16 flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
                            Produto não encontrado
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            O produto que você está procurando não existe ou foi removido.
                        </p>
                        <Button onClick={() => navigate('/products')}>
                            Voltar aos Produtos
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    const images = Array.isArray(product.images) ? product.images : [product.image];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ResponsiveHeader />
            
            <main className="pt-16 flex-1">
                {/* Breadcrumb */}
                <div className="bg-muted/50 border-b border-border">
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center space-x-2 text-sm font-body">
                            <button 
                                onClick={() => navigate('/products')}
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                Produtos
                            </button>
                            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                            <button 
                                onClick={() => navigate('/products', { state: { categoryFilter: product.category?.toLowerCase() } })}
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                {product.category}
                            </button>
                            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                            <span className="text-foreground font-medium truncate">{product.name}</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Section */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-square bg-background rounded-xl overflow-hidden border border-border relative group">
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-background transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            <Icon name="ChevronLeft" size={20} className="text-foreground" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-background transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            <Icon name="ChevronRight" size={20} className="text-foreground" />
                                        </button>
                                    </>
                                )}

                                {/* Favorite Button */}
                                <button
                                    onClick={handleFavoriteToggle}
                                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        favoriteProducts.includes(product.id)
                                            ? 'bg-error text-white'
                                            : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-error hover:bg-background'
                                    }`}
                                >
                                    <Icon 
                                        name="Heart" 
                                        size={20} 
                                        className={favoriteProducts.includes(product.id) ? 'fill-current' : ''} 
                                    />
                                </button>

                                {/* Discount Badge */}
                                {product.discount && (
                                    <div className="absolute top-4 left-4 bg-error text-error-foreground px-3 py-1 rounded-full text-sm font-caption font-medium">
                                        -{product.discount}%
                                    </div>
                                )}

                                {/* Organic Badge */}
                                {product.isOrganic && (
                                    <div className="absolute bottom-4 left-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-caption font-medium flex items-center space-x-1">
                                        <Icon name="Leaf" size={14} />
                                        <span>Orgânico</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {images.length > 1 && (
                                <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-background shadow-sm flex-shrink-0 ${
                                                index === currentImageIndex
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
                                    {product.name}
                                </h1>

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-1">
                                        {renderStars(product.rating)}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        {product.rating?.toFixed(1)}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        ({product.reviewCount} avaliações)
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-3xl font-heading font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="text-muted-foreground">
                                            por {product.unit}
                                        </span>
                                    </div>
                                    {product.originalPrice && (
                                        <span className="text-lg text-muted-foreground line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                </div>

                                {product.description && (
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        {product.description}
                                    </p>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                                <h3 className="font-body font-semibold text-foreground">
                                    Informações do Produto
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Categoria:</span>
                                        <span className="ml-2 font-medium text-foreground">{product.category}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Estoque:</span>
                                        <span className="ml-2 font-medium text-foreground">
                                            {product.stock} {product.unit}
                                        </span>
                                    </div>
                                    {product.harvestDate && (
                                        <div>
                                            <span className="text-muted-foreground">Colheita:</span>
                                            <span className="ml-2 font-medium text-foreground">
                                                {new Date(product.harvestDate).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    )}
                                    {product.shelfLife && (
                                        <div>
                                            <span className="text-muted-foreground">Validade:</span>
                                            <span className="ml-2 font-medium text-foreground">{product.shelfLife}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nutritional Info */}
                            {product.nutritionalInfo && (
                                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                                    <h3 className="font-body font-semibold text-foreground">
                                        Informações Nutricionais
                                    </h3>
                                    <div className="space-y-3">
                                        {product.nutritionalInfo.calories && (
                                            <div className="flex items-center space-x-2">
                                                <Icon name="Zap" size={16} className="text-warning" />
                                                <span className="text-sm text-foreground">{product.nutritionalInfo.calories}</span>
                                            </div>
                                        )}
                                        {product.nutritionalInfo.vitamins && (
                                            <div>
                                                <p className="text-sm font-medium text-foreground mb-2">Vitaminas:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.nutritionalInfo.vitamins.map((vitamin, index) => (
                                                        <span key={index} className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                                                            {vitamin}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {product.nutritionalInfo.minerals && (
                                            <div>
                                                <p className="text-sm font-medium text-foreground mb-2">Minerais:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.nutritionalInfo.minerals.map((mineral, index) => (
                                                        <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                                            {mineral}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Vendor Info */}
                            {vendor && (
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h3 className="font-body font-semibold text-foreground mb-4">
                                        Vendedor
                                    </h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                                            <Image
                                                src={vendor.image}
                                                alt={vendor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-body font-medium text-foreground">{vendor.name}</h4>
                                            <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                                                <Icon name="MapPin" size={14} />
                                                <span>{vendor.location}</span>
                                                {vendor.distance && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{vendor.distance}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center space-x-1">
                                                    {renderStars(vendor.rating)}
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {vendor.rating?.toFixed(1)}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    ({vendor.reviewCount} avaliações)
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleVendorClick}
                                        >
                                            Ver Perfil
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                <div className="flex space-x-3">
                                    <Button
                                        variant="default"
                                        size="lg"
                                        iconName="MessageCircle"
                                        onClick={handleWhatsAppContact}
                                        className="bg-success hover:bg-success/90 flex-1"
                                        disabled={!product.available}
                                    >
                                        {product.available ? 'Perguntar no WhatsApp' : 'Indisponível'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        iconName="Share"
                                        onClick={handleShare}
                                    >
                                        Compartilhar
                                    </Button>
                                </div>

                                {/* Stock Status */}
                                <div className="flex items-center justify-center space-x-2 text-sm">
                                    <div className={`w-2 h-2 rounded-full ${product.available ? 'bg-success' : 'bg-error'}`}></div>
                                    <span className={product.available ? 'text-success' : 'text-error'}>
                                        {product.available ? `${product.stock} ${product.unit} disponível` : 'Produto indisponível'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                product={product}
                vendor={vendor}
                type="product"
            />

            <Footer />
        </div>
    );
};

export default ProductDetails;