import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductGrid = ({ products, vendor, onFavoriteToggle, favoriteProducts = [] }) => {
    const navigate = useNavigate();

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

    const handleProductClick = (product) => {
        navigate(`/product-details/${product.id}`, {
            state: {
                product: {
                    ...product,
                    rating: product.rating || 4.5,
                    reviewCount: product.reviewCount || 12
                },
                vendor
            }
        });
    };

    const handleVendorClick = (e) => {
        e?.stopPropagation();
        navigate('/vendor-profile-products', { state: { vendorId: vendor?.id } });
    };

    const handleProductInquiry = (product, e) => {
        e?.stopPropagation();
        const message = encodeURIComponent(`Olá ${vendor?.name}! Vi o produto "${product.name}" no FreshLink e gostaria de saber mais informações.`);
        const whatsappUrl = `https://wa.me/55${vendor?.phone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleFavoriteClick = (productId, e) => {
        e?.stopPropagation();
        onFavoriteToggle?.(productId);
    };

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
                onClick={(e) => handleFavoriteClick(product?.id, e)}
                className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    favoriteProducts.includes(product?.id)
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
                                onClick={handleVendorClick}
                                className="text-sm text-primary pl-1 hover:text-primary/80 hover:underline transition-colors duration-200"
                            >
                                {vendor?.name}
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

    if (products?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon name="Package" size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    Nenhum produto encontrado
                </h3>
                <p className="text-muted-foreground font-body">
                    Não há produtos disponíveis nesta categoria no momento.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
                <ProductCard
                    key={product?.id}
                    product={product}
                />
            ))}
        </div>
    );
};

export default ProductGrid;